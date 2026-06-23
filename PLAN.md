# แผนการสร้างเว็บไซต์แบบ GiornoParts.com

## เป้าหมายโครงการ
สร้างเว็บไซต์ **Niche Content + Affiliate Shop** สำหรับอะไหล่และของแต่ง Honda Giorno+ (และรุ่นใกล้เคียง) โดยเลียนแบบ https://giornoparts.com/

### จุดเด่นที่ต้องมี
- เน้น **Content Marketing** (บทความรีวิว, คู่มือ, ข่าวรถใหม่)
- **Affiliate Model** หลัก → ลิงก์ไป Shopee เกือบทุกปุ่มซื้อ
- SEO แรงมาก (Lighthouse SEO 100, Accessibility 100)
- โหลดเร็ว, ดีไซน์ทันสมัย (Dark Theme)
- ง่ายต่อการจัดการสินค้าและบทความ
- ราคาถูกในการโฮสต์และดูแล

## Tech Stack ที่แนะนำ (2026)

### แนะนำหลัก: **Next.js 15 (App Router) + TypeScript**
**เหตุผลที่เหมาะที่สุด:**
- SSR / Server Components → เร็วและ SEO ดีเทียบเท่าเว็บเดิม
- Image Optimization ในตัว (คล้าย query param `?w=...&q=...` ของเว็บเดิม)
- DX ดี พัฒนาเร็ว (TypeScript + hot reload)
- Deploy ง่ายบน Vercel (ฟรี tier พอใช้ได้)
- Built-in Sitemap, Metadata, JSON-LD
- Tailwind CSS ทำ Dark Theme สวยง่าย

**Stack เต็ม:**
- **Framework**: Next.js 15
- **Styling**: Tailwind CSS + CSS Variables (เลียนแบบสีเดิม)
- **Database**: PostgreSQL (แนะนำ) หรือ SQLite/Turso สำหรับเริ่มต้น
- **ORM**: Prisma (ง่าย) หรือ Drizzle
- **Auth (Admin)**: Better-Auth หรือ NextAuth
- **Admin Dashboard**: Custom ด้วย shadcn/ui (เบาและสวย)
- **Images**: Next.js Image + Local upload หรือ Cloudinary
- **Content**: บทความเก็บใน DB (หรือ MDX ถ้าต้องการ)
- **Deployment**: Vercel (แนะนำ) หรือ VPS (Coolify / Dokploy)

### ตัวเลือกอื่น
| Stack | ข้อดี | ข้อเสีย | เหมาะเมื่อไหร่ |
|-------|-------|---------|----------------|
| **Next.js 15** (แนะนำ) | เร็ว, SEO ดี, DX ดี | ต้องเรียนรู้ React | ต้องการพัฒนาเร็วและดูแลระยะยาว |
| **Laravel 11** | ใกล้เคียงเว็บเดิม (PHP) | หนักกว่าเล็กน้อย | ชอบ PHP และมีทีม PHP |
| **Astro + API** | เบามาก เร็วสุด | Admin ยุ่งยากกว่า | เน้นเนื้อหาหนัก |
| **Custom PHP** (เหมือนเดิม) | ตรงที่สุด | ยุ่งยากในการพัฒนาและ maintenance | ต้องการจำลองเว็บเดิม 100% |

**คำแนะนำ:** เริ่มด้วย **Next.js 15** จะพัฒนาได้เร็วและสเกลง่ายกว่าในอนาคต

## โครงสร้างเว็บ (Pages & Features)

### หน้าหลัก
1. **Homepage** (`/`)
   - Hero + CTA (ช้อปเลย / ดูสินค้าทั้งหมด)
   - Trust signals (Shopee Guarantee, ส่งฟรี, COD)
   - Categories Grid (12 หมวด)
   - Best Sellers (สินค้าขายดี)
   - Magazine (บทความแนะนำ + Trending)

2. **Shop** (`/shop`)
   - Grid สินค้า
   - Search (q=)
   - Filter ตาม Category
   - Sorting (ขายดี, ราคา, ใหม่)
   - Pagination หรือ Infinite

3. **Product Detail** (`/product/[slug]`)
   - รูปภาพ (หลายรูป)
   - ราคา + ส่วนลด
   - ปุ่ม "ซื้อเลยที่ Shopee" (หลายลิงก์ได้)
   - Specs / รายละเอียด
   - สินค้าแนะนำ

4. **Articles / Magazine** (`/articles`)
   - List บทความ
   - Filter ตามหมวด (รีวิว, วิธีดูแล, ไอเดียแต่ง, ข่าว)
   - Article Detail (`/article/[slug]`)
   - Related products ด้านล่าง

5. **Categories** (`/shop-category/[slug]`)

### ฟีเจอร์สำคัญ
- Mobile Menu + Search Overlay (เหมือนเว็บเดิม)
- Affiliate Disclaimer
- Image optimization แบบ query (หรือใช้ Next Image)
- Structured Data (Product + Article)
- Sitemap.xml + robots.txt
- Google Analytics / Tag Manager

## Database Schema (Prisma)

