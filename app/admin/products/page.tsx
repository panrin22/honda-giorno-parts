import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import fs from 'fs/promises'
import path from 'path'

async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: 'asc' } })
}

async function createProduct(formData: FormData) {
  'use server'

  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const price = parseInt(formData.get('price') as string)
  const discountPrice = formData.get('discountPrice') ? parseInt(formData.get('discountPrice') as string) : null
  const shopeeUrl = formData.get('shopeeUrl') as string
  const description = formData.get('description') as string
  const categoryId = formData.get('categoryId') as string
  const isPopular = formData.get('isPopular') === 'on'

  // Handle image uploads
  const files = formData.getAll('images') as File[]
  const imagePaths: string[] = []

  for (const file of files) {
    if (file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const filename = `${Date.now()}-${file.name}`
      const uploadDir = path.join(process.cwd(), 'public/uploads/products')
      await fs.mkdir(uploadDir, { recursive: true })
      await fs.writeFile(path.join(uploadDir, filename), buffer)
      imagePaths.push(`/uploads/products/${filename}`)
    }
  }

  await prisma.product.create({
    data: {
      name,
      slug,
      price,
      discountPrice,
      shopeeUrl,
      description,
      images: JSON.stringify(imagePaths),
      categoryId,
      isPopular,
    },
  })

  revalidatePath('/admin/products')
  revalidatePath('/shop')
}

async function deleteProduct(id: string) {
  'use server'
  await prisma.product.delete({ where: { id } })
  revalidatePath('/admin/products')
}

async function editProduct(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const price = parseInt(formData.get('price') as string)
  const discountPrice = formData.get('discountPrice') ? parseInt(formData.get('discountPrice') as string) : null
  const shopeeUrl = formData.get('shopeeUrl') as string
  const description = formData.get('description') as string
  const isPopular = formData.get('isPopular') === 'on'

  await prisma.product.update({
    where: { id },
    data: {
      name,
      price,
      discountPrice,
      shopeeUrl,
      description,
      isPopular,
    },
  })

  revalidatePath('/admin/products')
}

