import { supabase } from '../lib/supabase'
import { getArabicError } from './productService'

function throwIfError(error) {
  if (error) {
    throw new Error(getArabicError(error), { cause: error })
  }
}

export async function createOrder(customer, items) {
  const { data, error } = await supabase.rpc('create_order', {
    p_customer_name: customer.name,
    p_phone_e164: customer.phone,
    p_dial_code: customer.dialCode,
    p_address: customer.address,
    p_items: items.map((item) => ({
      variant_id: item.variantId,
      quantity: item.quantity,
    })),
  })
  throwIfError(error)
  return data
}

export async function getOrders(status) {
  let query = supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })

  if (Array.isArray(status)) query = query.in('status', status)
  else if (status) query = query.eq('status', status)

  const { data, error } = await query
  throwIfError(error)
  return (data ?? []).map((order) => ({
    ...order,
    orderNumber: order.order_number,
    order_items: (order.order_items ?? []).map((item) => ({
      ...item,
      returnedQuantity: item.returned_quantity,
      quantity: item.quantity,
    })),
  }))
}

export async function completeOrder(orderId) {
  const { error } = await supabase.rpc('complete_order', {
    p_order_id: orderId,
  })
  throwIfError(error)
}

export async function cancelPendingOrder(orderId) {
  const { error } = await supabase.rpc('cancel_pending_order', {
    p_order_id: orderId,
  })
  throwIfError(error)
}

export async function returnOrder(orderId, returnedItems) {
  const { error } = await supabase.rpc('return_order', {
    p_order_id: orderId,
    p_returned: returnedItems.map(({ itemId, returnedQuantity }) => ({
      item_id: itemId,
      returned_quantity: Number(returnedQuantity),
    })),
  })
  throwIfError(error)
}
