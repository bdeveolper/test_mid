function formatPhone(customer) {
  const dialCode = String(customer.dialCode ?? '')
  const prefix = `+${dialCode}`
  return dialCode && customer.phone.startsWith(prefix)
    ? `${prefix} ${customer.phone.slice(prefix.length)}`
    : customer.phone
}

export function buildInvoiceMessage(items, storeName, customer) {
  const lines = items.map((item, index) => {
    const lineTotal = item.price * item.quantity
    return `${index + 1}) ${item.name} - مقاس ${item.size} - لون ${item.color}\n   الكمية: ${item.quantity} × ${item.price} = ${lineTotal} ج.م`
  })

  const grandTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )

  const customerLines = customer
    ? [
        'بيانات العميل:',
        `الاسم: ${customer.name}`,
        `رقم الهاتف: ${formatPhone(customer)}`,
        `العنوان: ${customer.address}`,
        '',
      ]
    : []

  return [
    'طلب جديد 🛍️',
    `اسم المتجر: ${storeName}`,
    '',
    ...customerLines,
    'المنتجات:',
    ...lines,
    '',
    `الإجمالي: ${grandTotal} ج.م`,
    '',
    'يرجى تأكيد الطلب ومواعيد الاستلام. شكراً لك 🙏',
  ].join('\n')
}

const SAMPLE_ITEMS = [
  { name: 'طقم سكراب طبي', size: 'M', color: 'كحلي', price: 450, quantity: 2 },
  { name: 'كلوج طبي', size: '40', color: 'أسود', price: 350, quantity: 1 },
]
const SAMPLE_CUSTOMER = {
  name: 'أحمد محمد',
  phone: '01112360851',
  address: 'شارع التحرير، الدقي، الجيزة',
}

if (import.meta.env && import.meta.env.DEV) {
  console.log(
    `Sample WhatsApp invoice:\n${buildInvoiceMessage(
      SAMPLE_ITEMS,
      import.meta.env.VITE_STORE_NAME ?? '',
      SAMPLE_CUSTOMER,
    )}`,
  )
}