export default async function AdminProducts({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const { edit } = await searchParams
  const editId = edit || null

  const [products, categories] = await Promise.all([
    prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: 'desc' } }),
    getCategories(),
  ])

  const editingProduct = editId ? products.find((p: (typeof products)[number]) => p.id === editId) : null

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
      </div>

      {/* Create Form */}h
      <div className="bg-[#161622] rounded-2xl p-6 mb-8 border border-white/10">
        <h3 className="font-semibold mb-4">เพิ่มสินค้าใหม่</h3>
        <form action={createProduct} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <input name="name" placeholder="ชื่อสินค้า" className="bg-[#12121A] border border-white/10 rounded-xl px-4 py-3" required />
          <input name="slug" placeholder="slug (unique)" className="bg-[#12121A] border border-white/10 rounded-xl px-4 py-3" required />

          <input name="price" type="number" placeholder="ราคา" className="bg-[#12121A] border border-white/10 rounded-xl px-4 py-3" required />
          <input name="discountPrice" type="number" placeholder="ราคาโปรโมชั่น (ถ้ามี)" className="bg-[#12121A] border border-white/10 rounded-xl px-4 py-3" />

          <input name="shopeeUrl" placeholder="Shopee URL" className="bg-[#12121A] border border-white/10 rounded-xl px-4 py-3 md:col-span-2" required />

          <select name="categoryId" className="bg-[#12121A] border border-white/10 rounded-xl px-4 py-3" required>
            <option value="">เลือกหมวดหมู่</option>
            {categories.map((c: (typeof categories)[number]) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <input type="checkbox" name="isPopular" id="isPopular" className="accent-[#FF5722]" />
            <label htmlFor="isPopular" className="text-sm">แสดงใน Best Sellers</label>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm mb-1.5 text-[#9CA3AF]">รูปภาพสินค้า (เลือกได้หลายรูป)</label>
            <input type="file" name="images" multiple accept="image/*" className="text-sm" />
          </div>

          <textarea name="description" placeholder="คำอธิบาย" rows={3} className="md:col-span-2 bg-[#12121A] border border-white/10 rounded-xl px-4 py-3" />

          <button type="submit" className="md:col-span-2 mt-2 bg-[#FF5722] hover:bg-[#FF7043] py-3 rounded-xl font-medium">
            เพิ่มสินค้า
          </button>
        </form>
      </div>

      {/* Edit Form */}
      {editingProduct && (
        <div className="bg-[#161622] rounded-2xl p-6 mb-8 border border-[#FF5722]/50">
          <h3 className="font-semibold mb-4">แก้ไขสินค้า: {editingProduct.name}</h3>
          <form action={editProduct} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <input type="hidden" name="id" value={editingProduct.id} />
            <input name="name" defaultValue={editingProduct.name} className="bg-[#12121A] border border-white/10 rounded-xl px-4 py-3" required />
            <input name="price" type="number" defaultValue={editingProduct.price} className="bg-[#12121A] border border-white/10 rounded-xl px-4 py-3" required />
            <input name="discountPrice" type="number" defaultValue={editingProduct.discountPrice || ''} placeholder="ราคาโปร (ถ้ามี)" className="bg-[#12121A] border border-white/10 rounded-xl px-4 py-3" />
            <input name="shopeeUrl" defaultValue={editingProduct.shopeeUrl} className="bg-[#12121A] border border-white/10 rounded-xl px-4 py-3 md:col-span-2" required />
            <div className="flex items-center gap-2 md:col-span-2">
              <input type="checkbox" name="isPopular" id="editPopular" defaultChecked={editingProduct.isPopular} className="accent-[#FF5722]" />
              <label htmlFor="editPopular" className="text-sm">แสดงใน Best Sellers</label>
            </div>
            <textarea name="description" defaultValue={editingProduct.description || ''} rows={3} className="md:col-span-2 bg-[#12121A] border border-white/10 rounded-xl px-4 py-3" />
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="bg-[#FF5722] hover:bg-[#FF7043] py-3 px-8 rounded-xl font-medium">บันทึกการแก้ไข</button>
              <Link href="/admin/products" className="px-6 py-3 border border-white/20 rounded-xl">ยกเลิก</Link>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-[#161622] rounded-2xl overflow-hidden border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-[#12121A]">
            <tr>
              <th className="p-4 text-left">สินค้า</th>
              <th className="p-4 text-left">หมวดหมู่</th>
              <th className="p-4">ราคา</th>
              <th className="p-4">Popular</th>
              <th className="p-4 w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {products.map((p: (typeof products)[number]) => {
              const hasDiscount = p.discountPrice && p.discountPrice < p.price
              return (
                <tr key={p.id} className="hover:bg-white/5">
                  <td className="p-4">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-[#9CA3AF]">{p.slug}</div>
                  </td>
                  <td className="p-4 text-[#B0B8C8]">{p.category?.name}</td>
                  <td className="p-4">
                    {hasDiscount && <span className="line-through text-[#9CA3AF] mr-1.5">฿{p.price}</span>}
                    <span className="font-semibold">฿{p.discountPrice ?? p.price}</span>
                  </td>
                  <td className="p-4">{p.isPopular ? '✓' : ''}</td>
                  <td className="p-4 flex gap-3 text-sm">
                    <Link href={`/admin/products?edit=${p.id}`} className="text-blue-400 hover:text-blue-500">แก้ไข</Link>
                    <form action={async () => { 'use server'; await deleteProduct(p.id) }}>
                      <button className="text-red-400 hover:text-red-500">ลบ</button>
                    </form>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {products.length === 0 && <div className="p-8 text-center text-[#9CA3AF]">ยังไม่มีสินค้า</div>}
      </div>
    </div>
  )
}
