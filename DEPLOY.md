# คู่มือ Deploy Giorno Parts Clone แบบละเอียด (อัพเดท 2026)

โครงการนี้เป็น **Next.js 16 + React 19 + Prisma** clone ของเว็บ [giornoparts.com](https://giornoparts.com/)  
เน้น Niche Content + Affiliate (ลิงก์ Shopee) + Dark Theme + Admin CRUD

---

## สรุปสั้น ๆ ก่อนเริ่ม

| ส่วนประกอบ       | สถานะปัจจุบัน (Dev)                  | ต้องแก้เมื่อ Deploy                  |
|-------------------|-------------------------------------|-------------------------------------|
| Database          | SQLite (dev.db + better-sqlite3)    | เปลี่ยนเป็น **PostgreSQL**           |
| รูปภาพ           | Local `/public/uploads` + picsum    | ใช้ External URL หรือ Vercel Blob   |
| Auth Admin        | ADMIN_PASSWORD + cookie token       | เปลี่ยนเป็นรหัสแข็งแรง + env        |
| Base URL          | Hardcode บางที่ (sitemap)           | ใช้ NEXT_PUBLIC_SITE_URL            |
| Hosting           | -                                   | **Vercel** (แนะนำที่สุด)            |

**สำคัญ**: Vercel (และ serverless อื่น ๆ) **ไม่รองรับ** การเขียนไฟล์ลง local filesystem แบบถาวร

---

## 1. เตรียมเครื่องและทดสอบก่อน Deploy (สำคัญ!)

### 1.1 ทดสอบ Build ในเครื่องก่อนทุกครั้ง

```powershell
cd C:\Users\tawat\grokwork\giorno-parts-clone

# 1. ติดตั้ง dependencies (ถ้ายังไม่เคย)
npm install

# 2. Generate Prisma Client
npx prisma generate

# 3. Seed ข้อมูลตัวอย่าง (ใช้ picsum อยู่แล้ว)
npm run seed

# 4. ทดสอบ Build Production
npm run build
```

ถ้า `npm run build` ผ่านไม่มี error แสดงว่าโค้ดพร้อม deploy

ถ้ามี error ให้แก้ให้ผ่านก่อน

### 1.2 สร้างไฟล์ .env (จากตัวอย่าง)

```powershell
# คัดลอก
copy .env.example .env
```

แก้ไข `.env` (สำคัญ!):

```env
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD=เปลี่ยนรหัสนี้ให้แข็งแรงก่อนdeploy
ADMIN_TOKEN=dev-admin-token-2026
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**ห้าม commit** `.env` และ `dev.db`

---

## 2. การเตรียมโค้ดสำหรับ Production

### 2.1 ฐานข้อมูล (Prisma)

ไฟล์ที่เกี่ยวข้อง:

- `prisma/schema.prisma`
- `lib/prisma.ts`
- `prisma.config.ts`

**ขั้นตอนเปลี่ยนเป็น PostgreSQL** (ทำก่อน push):

1. เปิด `prisma/schema.prisma` เปลี่ยนเป็น:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. `lib/prisma.ts` โค้ดปัจจุบันรองรับทั้งสองแบบแล้ว (ตรวจสอบได้)

3. ลบ migration เก่า (ถ้าต้องการเริ่มใหม่กับ Postgres) หรือสร้าง migration ใหม่:

```bash
npx prisma generate
npx prisma migrate dev --name init-postgres
```

> **หมายเหตุ**: seed ปัจจุบันใช้ `better-sqlite3` โดยตรง ถ้าใช้ Postgres จะต้องรัน seed ผ่าน Prisma Client แทน (ดูหัวข้อ 5)

### 2.2 รูปภาพ (Image Handling)

**วิธีที่แนะนำสำหรับเริ่มต้น** (เร็วและเสถียรที่สุด):

- ใช้ **External URL** (เช่น picsum.photos, Cloudinary, หรือรูปจริงจาก Shopee)
- โค้ด `ProductCard.tsx` และ `app/product/[slug]/page.tsx` มี fallback เป็น picsum อยู่แล้ว

**วิธีอัพโหลดไฟล์จริง (แนะนำเมื่อมีงบ)**:

- **Vercel Blob** (ง่ายสุดถ้าใช้ Vercel)
- **Supabase Storage**
- **Cloudinary**

ดูตัวอย่างโค้ด Vercel Blob ในส่วนที่ 4.2

### 2.3 อัพเดทค่า Base URL และ Metadata

- `app/sitemap.ts` ใช้ `NEXT_PUBLIC_SITE_URL` แล้ว (ตั้งใน env)
- `app/layout.tsx` ใช้ OG จาก picsum (เปลี่ยนได้)

แก้ไขก่อน deploy:

```ts
// app/sitemap.ts
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-project.vercel.app'
```

### 2.4 ไฟล์ที่ควรตรวจสอบก่อน Deploy

- [ ] `ADMIN_PASSWORD` เปลี่ยนใน env
- [ ] `NEXT_PUBLIC_SITE_URL` ใส่ URL จริง
- [ ] `shopeeUrl` ใน seed หรือ admin ใช้ลิงก์จริง
- [ ] รูปภาพใน seed เป็น URL ที่ใช้งานได้

---

## 3. วิธี Deploy บน Vercel (แนะนำที่สุด)

### ขั้นตอนแบบละเอียด

#### ขั้นตอนที่ 1: Push โค้ดขึ้น GitHub

```powershell
git init
git add .
git commit -m "chore: prepare for production deploy"
git remote add origin https://github.com/yourname/giorno-parts-clone.git
git branch -M main
git push -u origin main
```

#### ขั้นตอนที่ 2: สร้างโปรเจกต์บน Vercel

1. ไปที่ https://vercel.com
2. Login ด้วย GitHub
3. กด **Add New Project** → Import Git Repository
4. เลือก repository `giorno-parts-clone`
5. Vercel จะ detect เป็น **Next.js** อัตโนมัติ

#### ขั้นตอนที่ 3: ตั้งค่า Environment Variables (สำคัญที่สุด!)

ในหน้าตั้งค่าโปรเจกต์ กด **Environment Variables** แล้วเพิ่ม:

| Name                    | Value                                      | Environment          |
|-------------------------|--------------------------------------------|----------------------|
| `DATABASE_URL`          | `postgresql://...` (จาก Supabase/Neon)    | Production + Preview |
| `ADMIN_PASSWORD`        | `รหัสแข็งแรงมาก`                          | Production + Preview |
| `ADMIN_TOKEN`           | `tokenยาวสุ่ม`                             | Production + Preview |
| `NEXT_PUBLIC_SITE_URL`  | `https://your-project.vercel.app`          | Production + Preview |

(เพิ่ม `BLOB_READ_WRITE_TOKEN` ภายหลังถ้าใช้ Vercel Blob)

#### ขั้นตอนที่ 4: Deploy

กด **Deploy** รอ 1-3 นาที

เมื่อเสร็จจะได้ URL เช่น:
`https://giorno-parts-clone-xxx.vercel.app`

#### ขั้นตอนที่ 5: ทดสอบทันที

- เปิดเว็บ
- ไปที่ `/shop` `/articles`
- ลอง `/admin/login` → ใช้รหัสที่ตั้งไว้
- ตรวจสอบ Console ไม่มี Error

---

## 4. การจัดการรูปภาพใน Production (ละเอียด)

### 4.1 วิธีง่ายสุด: ใช้ External URL (แนะนำเริ่มต้น)

ในหน้า Admin:
- ใส่ URL รูปภาพจากภายนอกโดยตรง (เช่น `https://picsum.photos/id/1015/800/600`)
- หรือแก้ไข `prisma/seed.ts` แล้วรัน `npm run seed` (หลังตั้ง DATABASE_URL เป็น pg)

**ข้อดี**: เร็ว ไม่ต้องจัดการ storage

### 4.2 วิธีใช้ Vercel Blob (แนะนำสำหรับ production)

1. ติดตั้งแพ็กเกจ

```bash
npm install @vercel/blob
```

2. ไปที่ Vercel Dashboard → Project → **Storage** → Create Blob Store
3. คัดลอก `BLOB_READ_WRITE_TOKEN` ใส่ใน Environment Variables

3. แก้ไขโค้ด upload ใน `app/admin/products/page.tsx` (ตัวอย่าง):

```ts
import { put } from '@vercel/blob'

async function createProduct(formData: FormData) {
  'use server'

  // ... ดึงค่าอื่นเหมือนเดิม

  const files = formData.getAll('images') as File[]
  const imagePaths: string[] = []

  for (const file of files) {
    if (file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const { url } = await put(
        `products/${Date.now()}-${file.name}`,
        buffer,
        { access: 'public' }
      )
      imagePaths.push(url)
    }
  }

  // บันทึก imagePaths ลง DB
}
```

ทำแบบเดียวกันกับ `app/admin/articles/page.tsx`

### 4.3 ใช้ Supabase Storage (ถ้าใช้ Supabase เป็น DB)

Supabase ให้ Storage ฟรี 1GB

### 4.4 แนวทางผสม (Hybrid)

- ใช้ seed ด้วย URL ภายนอก
- Admin อนุญาตให้ใส่ URL ด้วยมือก่อน
- ค่อยเพิ่ม Blob integration ทีหลัง

---

## 5. Seed ข้อมูลสำหรับ PostgreSQL

Seed ปัจจุบัน (`prisma/seed.ts`) ใช้ `better-sqlite3` โดยตรง

**วิธี seed สำหรับ Postgres:**

สร้างไฟล์ใหม่ `prisma/seed-postgres.ts` (แนะนำ) หรือแก้ไขชั่วคราว:

```ts
// ตัวอย่างคร่าว ๆ
import { prisma } from '../lib/prisma'

async function main() {
  // ลบข้อมูลเก่า
  await prisma.article.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  // สร้าง categories + products + articles เหมือนเดิม
  // แต่ใช้ prisma.create แทนการ insert ตรง
}

main()
```

แล้วเพิ่มใน `package.json`:

```json
"seed:pg": "tsx prisma/seed-postgres.ts"
```

หรือใช้ Prisma Studio เพื่อเพิ่มข้อมูลด้วยมือหลัง deploy ก็ได้

---

## 6. ตั้งค่า Domain ชื่อเอง + SSL

1. ใน Vercel Project → **Domains**
2. ใส่โดเมน (เช่น `parts.yourdomain.com` หรือ `giorno-clone.com`)
3. เพิ่ม Record ที่ DNS Provider:
   - **Type**: CNAME
   - **Name**: `parts` (หรือ @ ถ้า root domain)
   - **Value**: `cname.vercel-dns.com`
4. รอ SSL ออกอัตโนมัติ (ปกติ 1-5 นาที)

Vercel จัดการ HTTPS ให้ฟรี

---

## 7. Post-Deploy Checklist (ทำทุกครั้ง)

- [ ] เปลี่ยน `ADMIN_PASSWORD` เป็นรหัสที่แข็งแรง (อย่างน้อย 12 ตัว)
- [ ] ตั้ง `NEXT_PUBLIC_SITE_URL` เป็นโดเมนจริง
- [ ] ทดสอบหน้า: Home, Shop, Product, Articles, Admin
- [ ] ทดสอบ Mobile (responsive)
- [ ] ทดสอบฟอร์ม Admin + อัพโหลดรูป (หรือใส่ URL)
- [ ] ตรวจสอบ `/sitemap.xml` ขึ้นจริง
- [ ] เปลี่ยน baseUrl ใน sitemap (ถ้ายังไม่ใช้ env)
- [ ] ใส่ **Google Analytics 4**
- [ ] เพิ่มเว็บใน **Google Search Console**
- [ ] Submit sitemap ใน GSC
- [ ] ตรวจสอบว่า Shopee link ใช้ได้จริง
- [ ] ลบข้อมูลทดสอบที่ไม่ต้องการ (ถ้ามี)

---

## 8. การตั้งค่า Google Analytics + Search Console

### Google Analytics 4

1. สร้าง Property ใน GA4
2. คัดลอก Measurement ID (เช่น `G-ABC123XYZ`)
3. เพิ่มใน Environment Variables (หรือแก้ใน `app/layout.tsx` ชั่วคราว)

```tsx
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'
```

หรือวาง script ตรงใน layout (เวอร์ชันปัจจุบันมี placeholder อยู่แล้ว)

### Google Search Console

1. ไปที่ https://search.google.com/search-console
2. Add Property → URL prefix หรือ Domain
3. Verify ด้วย HTML tag หรือ DNS (Vercel สามารถเพิ่ม record ได้)
4. ไปที่ **Sitemaps** → Submit `/sitemap.xml`

---

## 9. Troubleshooting ปัญหาที่พบบ่อย

| ปัญหา                              | สาเหตุ                                      | วิธีแก้                                                                 |
|------------------------------------|---------------------------------------------|-------------------------------------------------------------------------|
| 500 Error หลัง deploy              | ลืมตั้ง DATABASE_URL หรือ ADMIN_PASSWORD   | ตรวจ Environment Variables ใน Vercel                                   |
| ไม่สามารถ login Admin              | รหัสผ่านผิด หรือ cookie ไม่ถูก set           | ตรวจ ADMIN_PASSWORD + ลอง clear cookie                                 |
| รูปภาพหายหรือ 404                 | ใช้ path `/uploads/...`                      | เปลี่ยนเป็น external URL หรือตั้ง Blob                                  |
| Database connection failed         | DATABASE_URL ผิด / SSL mode ไม่ถูกต้อง     | ใส่ `?sslmode=require` และใช้ Connection String ที่ถูกต้อง             |
| Build ล้มเหลว (Prisma)             | ยังไม่ได้ `prisma generate` หรือ provider ผิด | รัน `npx prisma generate` ก่อน push                                     |
| Seed ล้มเหลวใน production         | ใช้ seed แบบ sqlite โดยตรง                   | สร้าง seed ใหม่ด้วย Prisma Client                                       |
| Sitemap ยังเป็น giornoparts.com    | ยังไม่ได้ตั้ง NEXT_PUBLIC_SITE_URL          | เพิ่ม env var แล้ว redeploy                                             |
| Cold start ช้า                     | Free tier                                   | ยอมรับได้ หรืออัพเกรด plan                                             |
| เปลี่ยนโค้ดแล้วไม่เห็นผล           | Deploy ไม่รี                     | กด Redeploy หรือ push commit ใหม่                                       |

**คำสั่งช่วยเหลือ**

```bash
# ดู log บนเครื่อง
npm run build

# ดู error Prisma
npx prisma studio   # ใช้ได้เฉพาะ local

# หลังเปลี่ยน schema
npx prisma generate
npx prisma migrate deploy   # สำหรับ production
```

---

## 10. คำแนะนำความปลอดภัย

- อย่า commit `.env`, `dev.db`, `*.db`
- เปลี่ยน `ADMIN_PASSWORD` เป็นรหัสสุ่มยาว
- ใช้ `httpOnly + secure` cookie (โค้ดปัจจุบันตั้งไว้แล้ว)
- ในอนาคตแนะนำเปลี่ยนไปใช้ Better-Auth / NextAuth + database user
- สำรองข้อมูลเป็นประจำ (โดยเฉพาะเมื่อใช้ Supabase / Neon)
- ใช้ UTM parameter กับ Shopee link เพื่อติดตามผล

---

## 11. ทางเลือกอื่นในการ Deploy

| แพลตฟอร์ม                  | ข้อดี                                           | ข้อเสีย                                   | ค่าใช้จ่ายเริ่มต้น     |
|----------------------------|------------------------------------------------|-------------------------------------------|-------------------------|
| **Vercel**                 | เร็วที่สุด, ฟรี generous, Next.js ดีที่สุด    | Storage ต้องใช้ Blob                      | ฟรี                     |
| **Hostinger Managed (Node.js)** | UI ง่าย, GitHub auto-deploy, Supabase Wizard  | ควบคุมน้อยกว่า VPS                       | ฿249+/ด                 |
| **Hostinger VPS**          | ราคาถูก ควบคุมเต็ม, ยืดหยุ่น                   | ต้องตั้ง Nginx + PM2 เอง                 | ฿300-800+/ด             |
| **Railway**                | มี Postgres + App เดียวกัน                      | แพงขึ้นเมื่อ scale                       | ~$5-20/ด                |
| **Render**                 | ฟรี, ง่าย                                      | Cold start บ่อย                          | ฟรี                     |
| **Supabase + Vercel**      | Database + Storage ฟรี + Edge Functions        | ซับซ้อนกว่าเล็กน้อย                      | ฟรี                     |

**แนะนำสำหรับคนไทย:**
- อยากง่าย → **Hostinger Managed** หรือ **Vercel**
- อยากประหยัดระยะยาว → **Hostinger VPS + Supabase**

---

## 12. ขั้นตอนสรุปเร็ว (Cheat Sheet)

```powershell
# 1. เตรียม
npm run build

# 2. เปลี่ยน schema เป็น postgresql
# แก้ prisma/schema.prisma

# 3. ตั้ง .env ด้วยค่าจริง (DATABASE_URL + ADMIN_*)

# 4. Push Git
git add . && git commit -m "deploy ready" && git push

# 5. Deploy บน Vercel + ใส่ env vars

# 6. Seed หลัง deploy (หรือใช้ Admin)
# npx prisma migrate deploy
# npm run seed   # ถ้า seed รองรับ pg แล้ว

# 7. ไปที่ Admin ใส่ข้อมูลจริง
```

---

**ยินดีด้วย!**  
ตอนนี้คุณมีเว็บ Giorno Parts Clone ที่ deploy จริงแล้ว

หากต้องการให้ช่วย:
- เขียนโค้ด integration Vercel Blob แบบเต็ม
- สร้าง seed สำหรับ Postgres
- เพิ่ม Cloudinary
- ตั้งค่า Analytics + GSC ให้

บอกได้เลยครับ!

---

*เอกสารนี้เขียนแบบละเอียดตามโค้ดจริงของโครงการ ณ เดือนมิถุนายน 2026*

---

# 13. Deploy บน Hostinger (Hostiger) — แบบละเอียด 2026

Hostinger (ที่คนไทยเรียก “โฮสติเกอร์”) มีการพัฒนาดีขึ้นมากในปี 2026 โดยเฉพาะส่วน **Node.js Web Apps** และ **Next.js Hosting** ที่รองรับ SSR + Server Actions แบบเต็มรูปแบบ

## 13.1 ตัวเลือกบน Hostinger (สำคัญมาก)

| ตัวเลือก                        | แผนที่รองรับ                          | ความง่าย          | ควบคุม | ราคาประมาณ          | แนะนำสำหรับโครงการนี้          |
|--------------------------------|---------------------------------------|-------------------|--------|-----------------------|--------------------------------|
| **Managed Node.js / Next.js** | Business, Cloud Startup+             | ง่ายที่สุด        | น้อย   | ฿249–฿1,599/ด       | **แนะนำ**                      |
| **VPS (KVM)**                  | VPS Plan (Ubuntu)                    | ปานกลาง           | เต็ม   | ฿300–800+/ด          | อยากควบคุมเต็ม + ราคาถูกระยะยาว |
| Shared Hosting (PHP)           | ทุกแผนถูก ๆ                          | ง่าย               | น้อย   | ถูก                    | **ไม่แนะนำ** (ใช้ไม่ได้ดี)     |

**สรุปสั้น ๆ:**
- **ใช้ Managed Node.js** ถ้าอยากเร็วและไม่ยุ่งยาก
- **ใช้ VPS** ถ้าอยากประหยัดและควบคุมเองได้
- **ห้าม** ใช้ Shared Hosting ธรรมดา — Next.js ของเราเป็น Dynamic + มี Prisma + Admin

---

## 13.2 การเตรียมโปรเจกต์ (เหมือนทุกที่)

1. เปลี่ยนเป็น PostgreSQL (ตามหัวข้อ 2 ในเอกสารนี้)
2. ใช้ `DATABASE_URL` เป็น connection string จาก **Supabase** หรือ Neon
3. รูปภาพ → ใช้ External URL (picsum หรือจริง) หรือ Cloudinary
4. `next.config.ts` ฉันเพิ่ม `output: 'standalone'` ให้แล้ว (ดีสำหรับ VPS และบาง managed host)
5. เปลี่ยน `ADMIN_PASSWORD` ให้แข็งแรง
6. ตั้ง `NEXT_PUBLIC_SITE_URL` เป็นโดเมนจริงของคุณ

**ทดสอบก่อน:**
```bash
npm run build
```

---

## 13.3 วิธี A: Deploy แบบ Managed Node.js (ง่ายสุด)

### ขั้นตอน

1. **ซื้อแผนที่รองรับ**
   - แนะนำ: **Business** หรือ **Cloud Startup**
   - ต้องมี Node.js Web Apps feature

2. **เข้า hPanel → Websites → Add Website**
   - เลือก **Node.js Apps** (หรือ Next.js Hosting)

3. **เลือกวิธี deploy**
   - **Import Git Repository** (แนะนำที่สุด)
     - Connect GitHub
     - เลือก repo
   - หรือ Upload ZIP

4. **ตั้งค่า Build**
   - Hostinger มัก detect Next.js อัตโนมัติ
   - ถ้าเป็น "Other":
     - **Build command**: `npm run build`
     - **Install command**: `npm install`
     - **Node version**: 22.x หรือ 20.x
     - **Output directory**: `.next` (หรือปล่อยว่างให้ระบบจัดการ)

5. **ตั้ง Environment Variables** (สำคัญ)
   ไปที่ **Environment Variables** หรือ **Settings**:
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
   ADMIN_PASSWORD=รหัสแข็งแรงมาก123!
   ADMIN_TOKEN=tokenยาวสุ่ม
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   ```

6. **ใช้ Database Connect Wizard (ดีมาก)**
   - ในหน้า Node.js Dashboard จะมี **Database Connect Wizard**
   - เลือก **Supabase** → Login → เลือก DB
   - มันจะเติม env ให้อัตโนมัติ + redeploy

7. **Deploy / Redeploy**

8. **ตั้ง Domain + SSL**
   - Hostinger จัดการ SSL ให้ฟรี
   - ชี้ A Record หรือใช้ Nameserver ของ Hostinger

---

## 13.4 วิธี B: Deploy บน VPS (ควบคุมเต็ม + ราคาถูก)

### 1. เตรียม VPS
- ซื้อ **VPS KVM** (แนะนำ 2-4 GB RAM ขึ้นไป)
- เลือก **Ubuntu 22.04 หรือ 24.04**
- ตั้ง Domain ชี้ A Record ไปที่ IP ของ VPS

### 2. เชื่อมต่อ SSH

```powershell
ssh root@YOUR_VPS_IP
```

### 3. ติดตั้งพื้นฐาน

```bash
apt update && apt upgrade -y
apt install curl git nginx certbot python3-certbot-nginx -y

# ติดตั้ง Node.js 22 (แนะนำ)
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs

# ติดตั้ง PM2
npm install -g pm2
```

### 4. เตรียมโฟลเดอร์โปรเจกต์

```bash
mkdir -p /var/www/giorno
cd /var/www/giorno
git clone https://github.com/คุณ/ชื่อ-repo.git .
```

### 5. ติดตั้ง Dependencies + Prisma

```bash
npm install
npx prisma generate
npx prisma migrate deploy
```

### 6. สร้าง .env (ในโฟลเดอร์โปรเจกต์)

```env
DATABASE_URL="postgresql://..."
ADMIN_PASSWORD=รหัสแข็งแรง
ADMIN_TOKEN=tokenยาว
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### 7. Build

```bash
npm run build
```

### 8. รันด้วย PM2

```bash
pm2 start npm --name "giorno-parts" -- start
pm2 save
pm2 startup
# ทำตามคำสั่งที่ pm2 แสดง
```

### 9. ตั้ง Nginx Reverse Proxy

สร้างไฟล์ `/etc/nginx/sites-available/giorno`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

เปิดใช้งาน:

```bash
ln -s /etc/nginx/sites-available/giorno /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
```

### 10. ติดตั้ง SSL (Let's Encrypt)

```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 11. อัพเดทโค้ดในอนาคต (Workflow)

```bash
cd /var/www/giorno
git pull
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 restart giorno-parts
```

---

## 13.5 การจัดการรูปภาพบน Hostinger

เหมือนทุกที่:
- ใช้ URL ภายนอก (picsum หรือรูปจริงจาก Cloudinary)
- หรือตั้ง Cloudinary / Supabase Storage
- Local `/uploads` จะหายหลัง redeploy

---

## 13.6 Database บน Hostinger

**แนะนำสูงสุด**: ใช้ **Supabase** ภายนอก
- ใช้ Database Connect Wizard ใน Managed ได้เลย
- ฟรี tier พอใช้
- มี connection pooling ดี

**ทางเลือกอื่น**:
- Neon.tech
- ถ้าใช้ VPS: สามารถติดตั้ง Postgres บน VPS ได้ (แต่ต้อง backup เอง)

---

## 13.7 Post-Deploy บน Hostinger

- ตรวจสอบ Log จาก hPanel (Deployments log)
- สำหรับ Managed: กด **Restart** ได้จาก dashboard
- สำหรับ VPS: ใช้ `pm2 logs giorno-parts` และ `pm2 monit`
- ตั้งค่า Domain ใน hPanel (ถ้าใช้ Managed)

---

## 13.8 Troubleshooting เฉพาะ Hostinger

| ปัญหา                              | สาเหตุ / วิธีแก้                                                                 |
|------------------------------------|----------------------------------------------------------------------------------|
| 403 Forbidden หลัง deploy          | Redeploy ใหม่ (Hostinger จะสร้าง .htaccess ใหม่ให้ routing ไปที่ nodejs folder) |
| Prisma ไม่ connect                 | ใช้ `?sslmode=require` ใน DATABASE_URL + ตรวจสอบ Supabase IP allow list         |
| App ไม่รัน (Managed)               | ดู Deployment Log ใน hPanel + ตรวจสอบ env vars                                  |
| เปลี่ยนโค้ดไม่เห็นผล               | กด Redeploy หรือ push ใหม่                                                       |
| รูปภาพหาย                           | ใช้ external URL เท่านั้น                                                         |
| PM2 (VPS) ไม่รันหลัง reboot       | ตรวจสอบ `pm2 startup` และ `pm2 save`                                            |
| Port conflict                      | ใช้ port 3000 เป็นค่าเริ่มต้น (อย่าเปลี่ยนถ้าไม่จำเป็น)                           |

---

## 13.9 เปรียบเทียบ Hostinger กับ Vercel

| หัวข้อ              | Vercel (ฟรี)               | Hostinger Managed          | Hostinger VPS              |
|---------------------|----------------------------|----------------------------|----------------------------|
| ความง่าย            | ง่ายที่สุด                 | ง่ายมาก                    | ปานกลาง-ยาก                |
| ราคา                | ฟรี (เกินแล้วแพง)         | ฿249+/ด                    | ถูกกว่าเมื่อ scale         |
| ควบคุม              | น้อย                       | ปานกลาง                    | สูงสุด                      |
| Database            | ต้อง external              | Wizard Supabase ดี         | External หรือติดตั้งเอง     |
| รูปภาพ              | ต้อง Blob                  | External หรือ Storage      | อิสระ                       |
| SSL + Domain        | อัตโนมัติ                   | อัตโนมัติ                   | ต้องตั้งเอง (certbot)       |
| เหมาะกับ             | โปรเจกต์เล็ก-กลาง          | คนไทยที่ชอบ UI ง่าย        | อยากประหยัด + ควบคุม       |

---

## 13.10 คำแนะนำสุดท้าย

- **มือใหม่ + อยากเร็ว** → ใช้ **Managed Node.js บน Business/Cloud**
- **อยากประหยัดและคุมเอง** → ใช้ **VPS + Supabase**
- ใช้ Supabase เป็นหลักในทั้งสองกรณี
- อย่าพยายามใช้ Shared Hosting ราคาถูกสุด

หากคุณบอกได้ว่า:
- ใช้แผนไหนของ Hostinger อยู่ (Business / VPS / อื่น ๆ)
- อยากได้ขั้นตอนแบบไหนละเอียดเป็นพิเศษ (Managed หรือ VPS)

ฉันจะเขียนคำสั่งหรือแก้โค้ดเพิ่มให้แบบเป๊ะ ๆ ได้เลยครับ!

---

*ส่วนนี้เพิ่มเติมจากคู่มือเดิมเพื่อรองรับการ Deploy บน Hostinger โดยเฉพาะ*
