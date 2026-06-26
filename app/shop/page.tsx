import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import ProductCard from '@/components/ProductCard'
import SortSelect from '@/components/SortSelect'

type SearchParams = {
  q?: string
  category?: string
  sort?: string
}

export const dynamic = 'force-dynamic'

export default async function ShopPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const q = params.q?.toString().toLowerCase() || ''
  const categorySlug = params.category?.toString() || ''
  const sort = params.sort?.toString() || 'popular'

  // Fetch categories for filter
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })

  // Build query
  const where: Prisma.ProductWhereInput = {}
  if (q) {
    where.name = { contains: q }
  }
  if (categorySlug) {
    const cat = await prisma.category.findUnique({ where: { slug: categorySlug } })
    if (cat) where.categoryId = cat.id
  }

  // Sort
  let orderBy: Prisma.ProductOrderByWithRelationInput = { isPopular: 'desc' }
  if (sort === 'price-low') orderBy = { price: 'asc' }
  if (sort === 'price-high') orderBy = { price: 'desc' }
  if (sort === 'newest') orderBy = { createdAt: 'desc' }

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: { category: true },
  })

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-2">SHOP GIORNO+</h1>
      <p className="text-[#B0B8C8] mb-8">ศูนย์รวมอะไหล่และของแต่ง Honda Giorno+ คัดสรรมาเพื่อคุณ</p>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <form action="/shop" method="get" className="flex-1">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="ค้นหาสินค้า..."
            className="w-full bg-[#161622] border border-white/10 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-[#FF5722]"
          />
        </form>

        <div className="flex gap-2 flex-wrap">
          <Link href="/shop" className={`px-4 py-2 text-sm rounded-full border ${!categorySlug ? 'border-[#FF5722] text-[#FF5722]' : 'border-white/10 hover:border-white/30'}`}>
            ทั้งหมด
          </Link>
          {categories.map(cat => (
            <Link 
              key={cat.id} 
              href={`/shop?category=${cat.slug}${q ? `&q=${q}` : ''}`}
              className={`px-4 py-2 text-sm rounded-full border whitespace-nowrap ${categorySlug === cat.slug ? 'border-[#FF5722] text-[#FF5722]' : 'border-white/10 hover:border-white/30'}`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <SortSelect currentSort={sort} />
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={product.price}
              discountPrice={product.discountPrice}
              slug={product.slug}
              images={product.images}
            />
          ))}
        </div>
      ) : (
        <p className="text-center py-12 text-[#9CA3AF]">ไม่พบสินค้าที่ตรงกับการค้นหา</p>
      )}

      <div className="mt-8 text-xs text-center text-[#9CA3AF]">
        คลิกที่สินค้าเพื่อดูรายละเอียด • ลิงก์ทั้งหมดไปยัง Shopee
      </div>
    </div>
  )
}
