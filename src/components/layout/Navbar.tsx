'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface NavbarProps {
  locale: string
  session: {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role: string
      firstName?: string
      lastName?: string
    }
  } | null
  messages: Record<string, Record<string, string>>
}

const locales = ['de', 'en', 'fr']

export default function Navbar({ locale, session, messages }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const t = messages.nav ?? {}

  const navLinks = [
    { label: t.kurse ?? 'Kurse', href: `/${locale}/kurse` },
    { label: t.preise ?? 'Preise', href: `/${locale}/preise` },
  ]

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    return segments.join('/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-neutral-200">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-1 font-bold text-xl font-display">
            <span className="text-neutral-700">Twyne</span>
            <span className="text-primary">Academy</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  pathname.startsWith(link.href)
                    ? 'text-primary'
                    : 'text-neutral-600 hover:text-neutral-900'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            {/* Locale switcher */}
            <div className="flex items-center gap-1 text-xs text-neutral-400">
              {locales.map((l, i) => (
                <span key={l} className="flex items-center gap-1">
                  {i > 0 && <span>|</span>}
                  <Link
                    href={switchLocale(l)}
                    className={cn(
                      'hover:text-neutral-700 transition-colors uppercase',
                      locale === l && 'text-primary font-semibold'
                    )}
                  >
                    {l}
                  </Link>
                </span>
              ))}
            </div>

            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  <Avatar
                    src={session.user.image}
                    firstName={session.user.firstName}
                    lastName={session.user.lastName}
                    size="sm"
                  />
                  <ChevronDown className="h-4 w-4 text-neutral-400" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-neutral-200 shadow-lg py-1 z-50">
                    <div className="px-4 py-3 border-b border-neutral-100">
                      <p className="text-sm font-medium text-neutral-900 truncate">
                        {session.user.firstName
                          ? `${session.user.firstName} ${session.user.lastName ?? ''}`
                          : session.user.email}
                      </p>
                      <p className="text-xs text-neutral-500 truncate">{session.user.email}</p>
                    </div>
                    <Link
                      href={`/${locale}/dashboard`}
                      className="flex px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      {t.dashboard ?? 'Dashboard'}
                    </Link>
                    <Link
                      href={`/${locale}/profil`}
                      className="flex px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      {t.profil ?? 'Profil'}
                    </Link>
                    {session.user.role === 'ADMIN' && (
                      <Link
                        href={`/${locale}/admin`}
                        className="flex px-4 py-2 text-sm text-primary font-medium hover:bg-primary-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={() => signOut({ callbackUrl: `/${locale}` })}
                      className="flex w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      {t.logout ?? 'Abmelden'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button size="sm" asChild>
                <Link href={`/${locale}/login`}>{t.login ?? 'Anmelden'}</Link>
              </Button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-neutral-100"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2 text-sm font-medium text-neutral-700 hover:text-primary transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {session ? (
              <>
                <Link href={`/${locale}/dashboard`} className="py-2 text-sm text-neutral-700" onClick={() => setMobileOpen(false)}>
                  {t.dashboard}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: `/${locale}` })}
                  className="py-2 text-sm text-left text-neutral-700"
                >
                  {t.logout}
                </button>
              </>
            ) : (
              <Link href={`/${locale}/login`} onClick={() => setMobileOpen(false)}>
                <Button size="sm" className="w-full mt-2">{t.login ?? 'Anmelden'}</Button>
              </Link>
            )}
            <div className="flex gap-3 pt-2 border-t border-neutral-100 mt-2">
              {locales.map((l) => (
                <Link
                  key={l}
                  href={switchLocale(l)}
                  className={cn(
                    'text-xs uppercase font-medium',
                    locale === l ? 'text-primary' : 'text-neutral-400 hover:text-neutral-700'
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {l}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
