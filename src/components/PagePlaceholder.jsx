function PagePlaceholder({ title, description }) {
  return (
    <section className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-neutral-100 bg-brand-50 p-8 text-center">
      <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">{title}</h1>
      {description && (
        <p className="mt-3 max-w-md text-neutral-600">{description}</p>
      )}
    </section>
  )
}

export default PagePlaceholder
