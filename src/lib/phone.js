const FORMATTING_CHARACTERS = /[\s()-]/g
const EGYPT_CODE = 'EG'

export function normalizePhone(rawInput, country) {
  let input = String(rawInput ?? '').replace(FORMATTING_CHARACTERS, '')
  const explicitInternational = input.startsWith('+') || input.startsWith('00')
  if (input.startsWith('+')) input = input.slice(1)
  if (input.startsWith('00')) input = input.slice(2)

  const dialCode = String(country?.dialCode ?? '')
  const nationalLength = country?.nationalLength ?? { min: 0, max: 0 }
  const remainder = input.slice(dialCode.length)
  const remainderWithoutTrunk =
    country?.trunkPrefix && remainder.startsWith('0')
      ? remainder.slice(1)
      : remainder
  const hasDialCode =
    dialCode &&
    input.startsWith(dialCode) &&
    (explicitInternational ||
      (remainderWithoutTrunk.length >= nationalLength.min &&
        remainderWithoutTrunk.length <= nationalLength.max))
  if (hasDialCode) input = input.slice(dialCode.length)

  if (country?.trunkPrefix && input.startsWith('0')) input = input.slice(1)
  return input.replace(/\D/g, '')
}

export function validatePhone(rawInput, country) {
  const compact = String(rawInput ?? '').replace(FORMATTING_CHARACTERS, '')
  if (!/^(?:\+|00)?\d+$/.test(compact)) {
    return 'يرجى إدخال رقم الهاتف باستخدام الأرقام فقط.'
  }

  const digits = normalizePhone(compact, country)
  const { min, max } = country?.nationalLength ?? { min: 0, max: 0 }
  const validLength = digits.length >= min && digits.length <= max
  const validPrefix =
    !country?.startsWith ||
    country.startsWith.some((prefix) => digits.startsWith(prefix))

  if (!validLength || !validPrefix) {
    return country?.code === EGYPT_CODE
      ? 'رقم الموبايل المصري يجب أن يبدأ بـ 1 ويتكون من 10 أرقام بعد رمز الدولة.'
      : 'رقم الموبايل غير صحيح لهذه الدولة.'
  }
  return null
}

export function toE164(nationalDigits, country) {
  return `+${country.dialCode}${nationalDigits}`
}
