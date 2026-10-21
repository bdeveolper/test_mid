import { supabase } from '../lib/supabase'

const PRODUCT_SELECT = '*, variants(*)'
const IMAGE_BUCKET = 'product-images'

function mapProductFromDb(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    price: Number(row.price),
    images: row.images ?? [],
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    variants: (row.variants ?? []).map((variant) => ({
      id: variant.id,
      productId: variant.product_id,
      size: variant.size,
      color: variant.color,
      stock: Number(variant.stock),
    })),
  }
}

function mapProductToDb(product, includeCreatedAt = false) {
  const record = {
    name: product.name,
    description: product.description ?? '',
    category: product.category,
    price: Number(product.price),
    images: product.images ?? [],
    is_active: Boolean(product.isActive),
    updated_at: new Date().toISOString(),
  }

  if (includeCreatedAt && product.createdAt) {
    record.created_at = product.createdAt
  }

  return record
}

function normalizeVariants(variants) {
  const uniqueVariants = new Map()

  for (const variant of variants) {
    const key = JSON.stringify([variant.size, variant.color])
    if (uniqueVariants.has(key)) {
      throw new Error('لا يمكن إضافة نفس المقاس واللون أكثر من مرة.')
    }
    uniqueVariants.set(key, {
      size: variant.size,
      color: variant.color,
      stock: Number(variant.stock),
    })
  }

  return [...uniqueVariants.values()]
}

function throwIfError(error, status) {
  if (error) {
    if (import.meta.env.DEV) {
      console.error('Supabase request failed', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        status: status ?? error.status ?? error.statusCode ?? null,
      })
    }
    throw new Error(getArabicError(error), { cause: error })
  }
}

export function getArabicError(error) {
  const message = String(
    error?.message ?? error?.details ?? error?.hint ?? error ?? '',
  ).toLowerCase()

  if (message.includes('insufficient_stock')) {
    return 'الكمية المطلوبة غير متوفرة'
  }
  if (message.includes('variant_not_available')) {
    return 'هذا المنتج غير متاح حالياً'
  }
  if (message.includes('invalid_name')) {
    return 'يرجى إدخال الاسم بشكل صحيح.'
  }
  if (message.includes('invalid_address')) {
    return 'يرجى إدخال العنوان بشكل صحيح.'
  }
  if (message.includes('invalid_phone') || message.includes('invalid_dial_code')) {
    return 'رقم الهاتف غير صحيح.'
  }
  if (message.includes('empty_cart')) {
    return 'السلة فارغة.'
  }
  if (message.includes('invalid_quantity')) {
    return 'الكمية المطلوبة غير صحيحة.'
  }
  if (message.includes('duplicate key') || message.includes('unique constraint')) {
    return 'هذا المقاس واللون مضافان بالفعل لهذا المنتج.'
  }
  if (message.includes('not found') || message.includes('pgrst116')) {
    return 'المنتج غير موجود أو لا تملك صلاحية الوصول إليه.'
  }

  return 'تعذّر إتمام العملية. يرجى المحاولة مرة أخرى.'
}

export async function getProducts({ category, size, color, search } = {}) {
  let query = supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('is_active', true)

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error, status } = await query
  throwIfError(error, status)

  let products = (data ?? []).map(mapProductFromDb)
  if (search?.trim()) {
    const term = search.trim().toLocaleLowerCase()
    products = products.filter((product) =>
      `${product.name} ${product.description}`.toLocaleLowerCase().includes(term),
    )
  }
  if (size || color) {
    products = products.filter((product) =>
      product.variants.some(
        (variant) =>
          (!size || variant.size === size) &&
          (!color || variant.color === color),
      ),
    )
  }

  return products
}

export async function getProductById(id) {
  const { data, error, status } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('id', id)
    .eq('is_active', true)
    .maybeSingle()
  throwIfError(error, status)
  return data ? mapProductFromDb(data) : null
}

export async function getAdminProducts() {
  const { data, error, status } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .order('created_at', { ascending: false })
  throwIfError(error, status)
  return (data ?? []).map(mapProductFromDb)
}

export async function saveProduct(product, variants = []) {
  const variantRecords = normalizeVariants(variants)
  let productId = product.id

  if (!productId) {
    const { data, error, status } = await supabase
      .from('products')
      .insert(mapProductToDb(product, true))
      .select('id')
      .single()
    throwIfError(error, status)
    productId = data.id

    if (variantRecords.length) {
      const { error: variantsError, status: variantsStatus } = await supabase.from('variants').insert(
        variantRecords.map((variant) => ({
          ...variant,
          product_id: productId,
        })),
      )
      throwIfError(variantsError, variantsStatus)
    }
  } else {
    const { data, error, status } = await supabase
      .from('products')
      .update(mapProductToDb(product))
      .eq('id', productId)
      .select('id')
      .maybeSingle()
    throwIfError(error, status)
    if (!data) {
      throw new Error('المنتج غير موجود أو لا تملك صلاحية تعديله.')
    }

    const {
      data: existingVariants,
      error: existingError,
      status: existingStatus,
    } = await supabase
      .from('variants')
      .select('id, size, color')
      .eq('product_id', productId)
    throwIfError(existingError, existingStatus)

    const existingByPair = new Map(
      (existingVariants ?? []).map((variant) => [
        JSON.stringify([variant.size, variant.color]),
        variant,
      ]),
    )
    const retainedIds = new Set()
    const newVariants = []

    for (const variant of variantRecords) {
      const key = JSON.stringify([variant.size, variant.color])
      const existing = existingByPair.get(key)
      if (existing) {
        const {
          data: updatedVariant,
          error: updateError,
          status: updateStatus,
        } = await supabase
          .from('variants')
          .update({ stock: variant.stock })
          .eq('id', existing.id)
          .select('id')
          .maybeSingle()
        throwIfError(updateError, updateStatus)
        if (!updatedVariant) {
          throw new Error('تعذّر تحديث مخزون هذا المقاس واللون.')
        }
        retainedIds.add(existing.id)
      } else {
        newVariants.push({ ...variant, product_id: productId })
      }
    }

    if (newVariants.length) {
      const { error: insertError, status: insertStatus } = await supabase
        .from('variants')
        .insert(newVariants)
      throwIfError(insertError, insertStatus)
    }

    const removedIds = (existingVariants ?? [])
      .filter((variant) => !retainedIds.has(variant.id))
      .map((variant) => variant.id)
    if (removedIds.length) {
      const { error: deleteError, status: deleteStatus } = await supabase
        .from('variants')
        .delete()
        .in('id', removedIds)
      throwIfError(deleteError, deleteStatus)
    }
  }

  const { data, error, status } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('id', productId)
    .single()
  throwIfError(error, status)
  return mapProductFromDb(data)
}

export async function deleteProduct(id) {
  const { data, error, status } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
    .select('id')
  throwIfError(error, status)
  return (data ?? []).length > 0
}

export async function uploadProductImage(file) {
  const randomId =
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2)}`
  const extension = file.name?.split('.').pop()?.replace(/[^a-z\d]/gi, '')
  const path = `${randomId}${extension ? `.${extension}` : ''}`
  const { data, error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, file, { contentType: file.type || undefined, upsert: false })
  throwIfError(error)

  const { data: publicUrlData } = supabase.storage
    .from(IMAGE_BUCKET)
    .getPublicUrl(data.path)
  return publicUrlData.publicUrl
}
