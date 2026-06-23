import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  })

  if (!product) {
    return (
      <div className="container py-12">
        <p>ไม่พบสินค้า</p>
        <Link href="/shop">กลับไปช้อป</Link>
      </div>
    )
  }

  const hasDiscount = product.discountPrice && product.discountPrice < product.price
  const images: string[] = product.images ? JSON.parse(product.images) : []

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description || "",
    "image": images.length > 0 ? images[0] : "",
    "brand": {
      "@type": "Brand",
      "name": "Honda"
    },
    "offers": {
      "@type": "Offer",
      "url": product.shopeeUrl,
      "priceCurrency": "THB",
      "price": (product.discountPrice || product.price).toString(),
      "availability": "https://schema.org/InStock"
    }
  }

  return (
    <div className="container py-12 max-w-3xl">
      <Link href="/shop" className="text-sm text-[#FF5722] mb-4 block">← กลับไปช้อป</Link>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-[#161622] rounded-2xl aspect-square relative overflow-hidden">
          <Image
            src={images.length > 0 && !images[0].startsWith('/uploads/') ? images[0] : `https://picsum.photos/600/600?random=${encodeURIComponent(product.slug)}`}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div>
          <div className="text-sm text-[#9CA3AF]">{product.category?.name}</div>
          <h1 className="text-3xl font-bold mt-1">{product.name}</h1>

          <div className="mt-4 flex items-baseline gap-2">
            {hasDiscount && (
              <span className="line-through text-xl text-[#9CA3AF]">฿{product.price}</span>
            )}
            <span className="text-4xl font-bold text-[#FF5722]">
              ฿{hasDiscount ? product.discountPrice : product.price}
            </span>
            <span className="text-sm text-[#9CA3AF]">ส่งฟรี</span>
          </div>

          <div className="mt-6">
            <a 
              href={product.shopeeUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-accent inline-flex w-full md:w-auto justify-center text-base py-4 px-10"
            >
              ซื้อเลยที่ Shopee
            </a>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold mb-2">รายละเอียด</h3>
            <p className="text-[#B0B8C8]">{product.description || 'ไม่มีรายละเอียดเพิ่มเติม'}</p>
          </div>

          {product.specs && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">สเปก</h3>
              <pre className="text-xs bg-[#12121A] p-4 rounded overflow-auto text-[#9CA3AF]">
                {product.specs}
              </pre>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 text-xs text-[#9CA3AF]">
        * ราคาและโปรโมชั่นอาจเปลี่ยนแปลงได้ โปรดตรวจสอบที่ Shopee
      </div>
    </div>
  )
}
