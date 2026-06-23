import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'

type Category = {
  id: string
  name: string
  slug: string
}

type Product = {
  id: string
  name: string
  slug: string
  price: number
  discountPrice: number | null
  images: string | null
}

type Article = {
  id: string
  title: string
  slug: string
  publishedAt: Date | null
}

// Reusable components
function CategoryCard({ name, slug }: { name: string; slug: string }) {
  return (
    <Link 
      href={`/shop-category/${slug}`} 
      className="group block bg-[#161622] rounded-xl p-4 hover:border-[#FF5722]/60 border border-transparent transition"
    >
      <div className="aspect-square bg-[#12121A] rounded-lg mb-3 flex items-center justify-center text-[#9CA3AF] text-sm group-hover:text-[#FF5722]">
        📷 {name.split(' ').slice(0,2).join(' ')}
      </div>
      <div className="text-sm font-medium text-center text-white">{name}</div>
    </Link>
  )
}

export const dynamic = 'force-dynamic'

export default async function Home() {
  // Fetch real data from DB (Phase 2)
  const categories: Category[] = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    take: 6,
  })

  const bestSellers: Product[] = await prisma.product.findMany({
    where: { isPopular: true },
    take: 4,
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      discountPrice: true,
      images: true,
    }
  })

  const recentArticles: Article[] = await prisma.article.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: 'desc' },
    take: 4,
  })

  return (
    <div>
      {/* Hero */}
      <div className="bg-[#12121A] border-b border-white/5">
        <div className="container py-14 md:py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-[46px] font-black tracking-tight leading-none mb-4">
              GIORNO+ <span className="text-[#FF5722]">อะไหล่แต่ง</span>
            </h1>
            <p className="text-lg text-[#B0B8C8] mb-8">
              ศูนย์รวมข้อมูล ของแต่ง อะไหล่แต่ง Giorno และบทความข่าวสาร Honda Giorno+ ครบวงจร
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="https://s.shopee.co.th/1gG19oW9Ev" target="_blank" className="btn-accent inline-flex items-center justify-center px-8 py-3 text-base">ช้อปเลยตอนนี้</a>
              <Link href="/shop" className="inline-flex items-center justify-center px-8 py-3 border border-white/20 hover:bg-white/5 rounded-full text-base font-medium">ดูสินค้าทั้งหมด</Link>
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm max-w-xl mx-auto">
            <div className="bg-[#161622] rounded px-4 py-2">Shopee Guarantee<br /><span className="text-xs text-[#9CA3AF]">คืนเงิน 100%</span></div>
            <div className="bg-[#161622] rounded px-4 py-2">Rating 4.9+<br /><span className="text-xs text-[#9CA3AF]">ร้านค้ายอดนิยม 5 ดาว</span></div>
            <div className="bg-[#161622] rounded px-4 py-2">จัดส่งฟรี<br /><span className="text-xs text-[#9CA3AF]">1-2 วัน</span></div>
            <div className="bg-[#161622] rounded px-4 py-2">เก็บเงินปลายทาง<br /><span className="text-xs text-[#9CA3AF]">จ่ายเมื่อได้รับ</span></div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="container py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">หมวดหมู่สินค้า</h2>
          <Link href="/shop" className="text-sm text-[#FF5722] hover:underline">ดูทั้งหมด →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {categories.map((cat) => <CategoryCard key={cat.id} name={cat.name} slug={cat.slug} />)}
        </div>
      </div>

      {/* Best Sellers */}
      <div className="bg-[#12121A] py-12 border-y border-white/5">
        <div className="container">
          <div className="flex justify-between mb-6 items-end">
            <div>
              <div className="text-[#FF5722] text-sm tracking-widest">🔥 ขายดีที่สุด</div>
              <h2 className="text-2xl font-semibold">Best Sellers</h2>
            </div>
            <Link href="/shop?sort=popular" className="text-sm text-[#FF5722]">ดูทั้งหมด →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bestSellers.map((p) => (
              <ProductCard 
                key={p.id} 
                name={p.name} 
                price={p.price} 
                discountPrice={p.discountPrice} 
                slug={p.slug}
                images={p.images}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Magazine */}
      <div className="container py-12">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-semibold">บทความ &amp; รีวิว</h2>
          <Link href="/articles" className="text-sm text-[#FF5722]">อ่านทั้งหมด →</Link>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {recentArticles.length > 0 ? (
            recentArticles.map((a) => (
              <Link key={a.id} href={`/article/${a.slug}`} className="flex gap-4 bg-[#161622] p-4 rounded-xl hover:bg-[#1f1f2b]">
                <div className="w-28 h-20 bg-[#0F0F15] rounded shrink-0" />
                <div>
                  <div className="text-xs text-[#FF5722] mb-1">รีวิว &amp; ข้อมูลเจาะลึก</div>
                  <div className="font-medium leading-tight line-clamp-2">{a.title}</div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-[#9CA3AF]">ไม่มีบทความ</p>
          )}
        </div>
      </div>
    </div>
  )
}
