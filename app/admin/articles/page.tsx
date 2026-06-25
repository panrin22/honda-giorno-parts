import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import fs from 'fs/promises'
import path from 'path'

async function createArticle(formData: FormData) {
  'use server'
  const title = formData.get('title') as string
  const slug = formData.get('slug') as stringh
  const content = formData.get('content') as string
  const categoryId = formData.get('categoryId') as string || null

  let coverImage = ''
  const file = formData.get('coverImage') as File
  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${Date.now()}-${file.name}`
    const uploadDir = path.join(process.cwd(), 'public/uploads/articles')
    await fs.mkdir(uploadDir, { recursive: true })
    await fs.writeFile(path.join(uploadDir, filename), buffer)
    coverImage = `/uploads/articles/${filename}`
  }

  await prisma.article.create({
    data: {
      title,
      slug,
      content,
      coverImage,
      categoryId,
      publishedAt: new Date(),
    },
  })

  revalidatePath('/admin/articles')
  revalidatePath('/articles')
}

async function deleteArticle(id: string) {
  'use server'
  await prisma.article.delete({ where: { id } })
  revalidatePath('/admin/articles')
}

async function editArticle(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const content = formData.get('content') as string

  await prisma.article.update({
    where: { id },
    data: { title, content },
  })

  revalidatePath('/admin/articles')
}

export default async function AdminArticles({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const { edit } = await searchParams
  const editId = edit || null

  const [articles, categories] = await Promise.all([
    prisma.article.findMany({ include: { category: true }, orderBy: { createdAt: 'desc' } }),
    prisma.category.findMany(),
  ])

    const editingArticle = editId ? articles.find((a: (typeof articles)[number]) => a.id === editId) : null

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Articles</h1>
      </div>

      {/* Create Form */}
      <div className="bg-[#161622] rounded-2xl p-6 mb-8 border border-white/10">
        <h3 className="font-semibold mb-4">เพิ่มบทความใหม่</h3>
        <form action={createArticle} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input name="title" placeholder="ชื่อบทความ" className="bg-[#12121A] border border-white/10 rounded-xl px-4 py-3" required />
            <input name="slug" placeholder="slug" className="bg-[#12121A] border border-white/10 rounded-xl px-4 py-3" required />
          </div>

          <div>
            <label className="text-sm text-[#9CA3AF] mb-1.5 block">Cover Image</label>
            <input type="file" name="coverImage" accept="image/*" className="text-sm" />
          </div>

          <select name="categoryId" className="bg-[#12121A] border border-white/10 rounded-xl px-4 py-3 w-full">
            <option value="">ไม่ระบุหมวดหมู่</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <textarea name="content" placeholder="เนื้อหาบทความ (รองรับ Markdown พื้นฐาน)" rows={8} className="w-full bg-[#12121A] border border-white/10 rounded-xl px-4 py-3" required />

          <button type="submit" className="bg-[#FF5722] hover:bg-[#FF7043] px-8 py-3 rounded-xl font-medium">เผยแพร่บทความ</button>
        </form>
      </div>

      {/* Edit Form for Article */}
      {editingArticle && (
        <div className="bg-[#161622] rounded-2xl p-6 mb-8 border border-[#FF5722]/50">
          <h3 className="font-semibold mb-4">แก้ไขบทความ: {editingArticle.title}</h3>
          <form action={editArticle} className="space-y-4">
            <input type="hidden" name="id" value={editingArticle.id} />
            <input name="title" defaultValue={editingArticle.title} className="w-full bg-[#12121A] border border-white/10 rounded-xl px-4 py-3" required />
            <textarea name="content" defaultValue={editingArticle.content} rows={6} className="w-full bg-[#12121A] border border-white/10 rounded-xl px-4 py-3" required />
            <div className="flex gap-3">
              <button type="submit" className="bg-[#FF5722] hover:bg-[#FF7043] px-8 py-3 rounded-xl font-medium">บันทึก</button>
              <Link href="/admin/articles" className="px-6 py-3 border border-white/20 rounded-xl">ยกเลิก</Link>
            </div>
          </form>
        </div>
      )}

      <div className="bg-[#161622] rounded-2xl overflow-hidden border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-[#12121A]">
            <tr>
              <th className="p-4 text-left">ชื่อเรื่อง</th>
              <th className="p-4">หมวดหมู่</th>
              <th className="p-4">เผยแพร่</th>
              <th className="p-4 w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {articles.map((a) => (
              <tr key={a.id} className="hover:bg-white/5">
                <td className="p-4 font-medium">{a.title}</td>
                <td className="p-4 text-[#9CA3AF]">{a.category?.name || '-'}</td>
                <td className="p-4 text-xs text-[#9CA3AF]">{a.publishedAt?.toLocaleDateString('th-TH')}</td>
                <td className="p-4 flex gap-3 text-sm">
                  <Link href={`/admin/articles?edit=${a.id}`} className="text-blue-400 hover:text-blue-500">แก้ไข</Link>
                  <form action={async () => { 'use server'; await deleteArticle(a.id) }}>
                    <button className="text-red-400 hover:text-red-500 text-sm">ลบ</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
