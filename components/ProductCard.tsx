import Link from 'next/link'
import Image from 'next/image'

interface ProductCardProps {
  name: string
  price: number
  discountPrice: number | null
  slug: string
  images?: string | null
}

export default function ProductCard({ name, price, discountPrice, slug, images }: ProductCardProps) {
  const hasDiscount = discountPrice && discountPrice < price
  let imageSrc = null

  if (images) {
    try {
      const parsed = JSON.parse(images)
      if (parsed.length > 0) imageSrc = parsed[0]
    } catch {}
  }

  // For demo: use placeholder if no real image or local path not exist
  const usePlaceholder = !imageSrc || imageSrc.startsWith('/uploads/') || imageSrc === '/file.svg'
  const displaySrc = usePlaceholder 
    ? `https://picsum.photos/400/300?random=${encodeURIComponent(name.substring(0,10))}`
    : imageSrc

  return (
    <Link href={`/product/${slug}`} className="block bg-[#161622] rounded-xl overflow-hidden hover:border-[#FF5722]/50 border border-transparent transition group">
      <div className="relative h-44 bg-[#0F0F15]">
        <Image 
          src={displaySrc} 
          alt={name} 
          fill 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform" 
        />
      </div>
      <div className="p-3 text-sm">
        <div className="font-medium line-clamp-2 group-hover:text-[#FF5722]">{name}</div>
        <div className="mt-2 flex items-baseline gap-1.5">
          {hasDiscount && <span className="text-[#FF5722] line-through text-xs">฿{price}</span>}
          <span className="font-bold text-lg">฿{hasDiscount ? discountPrice : price}</span>
          <span className="text-[10px] text-[#9CA3AF]">ส่งฟรี</span>
        </div>
        <div className="mt-2 text-[11px] text-[#FF5722]">เช็คราคาที่ Shopee →</div>
      </div>
    </Link>
  )
}
