import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!category) {
    return <div className="container py-12">ไม่พบหมวดหมู่</div>
  }

  return (
    <div className="container py-12">
      <Link href="/shop" className="text-sm text-[#FF5722]">← กลับไป Shop</Link>
      <h1 className="text-3xl font-bold mt-4 mb-8">{category.name}</h1>

      {category.products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {category.products.map((p) => {
            const hasDiscount = p.discountPrice && p.discountPrice < p.price
            return (
              <Link key={p.id} href={`/product/${p.slug}`} className="block bg-[#161622] rounded-xl p-4 hover:border-[#FF5722]/50 border border-transparent">
                <div className="h-40 bg-[#0F0F15] rounded mb-3" />
                <div className="font-medium">{p.name}</div>
                <div className="mt-1">
                  {hasDiscount && <span className="line-through text-xs text-[#9CA3AF]">฿{p.price} </span>}
                  <span className="font-bold">฿{hasDiscount ? p.discountPrice : p.price}</span>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <p>ยังไม่มีสินค้าในหมวดนี้</p>
      )}
    </div>
  )
}
