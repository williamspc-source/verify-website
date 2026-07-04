import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import { CMSLink } from '@/components/Link'

const socialSvg: Record<string, React.ReactNode> = {
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden>
      <path d="M18.9 2H22l-7.6 8.7L23 22h-6.8l-5.3-7-6.1 7H1.6l8.2-9.3L1 2h7l4.8 6.4L18.9 2Zm-1.2 18h1.9L7.4 4H5.4l12.3 16Z" />
    </svg>
  ),
}

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.92a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z" />
  </svg>
)
const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m2 7 10 7 10-7" />
  </svg>
)
const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

export async function Footer() {
  const footer = await getCachedGlobal('footer', 1)()
  const settings = await getCachedGlobal('site-settings', 1)()

  const columns = footer?.columns || []
  const contact = footer?.contact
  const social = footer?.social || []
  const legalLinks = footer?.legalLinks || []
  const year = new Date().getFullYear()

  const logoSrc =
    (typeof settings?.logoFooter === 'object' && settings?.logoFooter?.url) ||
    (typeof settings?.logo === 'object' && settings?.logo?.url) ||
    '/assets/images/logo.png'

  return (
    <footer className="site-footer mt-auto">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" aria-label="VERIFY Medico-Legal Solutions">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoSrc} alt="VERIFY Medico-Legal Solutions" className="footer-logo-img" />
            </Link>
            {footer?.tagline ? <p className="footer-brand-desc">{footer.tagline}</p> : null}
            {social.length ? (
              <div className="footer-brand-connect">
                <p className="footer-brand-connect-label">Connect with us</p>
                <div className="footer-socials">
                  {social.map((item, i) => (
                    <a
                      key={i}
                      href={item.url}
                      className="social-btn"
                      aria-label={item.platform}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {socialSvg[item.platform] || item.platform.charAt(0).toUpperCase()}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {columns.map((column, i) => (
            <div className="footer-col" key={i}>
              {column.title ? <h4 className="footer-col-heading">{column.title}</h4> : null}
              <ul className="footer-links">
                {(column.links || []).map((item, j) => (
                  <li key={j}>
                    <CMSLink {...item.link} appearance="inline" />
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {contact ? (
            <div className="footer-col">
              <h4 className="footer-col-heading">Contact</h4>
              <address className="footer-address">
                {contact.phone ? (
                  <a
                    href={contact.phoneHref || `tel:${contact.phone.replace(/\s+/g, '')}`}
                    className="footer-contact-item"
                  >
                    <div className="footer-contact-icon">
                      <PhoneIcon />
                    </div>
                    <span>{contact.phone}</span>
                  </a>
                ) : null}
                {contact.email ? (
                  <a href={`mailto:${contact.email}`} className="footer-contact-item">
                    <div className="footer-contact-icon">
                      <EmailIcon />
                    </div>
                    <span>{contact.email}</span>
                  </a>
                ) : null}
                {contact.address ? (
                  <div className="footer-contact-item">
                    <div className="footer-contact-icon">
                      <PinIcon />
                    </div>
                    <span style={{ whiteSpace: 'pre-line' }}>{contact.address}</span>
                  </div>
                ) : null}
              </address>
            </div>
          ) : null}
        </div>

        <div className="footer-bottom">
          <span className="footer-copyright">
            &copy; {year} VERIFY Medico-Legal Solutions. All rights reserved.
          </span>
          {legalLinks.length ? (
            <div className="footer-legal">
              {legalLinks.map((item, i) => (
                <CMSLink key={i} {...item.link} appearance="inline" />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </footer>
  )
}
