import { useState } from 'react'
import CountryCodeButton from './CountryCodeButton'
import { COUNTRIES } from '../../data/countries'
import { normalizePhone, toE164, validatePhone } from '../../lib/phone'

function CheckoutForm({ onSubmit }) {
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '' })
  const [countryCode, setCountryCode] = useState(COUNTRIES[0].code)
  const [errors, setErrors] = useState({})
  const country = COUNTRIES.find((item) => item.code === countryCode) ?? COUNTRIES[0]

  const handleChange = (event) => {
    const { name, value } = event.target
    setCustomer((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = {}
    const name = customer.name.trim()
    const address = customer.address.trim()

    if (name.length < 3) nextErrors.name = 'يرجى إدخال الاسم بالكامل (3 أحرف على الأقل).'
    const phoneError = validatePhone(customer.phone, country)
    if (phoneError) nextErrors.phone = phoneError
    if (address.length < 10) {
      nextErrors.address = 'يرجى إدخال عنوان لا يقل عن 10 أحرف.'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) {
      const nationalDigits = normalizePhone(customer.phone, country)
      onSubmit({
        name,
        phone: toE164(nationalDigits, country),
        dialCode: country.dialCode,
        address,
      })
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-neutral-100 bg-white p-4 sm:p-6"
    >
      <h2 className="text-xl font-bold text-neutral-900">بيانات العميل</h2>
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
        {errors.name ? <span id="checkout-name-error" className="text-sm text-danger-600">{errors.name}</span> : null}
      </label>
      <label className="flex w-full flex-col gap-1 font-semibold text-neutral-900">
        رقم الهاتف
        <span
          dir="ltr"
          className="relative flex min-h-[48px] w-full items-stretch rounded-xl border border-neutral-100 bg-white focus-within:ring-2 focus-within:ring-brand-600"
        >
          <CountryCodeButton
            countries={COUNTRIES}
            country={country}
            onSelect={(item) => {
              setCountryCode(item.code)
              setErrors((current) => ({ ...current, phone: '' }))
            }}
          />
          <input
            name="phone"
            type="tel"
            inputMode="tel"
            value={customer.phone}
            onChange={handleChange}
            autoComplete="tel-national"
            placeholder="رقم الهاتف"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'checkout-phone-error' : undefined}
            className="min-h-[48px] min-w-0 flex-1 bg-transparent px-3 text-start font-normal focus:outline-none"
          />
        </span>
        {errors.phone ? <span id="checkout-phone-error" className="text-sm text-danger-600">{errors.phone}</span> : null}
      </label>
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
