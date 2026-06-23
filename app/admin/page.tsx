import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function AdminDashboard() {
  const [productCount, articleCount, categoryCount] = await Promise.all([
    prisma.product.count(),
    prisma.article.count(),
    prisma.category.count(),
  ])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-[#B0B8C8] mb-8">จัดการเนื้อหาและสินค้าของ Giorno Parts</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#161622] rounded-2xl p-6 border border-white/10">
          <div className="text-4xl font-bold">{productCount}</div>
          <div className="text-[#9CA3AF]">Products</div>
          <Link href="/admin/products" className="text-sm text-[#FF5722] mt-3 inline-block">จัดการสินค้า →</Link>
        </div>
        <div className="bg-[#161622] rounded-2xl p-6 border border-white/10">
          <div className="text-4xl font-bold">{articleCount}</div>
          <div className="text-[#9CA3AF]">Articles</div>
          <Link href="/admin/articles" className="text-sm text-[#FF5722] mt-3 inline-block">จัดการบทความ →</Link>
        </div>
        <div className="bg-[#161622] rounded-2xl p-6 border border-white/10">
          <div className="text-4xl font-bold">{categoryCount}</div>
          <div className="text-[#9CA3AF]">Categories</div>
          <Link href="/admin/categories" className="text-sm text-[#FF5722] mt-3 inline-block">จัดการหมวดหมู่ →</Link>
        </div>
      </div>

      <div className="bg-[#161622] rounded-2xl p-6 border border-white/10">
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/products" className="px-5 py-2 bg-[#FF5722] rounded-full text-sm font-medium">+ เพิ่มสินค้า</Link>
          <Link href="/admin/articles" className="px-5 py-2 border border-white/20 rounded-full text-sm font-medium">+ เพิ่มบทความ</Link>
          <Link href="/admin/categories" className="px-5 py-2 border border-white/20 rounded-full text-sm font-medium">จัดการหมวดหมู่</Link>
        </div>
      </div>
    </div>
  )
}
