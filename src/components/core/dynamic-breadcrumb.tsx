'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useMemo } from 'react'

import { ChevronRight, Home } from 'lucide-react'

import { cn } from '@/utils/utils'

export interface BreadcrumbItem {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  isCurrentPage?: boolean
}

interface DynamicBreadcrumbProps {
  className?: string
  separator?: React.ReactNode
  homeIcon?: boolean
  maxItems?: number
  organizationName?: string
  projectName?: string
}

export function DynamicBreadcrumb({
  className,
  separator,
  homeIcon = true,
  maxItems = 5,
  organizationName,
  projectName,
}: DynamicBreadcrumbProps) {
  const pathname = usePathname()

  const breadcrumbItems = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean)
    const items: BreadcrumbItem[] = []

    // Home/Dashboard
    if (homeIcon) {
      items.push({
        label: 'Dashboard',
        href: '/dashboard',
        icon: Home,
      })
    }

    // Organization level
    if (organizationName && segments.includes('org')) {
      items.push({
        label: organizationName,
        href: `/org/${segments[segments.indexOf('org') + 1]}`,
      })
    }

    // Dynamic path parsing
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]
      const isLast = i === segments.length - 1

      switch (segment) {
        case 'dashboard':
          // Skip dashboard segment as it's already added as home icon
          break

        case 'projects':
          // Always add "Projeler" first
          if (!items.some((item) => item.label === 'Projeler')) {
            items.push({
              label: 'Projeler',
              href: '/projects',
              isCurrentPage: false,
            })
          }

          if (!isLast && segments[i + 1]) {
            // Specific project
            items.push({
              label: projectName || `Proje`,
              href: `/${segments.slice(0, i + 2).join('/')}`,
              isCurrentPage: i + 1 === segments.length - 1,
            })
            i++ // Skip next segment as we processed it
          } else if (isLast) {
            // Projects list page - already added above
            items[items.length - 1].isCurrentPage = true
          }
          break

        case 'profile':
          items.push({
            label: 'Profil',
            href: `/${segments.slice(0, i + 1).join('/')}`,
            isCurrentPage: isLast,
          })
          break

        case 'settings':
          items.push({
            label: 'Ayarlar',
            href: `/${segments.slice(0, i + 1).join('/')}`,
            isCurrentPage: isLast,
          })
          break

        case 'admin':
          items.push({
            label: 'Admin Panel',
            href: '/admin',
            isCurrentPage: isLast && segments.length === 1,
          })

          // Handle admin sub-pages
          if (!isLast && segments[i + 1]) {
            const nextSegment = segments[i + 1]
            switch (nextSegment) {
              case 'settings':
                items.push({
                  label: 'Ayarlar',
                  href: '/admin/settings',
                  isCurrentPage: i + 1 === segments.length - 1,
                })
                break
              case 'security':
                items.push({
                  label: 'Güvenlik',
                  href: '/admin/security',
                  isCurrentPage: i + 1 === segments.length - 1,
                })
                break
              case 'contact-messages':
                items.push({
                  label: 'İletişim Mesajları',
                  href: '/admin/contact-messages',
                  isCurrentPage: i + 1 === segments.length - 1,
                })
                break
              default:
                items.push({
                  label: formatSegmentLabel(nextSegment),
                  href: `/${segments.slice(0, i + 2).join('/')}`,
                  isCurrentPage: i + 1 === segments.length - 1,
                })
            }
            i++ // Skip next segment as we processed it
          }
          break

        case 'super-admin':
          items.push({
            label: 'Super Admin Panel',
            href: '/super-admin',
            isCurrentPage: isLast && segments.length === 1,
          })

          // Handle super-admin sub-pages
          if (!isLast && segments[i + 1]) {
            const nextSegment = segments[i + 1]
            switch (nextSegment) {
              case 'organizations':
                items.push({
                  label: 'Sistem Organizasyonları',
                  href: '/super-admin/organizations',
                  isCurrentPage: i + 1 === segments.length - 1,
                })
                break
              case 'users':
                items.push({
                  label: 'Sistem Kullanıcıları',
                  href: '/super-admin/users',
                  isCurrentPage: i + 1 === segments.length - 1,
                })
                break
              case 'stats':
                items.push({
                  label: 'Sistem İstatistikleri',
                  href: '/super-admin/stats',
                  isCurrentPage: i + 1 === segments.length - 1,
                })
                break
              default:
                items.push({
                  label: formatSegmentLabel(nextSegment),
                  href: `/${segments.slice(0, i + 2).join('/')}`,
                  isCurrentPage: i + 1 === segments.length - 1,
                })
            }
            i++ // Skip next segment as we processed it
          }
          break

        case 'password-setup':
          items.push({
            label: 'Şifre Kurulum',
            href: '/password-setup',
            isCurrentPage: isLast && segments.length === 1,
          })

          // Handle token parameter
          if (!isLast && segments[i + 1]) {
            items.push({
              label: 'Şifre Oluştur',
              href: `/${segments.slice(0, i + 2).join('/')}`,
              isCurrentPage: i + 1 === segments.length - 1,
            })
            i++ // Skip next segment as we processed it
          }
          break

        default:
          // Generic segment handling
          if (!['org'].includes(segment)) {
            items.push({
              label: formatSegmentLabel(segment),
              href: `/${segments.slice(0, i + 1).join('/')}`,
              isCurrentPage: isLast,
            })
          }
      }
    }

    // Trim items if exceeding maxItems
    if (items.length > maxItems) {
      return [
        items[0], // Always keep home
        {
          label: '...',
          href: '#',
          isCurrentPage: false,
        },
        ...items.slice(-(maxItems - 2)), // Keep last items
      ]
    }

    return items
  }, [pathname, homeIcon, maxItems, organizationName, projectName])

  // if (breadcrumbItems.length <= 1) return null // DEBUG: Always show breadcrumb

  return (
    <nav aria-label='Breadcrumb' className={cn('flex items-center space-x-1 text-sm text-muted-foreground', className)}>
      <ol className='flex items-center space-x-1' role='list'>
        {breadcrumbItems.map((item, index) => (
          <li key={`${item.href}-${index}`} className='flex items-center'>
            {index > 0 && (
              <span className='mx-2 select-none' aria-hidden='true'>
                {separator || <ChevronRight className='h-3 w-3' />}
              </span>
            )}
            {item.isCurrentPage ? (
              <span
                className='font-medium text-foreground'
                aria-current='page'
                aria-label={`Şu anki sayfa: ${item.label}`}
              >
                {item.icon && <item.icon className='h-4 w-4 mr-1 inline' />}
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className='flex items-center hover:text-foreground transition-colors focus:outline-none rounded-sm px-1'
                aria-label={`${item.label} sayfasına git`}
              >
                {item.icon && <item.icon className='h-4 w-4 mr-1' />}
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

function formatSegmentLabel(segment: string): string {
  // Convert URL segments to user-friendly labels
  const labelMap: Record<string, string> = {
    dashboard: 'Dashboard',
    projects: 'Projeler',
    tasks: 'Görevler',
    members: 'Üyeler',
    settings: 'Ayarlar',
    billing: 'Faturalama',
    analytics: 'Analitik',
    reports: 'Raporlar',
    admin: 'Admin Panel',
    'super-admin': 'Super Admin Panel',
    organizations: 'Organizasyonlar',
    users: 'Kullanıcılar',
    stats: 'İstatistikler',
    security: 'Güvenlik',
    'contact-messages': 'İletişim Mesajları',
    'password-setup': 'Şifre Kurulum',
    templates: 'Şablonlar',
  }

  return labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
}

// Context-aware breadcrumb hook
export function useBreadcrumb() {
  const pathname = usePathname()

  const getBreadcrumbContext = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean)

    return {
      isProjectPage: segments.includes('projects') && segments.length >= 2,
      isOrganizationPage: segments.includes('org'),
      isAdminPage: segments.includes('admin'),
      isSuperAdminPage: segments.includes('super-admin'),
      isPasswordSetupPage: segments.includes('password-setup'),
      currentProjectId: segments.includes('projects') ? segments[segments.indexOf('projects') + 1] : null,
      currentOrganizationId: segments.includes('org') ? segments[segments.indexOf('org') + 1] : null,
      currentAdminSection: segments.includes('admin') ? segments[segments.indexOf('admin') + 1] : null,
      currentSuperAdminSection: segments.includes('super-admin') ? segments[segments.indexOf('super-admin') + 1] : null,
      passwordSetupToken: segments.includes('password-setup') ? segments[segments.indexOf('password-setup') + 1] : null,
      depth: segments.length,
    }
  }, [pathname])

  return {
    pathname,
    context: getBreadcrumbContext,
  }
}
