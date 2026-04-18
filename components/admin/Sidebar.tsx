'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  FolderTree,
  MapPin,
  Clock,
  FileText,
  File,
  Settings,
} from 'lucide-react'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Bestellungen', icon: ShoppingBag },
  { href: '/admin/menu', label: 'Menü', icon: UtensilsCrossed },
  { href: '/admin/categories', label: 'Kategorien', icon: FolderTree },
  { href: '/admin/delivery-zones', label: 'Liefergebiete', icon: MapPin },
  { href: '/admin/opening-hours', label: 'Öffnungszeiten', icon: Clock },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/pages', label: 'Seiten', icon: File },
  { href: '/admin/settings', label: 'Einstellungen', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-stone-200 bg-white min-h-screen">
      <div className="p-6">
        <Link href="/admin/dashboard" className="font-display text-xl font-bold text-stone-900">
          Admin
        </Link>
      </div>
      <nav className="px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-moss-50 text-moss-700'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
