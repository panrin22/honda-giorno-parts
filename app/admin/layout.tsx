import Link from 'next/link'
import { ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-[#0A0A0F] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#12121A] border-r border-white/10 p-6 flex flex-col">
        <div className="mb-10">
          <Link href="/admin" className="font-display text-2xl font-black tracking-tighter">
            GIORNO<span className="text-[#FF5722]">PARTS</span>
          </Link>
          <div className="text-xs text-[#9CA3AF] mt-1">Admin</div>
        </div>

        <nav className="space-y-1 text-sm">
          <Link href="/admin" className="block px-4 py-2.5 rounded-lg hover:bg-white/5">
            Dashboard
          </Link>
          <Link href="/admin/products" className="block px-4 py-2.5 rounded-lg hover:bg-white/5">
            Products
          </Link>
          <Link href="/admin/articles" className="block px-4 py-2.5 rounded-lg hover:bg-white/5">
            Articles
          </Link>
          <Link href="/admin/categories" className="block px-4 py-2.5 rounded-lg hover:bg-white/5">
            Categories
          </Link>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10 text-xs text-[#9CA3AF] space-y-2">
          <Link href="/" className="block hover:text-white">← Back to site</Link>
          <form action="/api/admin/logout" method="POST">
            <button type="submit" className="text-red-400 hover:text-red-500">Logout</button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
