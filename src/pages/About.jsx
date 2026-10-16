import BackButton from '../components/layout/BackButton'

const features = [
  {
    title: 'أقمشة عالية الجودة',
    description: 'خامات متينة وناعمة تحافظ على راحتك ومظهرها مع الاستخدام اليومي.',
    icon: <><path d="m12 3 8 4-8 4-8-4 8-4Z" /><path d="m4 12 8 4 8-4M4 17l8 4 8-4" /></>,
  },
  {
    title: 'تصميم مريح',
    description: 'قصّات عملية تمنحك حرية الحركة طوال ساعات العمل والدراسة.',
    icon: <><path d="M12 3v18M3 12h18" /><path d="M7 7h10v10H7z" /></>,
  },
  {
    title: 'توصيل سريع',
    description: 'نرتب طلبك بعناية ونتابع معك لتأكيد تفاصيل التوصيل والاستلام.',
    icon: <><path d="M3 7h11v10H3zM14 10h4l3 3v4h-7z" /><circle cx="7.5" cy="18" r="1.5" /><circle cx="17.5" cy="18" r="1.5" /></>,
  },
  {
    title: 'استبدال واسترجاع سهل',
    description: 'نهتم بتجربتك ونساعدك في معرفة خيارات الاستبدال والاسترجاع.',
    icon: <><path d="M4 11a8 8 0 0 1 14-5l2 2" /><path d="M20 4v4h-4M20 13a8 8 0 0 1-14 5l-2-2" /><path d="M4 20v-4h4" /></>,
  },
]

function About() {
  return (
    <article className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 sm:gap-10">
      <div className="flex items-center gap-3">
        <BackButton />
        <p className="text-sm font-bold text-brand-600">قصتنا ورؤيتنا</p>
      </div>

      <section className="relative isolate overflow-hidden rounded-3xl bg-brand-50 px-6 py-10 sm:px-10 sm:py-14 lg:px-16">
        <div aria-hidden="true" className="absolute -end-20 -top-28 -z-10 h-72 w-72 rounded-full bg-brand-600/10 blur-3xl" />
        <p className="mb-3 text-sm font-extrabold tracking-wide text-brand-600">عن متجرنا</p>
        <h1 className="max-w-3xl text-3xl font-extrabold leading-tight text-neutral-900 sm:text-4xl lg:text-5xl">
          راحتك في عملك الطبي تبدأ من ملابس تثق بها
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-neutral-600 sm:text-lg">
          نؤمن أن يوم العمل الطويل يستحق ملابس تجمع بين الراحة والمتانة والأناقة.
          لذلك نختار تصاميم عملية تناسب احتياجات الأطباء والتمريض وطلاب الكليات الطبية.
        </p>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-extrabold text-neutral-900 sm:text-3xl">مهمتنا بسيطة</h2>
          <p className="text-base leading-8 text-neutral-600">
            في متجر الملابس الطبية، نعمل على توفير ملابس طبية متينة ومريحة وعصرية تساعدك
            على التركيز في ما يهم. من اختيار الخامة إلى تنسيق المقاس واللون، نهتم بتفاصيل
            تجعل تجربة التسوق واضحة وسهلة من البداية وحتى استلام طلبك.
          </p>
          <p className="text-base leading-8 text-neutral-600">
            سواء كنت طبيباً أو ممرضاً أو طالباً في المجال الطبي، ستجد خيارات مصممة لتواكب
            إيقاع يومك وتمنحك مظهراً مهنياً تشعر بالثقة فيه.
          </p>
        </div>
        <div className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-2xl font-bold text-brand-600" aria-hidden="true">+</div>
          <h2 className="mt-5 text-xl font-extrabold text-neutral-900">اختيارك اليومي، بعناية</h2>
          <p className="mt-3 text-sm leading-7 text-neutral-600">
            جودة يمكن الاعتماد عليها، وراحة ترافقك في كل حركة، وخدمة قريبة منك عندما تحتاجها.
          </p>
        </div>
      </section>

      <section aria-labelledby="features-title">
        <div className="mb-5">
          <p className="text-sm font-bold text-brand-600">ما الذي يميزنا؟</p>
          <h2 id="features-title" className="mt-1 text-2xl font-extrabold text-neutral-900 sm:text-3xl">
            تفاصيل تصنع فرقاً في يومك
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ title, description, icon }) => (
            <section key={title} className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md sm:p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-6 w-6">
                  {icon}
                </svg>
              </div>
              <h3 className="mt-4 font-extrabold text-neutral-900">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-neutral-600">{description}</p>
            </section>
          ))}
        </div>
      </section>
    </article>
  )
}

export default About
