import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { buildWhatsAppUrl } from '../lib/whatsapp'
import BackButton from '../components/layout/BackButton'
import siteContent from '../data/siteContent'

const phone = import.meta.env.VITE_WHATSAPP_NUMBER

function Contact() {
  const location = useLocation()
  const subject = new URLSearchParams(location.search).get('subject')
  const initialMessage = subject ? `${subject}: ` : ''
  const [messageDraft, setMessageDraft] = useState({
    locationKey: location.key,
    value: initialMessage,
  })
  const message = messageDraft.locationKey === location.key
    ? messageDraft.value
    : initialMessage
  const [feedback, setFeedback] = useState({
    locationKey: location.key,
    message: '',
  })
  const status = feedback.locationKey === location.key ? feedback.message : ''

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!phone) {
      setFeedback({
        locationKey: location.key,
        message: 'رقم واتساب غير متاح حالياً. يرجى التواصل معنا عبر البريد الإلكتروني.',
      })
      return
    }

    const formData = new FormData(event.currentTarget)
    const whatsappMessage = [
      'مرحباً، أود التواصل مع المتجر.',
      `الاسم: ${formData.get('name')}`,
      `رقم الهاتف: ${formData.get('phone')}`,
      `البريد الإلكتروني: ${formData.get('email')}`,
      `الرسالة: ${formData.get('message')}`,
    ].join('\n')

    window.location.assign(buildWhatsAppUrl(phone, whatsappMessage))
  }

  return (
    <article className="mx-auto flex w-full max-w-[1200px] flex-col gap-7 sm:gap-9">
      <div className="flex items-center gap-3">
        <BackButton />
        <div>
          <p className="text-sm font-bold text-brand-600">نحن هنا لمساعدتك</p>
          <h1 className="text-2xl font-extrabold text-neutral-900 sm:text-3xl">تواصل معنا</h1>
        </div>
      </div>
      <p className="-mt-4 max-w-2xl leading-7 text-neutral-600">
        لديك سؤال عن المقاسات أو المنتجات أو طلبك؟ اترك لنا رسالة أو تواصل مباشرة مع فريقنا.
      </p>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8">
        <section className="rounded-3xl border border-neutral-100 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="text-xl font-extrabold text-neutral-900">أرسل لنا رسالة</h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            املأ البيانات التالية، وسنساعدك في التواصل معنا عبر واتساب.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField id="contact-name" name="name" label="الاسم" autoComplete="name" />
              <FormField id="contact-phone" name="phone" label="رقم الهاتف" type="tel" autoComplete="tel" />
            </div>
            <FormField id="contact-email" name="email" label="البريد الإلكتروني" type="email" autoComplete="email" />
            <label htmlFor="contact-message" className="flex flex-col gap-2 text-sm font-bold text-neutral-900">
              رسالتك
              <textarea
                id="contact-message"
                name="message"
                value={message}
                onChange={(event) =>
                  setMessageDraft({ locationKey: location.key, value: event.target.value })
                }
                required
                rows="5"
                className="min-h-32 resize-y rounded-xl border border-neutral-100 bg-white px-4 py-3 font-normal leading-6 text-neutral-900 outline-none transition placeholder:text-neutral-600 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/15"
                placeholder="اكتب رسالتك هنا..."
              />
            </label>
            {status ? (
              <p role="status" className="rounded-xl bg-amber-50 px-4 py-3 text-sm leading-6 text-neutral-900">
                {status}
              </p>
            ) : null}
            <button
              type="submit"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 font-bold text-white transition-colors hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 sm:w-auto sm:self-start"
            >
              إرسال عبر واتساب
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-5 w-5">
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </button>
          </form>
        </section>

        <aside className="flex flex-col gap-5 rounded-3xl bg-brand-50 p-5 sm:p-8">
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
            <a className="min-h-11 inline-flex items-center break-all text-sm font-bold text-brand-600 hover:underline" href={`mailto:${siteContent.storeEmail}`}>
              أرسل بريداً إلكترونياً
            </a>
          </ContactDetail>
          <ContactDetail icon="pin" title="عنوان المتجر" detail={siteContent.storeAddress} />
          <ContactDetail icon="clock" title="ساعات خدمة العملاء" detail={siteContent.supportHours} />
          <div className="rounded-2xl border border-brand-600/10 bg-white/70 p-4 text-sm leading-6 text-neutral-600">
            نعمل على الرد على استفساراتك في أقرب وقت خلال ساعات العمل.
          </div>
        </aside>
      </div>
    </article>
  )
}

function FormField({ id, name, label, type = 'text', autoComplete }) {
  return (
    <label htmlFor={id} className="flex flex-col gap-2 text-sm font-bold text-neutral-900">
      {label}
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
        className="min-h-12 rounded-xl border border-neutral-100 bg-white px-4 font-normal text-neutral-900 outline-none transition placeholder:text-neutral-600 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/15"
        placeholder={label}
      />
    </label>
  )
}

function ContactDetail({ icon, title, detail, children }) {
  return (
    <div className="flex gap-3 border-b border-brand-600/10 pb-4 last:border-0">
      <ContactIcon type={icon} />
      <div className="min-w-0">
        <h3 className="font-bold text-neutral-900">{title}</h3>
        <p className="mt-1 break-words text-sm leading-6 text-neutral-600">{detail}</p>
        {children ? <div className="mt-2">{children}</div> : null}
      </div>
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
