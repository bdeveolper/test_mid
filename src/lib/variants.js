const ONE_SIZE = 'مقاس واحد'

export function isOneSizeProduct(product) {
  const variants = product?.variants ?? []
  return variants.length > 0 && variants.every(
    (variant) => variant.size.trim() === ONE_SIZE,
  )
}
