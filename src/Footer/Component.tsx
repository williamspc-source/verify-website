import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import { CMSLink } from '@/components/Link'
import { Logo, resolveBrandLogo } from '@/components/Logo/Logo'

const socialGlyphs: Record<string, string> = {
  linkedin: 'in',
  facebook: 'f',
  instagram: 'ig',
  x: 'x',
}

export async function Footer() {
  const footer = await getCachedGlobal('footer', 1)()
  const settings = await getCachedGlobal('site-settings', 1)()

  const logo = resolveBrandLogo(settings?.logoFooter || settings?.logo)

  const columns = footer?.columns || []
  const contact = footer?.contact
  const hours = footer?.hours || []
  const social = footer?.social || []
  const legalLinks = footer?.legalLinks || []
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer mt-auto">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="footer-logo" aria-label="VERIFY Medico-Legal Solutions">
              <Logo {...(logo ?? {})} />
            </Link>
            {footer?.tagline ? <p className="footer-tagline">{footer.tagline}</p> : null}
          </div>

          {columns.map((column, i) => (
            <div className="footer-col" key={i}>
              {column.title ? <h3>{column.title}</h3> : null}
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
              <h3>Contact</h3>
              <ul className="footer-contact-list">
                {contact.phone ? (
                  <li>
                    <Link href={contact.phoneHref || `tel:${contact.phone.replace(/\s+/g, '')}`}>
                      <span className="footer-icon" aria-hidden="true">
                        &#9742;
                      </span>
                      <span>{contact.phone}</span>
                    </Link>
                  </li>
                ) : null}
                {contact.email ? (
                  <li>
                    <Link href={`mailto:${contact.email}`}>
                      <span className="footer-icon" aria-hidden="true">
                        &#9993;
                      </span>
                      <span>{contact.email}</span>
                    </Link>
                  </li>
                ) : null}
                {contact.address ? (
                  <li>
                    <Link href="/contact">
                      <span className="footer-icon" aria-hidden="true">
                        &#9679;
                      </span>
                      <span style={{ whiteSpace: 'pre-line' }}>{contact.address}</span>
                    </Link>
                  </li>
                ) : null}
              </ul>
            </div>
          ) : null}

          {hours.length || social.length ? (
            <div className="footer-col footer-hours-col">
              <h3>Office Hours</h3>
              {hours.map((entry, i) => (
                <p className="footer-hours" key={i}>
                  {entry.days ? <strong>{entry.days}</strong> : null}
                  {entry.time ? <span>{entry.time}</span> : null}
                </p>
              ))}
              {social.length ? (
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
                      {socialGlyphs[item.platform] || item.platform.charAt(0)}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="footer-bottom">
          <span>&copy; {year} VERIFY Medico-Legal Solutions</span>
          {legalLinks.length ? (
            <span className="footer-legal flex gap-4">
              {legalLinks.map((item, i) => (
                <CMSLink key={i} {...item.link} appearance="inline" />
              ))}
            </span>
          ) : null}
        </div>
      </div>
    </footer>
  )
}
