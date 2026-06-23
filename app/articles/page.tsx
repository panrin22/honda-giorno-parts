import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: 'desc' },
    include: { category: true },
  })

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-2">GIORNO MAGAZINE</h1>
      <p className="text-[#B0B8C8] mb-8">แหล่งรวมเทคนิค รีวิว และเรื่องราวเจาะลึก สำหรับชาว Honda Giorno+</p>

      {articles.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {articles.map((article) => (
            <Link 
              key={article.id} 
              href={`/article/${article.slug}`} 
              className="block bg-[#161622] p-5 rounded-xl hover:border-[#FF5722]/40 border border-transparent transition"
            >
              <div className="text-xs text-[#FF5722]">
                {article.category?.name || 'รีวิว & ข้อมูลเจาะลึก'}
              </div>
              <div className="font-semibold mt-1 text-lg leading-tight">{article.title}</div>
              <div className="text-xs text-[#9CA3AF] mt-2">
                {article.publishedAt?.toLocaleDateString('th-TH')}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>ไม่มีบทความ</p>
      )}
    </div>
  )
}
