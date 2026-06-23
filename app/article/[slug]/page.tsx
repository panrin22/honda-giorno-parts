import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function ArticleDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const article = await prisma.article.findUnique({
    where: { slug },
    include: { category: true },
  })

  if (!article) {
    return <div className="container py-12">ไม่พบบทความ</div>
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "image": article.coverImage || "",
    "datePublished": article.publishedAt?.toISOString(),
    "author": {
      "@type": "Organization",
      "name": "Giorno Parts"
    }
  }

  return (
    <div className="container py-12 max-w-3xl">
      <Link href="/articles" className="text-sm text-[#FF5722]">← กลับไป Magazine</Link>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mt-4">
        <div className="text-xs text-[#FF5722]">{article.category?.name || 'บทความ'}</div>
        <h1 className="text-3xl font-bold mt-1">{article.title}</h1>
        <div className="text-sm text-[#9CA3AF] mt-1">
          {article.publishedAt?.toLocaleDateString('th-TH')}
        </div>
      </div>

      <div className="prose prose-invert mt-8 max-w-none text-[#B0B8C8] whitespace-pre-line">
        {article.content}
      </div>

      <div className="mt-12 p-6 bg-[#161622] rounded">
        <p className="text-sm">สนใจสินค้าที่เกี่ยวข้อง? <Link href="/shop" className="text-[#FF5722]">ดูสินค้าทั้งหมด →</Link></p>
      </div>
    </div>
  )
}
