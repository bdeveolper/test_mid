function VariantEditor({ variants, error, onChange, onAdd, onRemove }) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-bold text-neutral-900">المقاسات والألوان والمخزون</h2>
        <button
          type="button"
          onClick={onAdd}
          className="min-h-[44px] rounded-xl border border-brand-600 px-4 font-semibold text-brand-600 hover:bg-brand-50"
        >
          إضافة مقاس
        </button>
      </div>
      <p className="text-sm text-neutral-600">
        اكتب مقاس الملابس مثل S أو M أو مقاس الحذاء بالأرقام.
      </p>
      {variants.map((variant, index) => (
        <div
          key={variant.id || index}
          className="grid grid-cols-1 gap-3 rounded-xl border border-neutral-100 bg-white p-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]"
        >
          <label className="flex flex-col gap-1 text-sm font-semibold text-neutral-900">
            المقاس
            <input
              value={variant.size}
              onChange={(event) => onChange(index, 'size', event.target.value)}
              className="min-h-[44px] rounded-lg border border-neutral-100 px-3 font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold text-neutral-900">
            اللون
            <input
              value={variant.color}
              onChange={(event) => onChange(index, 'color', event.target.value)}
              className="min-h-[44px] rounded-lg border border-neutral-100 px-3 font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold text-neutral-900">
            المخزون
            <input
              type="number"
              min="0"
              step="1"
              value={variant.stock}
              onChange={(event) => onChange(index, 'stock', event.target.value)}
              className="min-h-[44px] rounded-lg border border-neutral-100 px-3 font-normal"
            />
          </label>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="min-h-[44px] self-end rounded-lg px-3 font-semibold text-danger-600 hover:bg-neutral-100"
          >
            حذف
          </button>
        </div>
      ))}
      {error ? <p className="text-sm font-semibold text-danger-600">{error}</p> : null}
    </section>
  )
}

export default VariantEditor
