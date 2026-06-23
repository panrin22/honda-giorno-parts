'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface SortSelectProps {
  currentSort: string
}

export default function SortSelect({ currentSort }: SortSelectProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (e.target.value) {
      params.set('sort', e.target.value)
    } else {
      params.delete('sort')
    }
    
    // Preserve other params like q and category
    router.push(`/shop?${params.toString()}`)
  }

  return (
    <select 
      className="bg-[#161622] border border-white/10 rounded-full px-4 py-2 text-sm"
      onChange={handleChange}
      defaultValue={currentSort}
    >
      <option value="popular">ขายดี</option>
      <option value="newest">ใหม่ล่าสุด</option>
      <option value="price-low">ราคาต่ำ → สูง</option>
      <option value="price-high">ราคาสูง → ต่ำ</option>
    </select>
  )
}
