import { buildWhatsAppUrl } from '../lib/whatsapp'
import BackButton from '../components/layout/BackButton'
import siteContent from '../data/siteContent'

const phone = import.meta.env.VITE_WHATSAPP_NUMBER

function Contact() {
  return (
    <article className="mx-auto flex w-full max-w-2xl flex-col gap-7 sm:gap-9">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <BackButton />
          <div>
            <p className="text-sm font-bold text-brand-600">نحن هنا لمساعدتك</p>
            <h1 className="text-2xl font-extrabold text-neutral-900 sm:text-3xl">تواصل معنا</h1>
          </div>
        </div>
        <p className="leading-7 text-neutral-600">
          لديك سؤال عن المقاسات أو المنتجات أو طلبك؟ اترك لنا رسالة أو تواصل مباشرة مع فريقنا.
        </p>
      </div>

      <aside className="flex w-full flex-col gap-5 rounded-2xl border border-neutral-100 bg-brand-50 p-5 shadow-sm sm:p-8">
        <div>
          <p className="text-sm font-bold text-brand-600">يسعدنا أن نسمع منك</p>
          <h2 className="mt-1 text-xl font-extrabold text-neutral-900">طرق التواصل المباشر</h2>
        </div>
        <ContactDetail
          icon="chat"
          title="واتساب"
          detail={phone ? `+${phone}` : 'راسلنا عبر واتساب'}
        >
          {phone ? (
            <a
              href={buildWhatsAppUrl(phone, 'مرحباً، أود الاستفسار عن منتجاتكم.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded-xl bg-brand-600 px-4 text-sm font-bold text-white transition-colors hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
            >
              ابدأ محادثة
            </a>
          ) : null}
        </ContactDetail>
        <ContactDetail icon="mail" title="البريد الإلكتروني" detail={siteContent.storeEmail}>
          <a
            className="inline-flex min-h-11 items-center break-all text-sm font-bold text-brand-600 hover:underline"
            href={`mailto:${siteContent.storeEmail}`}
          >
            أرسل بريداً إلكترونياً
          </a>
        </ContactDetail>
        <ContactDetail icon="pin" title="عنوان المتجر" detail={siteContent.storeAddress} />
        <ContactDetail icon="clock" title="ساعات خدمة العملاء" detail={siteContent.supportHours} />
        <div className="rounded-2xl border border-brand-600/10 bg-white/70 p-4 text-sm leading-6 text-neutral-600">
          نعمل على الرد على استفساراتك في أقرب وقت خلال ساعات العمل.
        </div>
      </aside>
    </article>
  )
}

function ContactDetail({ icon, title, detail, children }) {
  return (
    <div className="flex flex-col gap-3 border-b border-brand-600/10 pb-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <ContactIcon type={icon} />
        <div className="min-w-0">
          <h3 className="font-bold text-neutral-900">{title}</h3>
          <p className="mt-1 break-words text-sm leading-6 text-neutral-600">{detail}</p>
        </div>
      </div>
      {children ? <div className="sm:shrink-0">{children}</div> : null}
    </div>
  )
}

function ContactIcon({ type }) {
  const paths = {
    chat: <><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z" /><path d="M9 8.5c.5 2 2 3.5 4.5 4.5" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  }

  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-5 w-5">
        {paths[type]}
      </svg>
    </span>
  )
}

export default Contact
