import { useState } from 'react'

function CheckoutForm({ onSubmit }) {
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '' })
  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    const { name, value } = event.target
    setCustomer((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = {}
    const name = customer.name.trim()
    const phone = customer.phone.trim()
    const address = customer.address.trim()

    if (name.length < 3) nextErrors.name = 'يرجى إدخال الاسم بالكامل (3 أحرف على الأقل).'
    if (!/^01\d{9}$/.test(phone)) {
      nextErrors.phone = 'أدخل رقم هاتف مصرياً صحيحاً يبدأ بـ 01 ويتكون من 11 رقماً.'
    }
    if (address.length < 10) {
      nextErrors.address = 'يرجى إدخال عنوان لا يقل عن 10 أحرف.'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) {
      onSubmit({ name, phone, address })
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-neutral-100 bg-white p-4 sm:p-6"
    >
      <h2 className="text-xl font-bold text-neutral-900">بيانات العميل</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 font-semibold text-neutral-900">
          الاسم بالكامل
          <input
            name="name"
            value={customer.name}
            onChange={handleChange}
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'checkout-name-error' : undefined}
            className="min-h-[48px] rounded-xl border border-neutral-100 bg-white px-3 font-normal"
          />
          {errors.name ? (
            <span id="checkout-name-error" className="text-sm text-danger-600">
              {errors.name}
            </span>
          ) : null}
        </label>
        <label className="flex flex-col gap-1 font-semibold text-neutral-900">
          رقم الهاتف
          <input
            name="phone"
            type="tel"
            inputMode="numeric"
            value={customer.phone}
            onChange={handleChange}
            autoComplete="tel"
            placeholder="01112360851"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'checkout-phone-error' : undefined}
            className="min-h-[48px] rounded-xl border border-neutral-100 bg-white px-3 font-normal"
          />
          {errors.phone ? (
            <span id="checkout-phone-error" className="text-sm text-danger-600">
              {errors.phone}
            </span>
          ) : null}
        </label>
      </div>
      <label className="flex flex-col gap-1 font-semibold text-neutral-900">
        العنوان بالتفصيل
        <textarea
          name="address"
          value={customer.address}
          onChange={handleChange}
          autoComplete="street-address"
          rows="3"
          aria-invalid={Boolean(errors.address)}
          aria-describedby={errors.address ? 'checkout-address-error' : undefined}
          className="min-h-[112px] rounded-xl border border-neutral-100 bg-white px-3 py-2 font-normal"
        />
        {errors.address ? (
          <span id="checkout-address-error" className="text-sm text-danger-600">
            {errors.address}
          </span>
        ) : null}
      </label>
      <button
        type="submit"
        className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-brand-600 px-6 font-bold text-white transition-colors hover:bg-opacity-90 sm:w-auto sm:self-start"
      >
        إرسال الطلب عبر واتساب
      </button>
    </form>
  )
}

export default CheckoutForm
