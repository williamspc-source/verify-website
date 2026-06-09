import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { resolveBrandLogo } from '@/components/Logo/Logo'
import React from 'react'

export async function Header() {
  const headerData = await getCachedGlobal('header', 1)()
  const settings = await getCachedGlobal('site-settings', 1)()

  const logo = resolveBrandLogo(settings?.logo)

  return <HeaderClient data={headerData} logo={logo} />
}
