This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Phase 5: Launch & Content

**อ่านคู่มือ Deploy แบบละเอียดก่อนทุกครั้ง**  
→ [DEPLOY.md](./DEPLOY.md)

รองรับการ Deploy บน **Vercel**, **Hostinger (Managed Node.js หรือ VPS)** และอื่น ๆ

### Deploy to Vercel (Recommended)
1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo.
3. Vercel will auto-detect Next.js.
4. Add Environment Variables if needed (DATABASE_URL, ADMIN_PASSWORD, NEXT_PUBLIC_SITE_URL ฯลฯ).
5. Deploy!

**สำคัญ**:
- ต้องย้ายไปใช้ **PostgreSQL** (Supabase แนะนำ)
- รูปภาพ Local `/public/uploads` ใช้ไม่ได้ใน production → ใช้ External URL หรือ Vercel Blob

ดูรายละเอียดทั้งหมด + ขั้นตอน + Troubleshooting ใน [DEPLOY.md](./DEPLOY.md)

### Add Real Content
- Use Admin panel (login: admin123) to add/edit products and articles.
- Or edit `prisma/seed.ts` and run `npm run seed`.
- Update Shopee affiliate links to real ones.

### Google Analytics + Search Console
- Replace `GA_ID` in `app/layout.tsx` with your GA4 ID.
- Submit sitemap to Google Search Console: `https://yourdomain.com/sitemap.xml`
- Verify domain ownership.

### Custom Auto Index (Optional)
See original site for inspiration on auto-indexing tricks for faster Google crawling.

---

## Getting Started (Dev)

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
