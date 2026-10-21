import { Link } from 'react-router-dom'
import siteContent from '../../data/siteContent'
import { buildWhatsAppUrl } from '../../lib/whatsapp'
import FooterSection, { ContactIcon } from './FooterSection'

const year = new Date().getFullYear()
const phone = import.meta.env.VITE_WHATSAPP_NUMBER
const storeName = import.meta.env.VITE_STORE_NAME

const quickLinks = [
  { to: '/', label: 'الرئيسية' },
  { to: '/#products', label: 'جميع المنتجات' },
  { to: '/#products', label: 'التصنيفات' },
  { to: '/about', label: 'عن المتجر' },
  { to: '/contact', label: 'تواصل معنا' },
]

const socialLinks = [
  {
    name: 'Facebook',
    label: 'فيسبوك',
    href: import.meta.env.VITE_FACEBOOK_URL || 'https://www.facebook.com/',
    icon: <path d="M14 8h3V4h-3a5 5 0 0 0-5 5v2H6v4h3v7h4v-7h3l1-4h-4V9a1 1 0 0 1 1-1Z" />,
  },
  {
    name: 'Instagram',
    label: 'إنستغرام',
    href: import.meta.env.VITE_INSTAGRAM_URL || 'https://www.instagram.com/',
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="18" cy="6" r="1" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    name: 'WhatsApp',
    label: 'واتساب',
    href: phone ? buildWhatsAppUrl(phone, 'مرحباً، أود التواصل مع المتجر.') : 'https://wa.me/',
    icon: (
      <>
        <path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z" />
        <path d="M9 8.5c.5 2 2 3.5 4.5 4.5" />
      </>
    ),
  },
  {
    name: 'TikTok',
    label: 'تيك توك',
    href: import.meta.env.VITE_TIKTOK_URL || 'https://www.tiktok.com/',
    icon: <path d="M14 4v10.5a4.5 4.5 0 1 1-4-4.47M14 4c.5 3 2.5 4.5 5 4.7" />,
  },
]

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="inline-flex min-h-9 items-center text-sm leading-5 text-white/80 transition-colors hover:text-white focus:outline-none focus-visible:text-white"
    >
      {children}
    </Link>
  )
}

function Footer() {
  const storeLabel = storeName || 'متجر الملابس الطبية'

  return (
    <footer className="mt-auto w-full bg-brand-600 text-white">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        <div className="grid grid-cols-2 gap-x-5 gap-y-6 sm:gap-x-8 sm:gap-y-7 lg:grid-cols-3 lg:gap-10">
          <section className="col-span-2 lg:col-span-1">
            <Link
              to="/"
              className="inline-flex min-h-10 items-center gap-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-lg font-extrabold text-brand-600" aria-hidden="true">
                +
              </span>
              <span className="text-base font-extrabold text-white">{storeLabel}</span>
            </Link>
            <p className="mt-2 max-w-sm text-sm leading-6 text-white/85">
              ملابس طبية مريحة وعملية للأطباء والتمريض وطلاب الطب.
            </p>
            <div className="mt-3 flex items-center gap-2">
              {socialLinks.map(({ name, label, href, icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/30 text-white/90 transition-colors hover:border-white hover:bg-white/15 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4">
                    {icon}
                  </svg>
                </a>
              ))}
            </div>
          </section>

          <nav aria-label="روابط سريعة" className="col-span-2 lg:col-span-1">
            <FooterSection id="quick-links-body" title="روابط سريعة">
              <ul className="flex flex-col">
                {quickLinks.map(({ to, label }) => (
                  <li key={label}><FooterLink to={to}>{label}</FooterLink></li>
                ))}
              </ul>
            </FooterSection>
          </nav>

          <div className="col-span-2 lg:col-span-1">
            <FooterSection id="contact-body" title="تواصل معنا">
              <ul className="flex flex-col gap-1 text-sm leading-5 text-white/85">
                <li className="flex items-start gap-2">
                  <ContactIcon type="pin" />
                  <span>{siteContent.storeAddress}</span>
                </li>
                <li className="flex items-center gap-2">
                  <ContactIcon type="chat" />
                  {phone ? (
                    <a className="min-h-9 inline-flex items-center transition-colors hover:text-white" href={buildWhatsAppUrl(phone, 'مرحباً، أود التواصل مع المتجر.')}>
                      +{phone}
                    </a>
                  ) : <span>واتساب غير متاح حالياً</span>}
                </li>
                <li className="flex items-center gap-2">
                  <ContactIcon type="mail" />
                  <a className="min-h-9 inline-flex items-center break-all transition-colors hover:text-white" href={`mailto:${siteContent.storeEmail}`}>
                    {siteContent.storeEmail}
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <ContactIcon type="clock" />
                  <span>{siteContent.supportHours}</span>
                </li>
              </ul>
            </FooterSection>
          </div>
        </div>

        <div className="mt-6 flex justify-center border-t border-white/25 pt-4">
          <p className="text-center text-xs leading-5 text-white/80 sm:text-sm">
            © {year} جميع الحقوق محفوظة - {storeLabel}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
