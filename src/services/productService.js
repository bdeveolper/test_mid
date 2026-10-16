import { mockProducts } from '../data/mockProducts'

const DELAY_MS = 300

let products = structuredClone(mockProducts)

const wait = () => new Promise((resolve) => setTimeout(resolve, DELAY_MS))

export async function getProducts({ category, size, color, search } = {}) {
  await wait()

  let result = products.filter((product) => product.isActive)

  if (category) {
    result = result.filter((product) => product.category === category)
  }

  if (search?.trim()) {
    const query = search.trim().toLocaleLowerCase()
    result = result.filter((product) =>
      `${product.name} ${product.description}`.toLocaleLowerCase().includes(query),
    )
  }

  if (size || color) {
    result = result.filter((product) =>
      product.variants.some(
        (variant) =>
          (!size || variant.size === size) && (!color || variant.color === color),
      ),
    )
  }

  return structuredClone(result)
}

export async function getProductById(id) {
  await wait()

  const product = products.find((item) => item.id === id)
  return product ? structuredClone(product) : null
}

export async function getAdminProducts() {
  await wait()
  return structuredClone(products)
}

export async function saveProduct(product, variants = []) {
  await wait()

  const id = product.id || `p-${Date.now()}`
  const record = {
    ...product,
    id,
    createdAt: product.createdAt || new Date().toISOString(),
    variants: variants.map((variant, index) => ({
      ...variant,
      id: variant.id || `${id}-v${index + 1}`,
      productId: id,
    })),
  }

  const index = products.findIndex((item) => item.id === id)
  if (index === -1) {
    products.push(record)
  } else {
    products[index] = record
  }

  return structuredClone(record)
}

export async function deleteProduct(id) {
  await wait()

  const index = products.findIndex((item) => item.id === id)
  if (index === -1) {
    return false
  }

  products.splice(index, 1)
  return true
}