```prisma
model Category {
  id        String    @id @default(cuid())
  name      String
  slug      String    @unique
  products  Product[]
  articles  Article[]
}

model Product {
  id            String    @id @default(cuid())
  name          String
  slug          String    @unique
  price         Int
  discountPrice Int?
  shopeeUrl     String
  images        String[]  // JSON array หรือแยกตาราง
  description   String?
  specs         Json?
  categoryId    String
  category      Category  @relation(fields: [categoryId], references: [id])
  isPopular     Boolean   @default(false)
  stock         Int       @default(0)
  createdAt     DateTime  @default(now())
}

model Article {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  content     String    // Markdown หรือ HTML
  coverImage  String?
  categoryId  String?
  category    Category? @relation(fields: [categoryId], references: [id])
  publishedAt DateTime?
  views       Int       @default(0)
  createdAt   DateTime  @default(now())
}

model AdminUser {
  id       String @id @default(cuid())
  email    String @unique
  password String
}
```

## โครงสร้างโฟลเดอร์ (Next.js)

```
giorno-parts-clone/
├── app/
│   ├── (public)/
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # Homepage
│   │   ├── shop/
│   │   ├── product/[slug]/
│   │   ├── articles/
│   │   └── shop-category/[slug]/
│   ├── admin/
│   │   └── (protected)
│   ├── api/
│   └── globals.css
├── components/
│   ├── ui/ (shadcn)
│   ├── ProductCard.tsx
│   ├── ArticleCard.tsx
│   └── ...
├── lib/
│   ├── prisma.ts
│   └── utils.ts
├── prisma/
│   └── schema.prisma
├── public/
│   └── uploads/
├── scripts/ (seed data)
└── PLAN.md
```

## Roadmap การพัฒนา (แนะนำ 6-8 สัปดาห์)

### Phase 1: Foundation (1 สัปดาห์)
- Setup Next.js + Tailwind + Prisma + DB
- Dark theme + basic layout (Header, Footer, Mobile menu)
- Database + seed ข้อมูลตัวอย่าง

### Phase 2: Core Content (2 สัปดาห์)
- Homepage (Hero, Categories, Best Sellers, Magazine)
- Shop page + Search + Category filter
- Product Detail + Shopee buttons
- Article list + Detail

### Phase 3: Admin (1.5 สัปดาห์)
- Login Admin (simple)
- CRUD Products (เพิ่ม/แก้/ลบ + upload รูป)
- CRUD Articles (Markdown editor)
- CRUD Categories

### Phase 4: Polish & SEO (1 สัปดาห์)
- Image optimization
- Sitemap + robots + metadata
- Structured Data (Product, Article)
- Performance tuning
- Affiliate disclaimer + legal

### Phase 5: Launch & Content (ต่อเนื่อง)
- Deploy
- ใส่เนื้อหาจริง (คัดลอก/เขียนใหม่)
- ตั้งค่า Google Search Console + Analytics
- Custom "Auto Index" trick (ถ้าต้องการ)

## SEO Strategy (สำคัญมาก)

- URL structure สวย: `/product/ชื่อสินค้า`, `/article/ชื่อบทความ`
- Server-side rendering ทุกหน้า
- Preload hero image
- Alt text ทุกภาพ
- Internal linking ดี (บทความ → สินค้า)
- Sitemap อัตโนมัติ
- Schema.org (Product + Article)
- Fast loading (< 3 วินาที)

## Affiliate & Monetization

- ทุกปุ่มซื้อ = ลิงก์ Shopee (เก็บในฐานข้อมูล)
- ใส่ UTM ถ้าต้องการ track
- Affiliate Disclaimer ชัดเจน
- ในอนาคต: สามารถเพิ่มโปรแกรมอื่น (Lazada, TikTok Shop)

## Hosting & Cost (ประมาณ)

- **Vercel** (แนะนำ): ฟรีสำหรับ starter (หรือ ~$20/เดือน)
- **Database**: Supabase หรือ Railway (~$5-15/เดือน)
- **Domain**: ~400-800 บาท/ปี
- **รวมแรกเริ่ม**: ต่ำกว่า 1,000 บาท/เดือน

## ความเสี่ยง & ข้อควรระวัง

- Shopee เปลี่ยน policy affiliate (มี cookie window สั้น)
- เนื้อหาต้อง unique (ห้าม copy ตรง ๆ)
- ภาพสินค้าควรมีสิทธิ์ใช้งาน
- ควรมี backup ฐานข้อมูล

## Next Steps (สิ่งที่ควรทำต่อ)

1. ตัดสินใจ Tech Stack (Next.js หรือ Laravel)
2. จอง Domain (เช่น giornoparts-clone.com หรือชื่ออื่น)
3. สร้างโปรเจกต์ (ฉันช่วย scaffold ให้ได้)
4. เตรียมข้อมูลสินค้า 50-100 รายการ + 10-20 บทความ
5. เริ่ม Phase 1

---

**คุณต้องการให้ฉันทำอะไรต่อ?**

A. ใช้ **Next.js 15** ช่วยสร้างโครงสร้างโปรเจกต์ + ไฟล์พื้นฐานทันที
B. ใช้ **Laravel** แทน
C. ใช้ Custom PHP เบา ๆ (เหมือนเว็บเดิม)
D. ปรับแผนเพิ่ม/ลดฟีเจอร์ก่อน
E. เริ่มด้วย Database schema + seed data ก่อน

บอกมาเลยครับ ผมจะลงมือทำให้ทันที!