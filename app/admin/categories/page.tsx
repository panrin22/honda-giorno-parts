import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

async function createCategory(formData: FormData) {
  'use server'
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string

  if (!name || !slug) return

  await prisma.category.create({
    data: { name, slug },
  })

  revalidatePath('/admin/categories')
}

async function deleteCategory(id: string) {
  'use server'
  await prisma.category.delete({ where: { id } })
  revalidatePath('/admin/categories')
}

export default async function AdminCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { products: true, articles: true },
      },
    },
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Categories</h1>
      </div>

      {/* Create Form */}
      <div className="bg-[#161622] rounded-2xl p-6 mb-8 border border-white/10">
        <h3 className="font-semibold mb-4">เพิ่มหมวดหมู่ใหม่</h3>
        <form action={createCategory} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            name="name"
            placeholder="ชื่อหมวดหมู่ (เช่น ช่วงล่างและโช้คอัพ)"
            className="bg-[#12121A] border border-white/10 rounded-xl px-4 py-3"
            required
          />
          <input
            name="slug"
            placeholder="slug (เช่น ช่วงล่างและโช้คอัพ)"
            className="bg-[#12121A] border border-white/10 rounded-xl px-4 py-3"
            required
          />
          <button type="submit" className="bg-[#FF5722] hover:bg-[#FF7043] px-6 py-3 rounded-xl font-medium">
            เพิ่มหมวดหมู่
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-[#161622] rounded-2xl overflow-hidden border border-white/10">
        <table className="w-full">
          <thead className="bg-[#12121A] text-left text-sm text-[#9CA3AF]">
            <tr>
              <th className="p-4">ชื่อ</th>
              <th className="p-4">Slug</th>
              <th className="p-4">สินค้า</th>
              <th className="p-4">บทความ</th>
              <th className="p-4 w-24"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-white/5">
                <td className="p-4 font-medium">{cat.name}</td>
                <td className="p-4 text-[#9CA3AF] text-sm">{cat.slug}</td>
                <td className="p-4">{cat._count.products}</td>
                <td className="p-4">{cat._count.articles}</td>
                <td className="p-4">
                  <form action={async () => { 'use server'; await deleteCategory(cat.id) }}>
                    <button className="text-red-400 hover:text-red-500 text-sm">ลบ</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <div className="p-8 text-center text-[#9CA3AF]">ยังไม่มีหมวดหมู่</div>
        )}
      </div>
    </div>
  )
}
