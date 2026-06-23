import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-project.vercel.app' // Change via env for production

  const staticPages = [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/shop`, lastModified: new Date() },
    { url: `${baseUrl}/articles`, lastModified: new Date() },
  ]

  // Dynamic products
  const products = await prisma.product.findMany({
    select: { slug: true, updatedAt: true },
  })

  const productPages = products.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: product.updatedAt,
  }))

  // Dynamic articles
  const articles = await prisma.article.findMany({
    select: { slug: true, updatedAt: true },
  })

  const articlePages = articles.map((article) => ({
    url: `${baseUrl}/article/${article.slug}`,
    lastModified: article.updatedAt,
  }))

  // Categories
  const categories = await prisma.category.findMany({
    select: { slug: true },
  })

  const categoryPages = categories.map((cat) => ({
    url: `${baseUrl}/shop-category/${cat.slug}`,
    lastModified: new Date(),
  }))

  return [...staticPages, ...productPages, ...articlePages, ...categoryPages]
}
