import Database from 'better-sqlite3'

// Open the SQLite database (created by Prisma migration at project root)
const db = new Database('dev.db')

console.log('🌱 Starting direct seed with better-sqlite3...')

// Clear data (for re-runs)
db.exec(`
  DELETE FROM Article;
  DELETE FROM Product;
  DELETE FROM Category;
`)

const insertCategory = db.prepare('INSERT INTO Category (id, name, slug, createdAt) VALUES (?, ?, ?, ?)')
const insertProduct = db.prepare(`
  INSERT INTO Product (id, name, slug, price, discountPrice, shopeeUrl, images, description, specs, categoryId, isPopular, views, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`)
const insertArticle = db.prepare(`
  INSERT INTO Article (id, title, slug, content, coverImage, categoryId, publishedAt, views, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`)

const now = new Date().toISOString()

// Categories
const categories = [
  { id: 'cat1', name: 'ของแต่ง H2C Giorno', slug: 'ของแต่ง-h2c-giorno' },
  { id: 'cat2', name: 'อุปกรณ์เสริม', slug: 'อุปกรณ์เสริม' },
  { id: 'cat3', name: 'เครื่องยนต์และระบบส่งกำลัง', slug: 'เครื่องยนต์และระบบส่งกำลัง' },
  { id: 'cat4', name: 'ช่วงล่างและโช้คอัพ', slug: 'ช่วงล่างและโช้คอัพ' },
  { id: 'cat5', name: 'ระบบเบรกและจานดิสก์', slug: 'ระบบเบรกและจานดิสก์' },
  { id: 'cat6', name: 'ชุดล้อและยาง', slug: 'ชุดล้อและยาง' },
  { id: 'cat7', name: 'ระบบท่อไอเสีย', slug: 'ระบบท่อไอเสีย' },
  { id: 'cat8', name: 'งานคาร์บอนและชุดสี', slug: 'งานคาร์บอนและชุดสี' },
  { id: 'cat9', name: 'เบาะแต่งและแผ่นวางเท้า', slug: 'เบาะแต่งและแผ่นวางเท้า' },
  { id: 'cat10', name: 'อุปกรณ์เสริมและตะแกรง', slug: 'อุปกรณ์เสริมและตะแกรง' },
  { id: 'cat11', name: 'ระบบไฟและไฟส่องสว่าง', slug: 'ระบบไฟและไฟส่องสว่าง' },
  { id: 'cat12', name: 'น้ำมันเครื่องและบำรุงรักษา', slug: 'น้ำมันเครื่องและบำรุงรักษา' },
]

categories.forEach(cat => {
  insertCategory.run(cat.id, cat.name, cat.slug, now)
})
console.log(`✅ Created ${categories.length} categories`)

// Products
const products = [
  {
    id: 'prod1',
    name: 'ฝาครอบสวิทกุญแจ CNC ทูโทน REVOLUTION GIORNO+',
    slug: 'revolution-giorno-cnc-key-cover-two-tone',
    price: 571,
    discountPrice: 280,
    shopeeUrl: 'https://s.shopee.co.th/6fbnbCGkSX',
    images: JSON.stringify(['https://picsum.photos/400/300?random=11']),
    description: 'ฝาครอบสวิทกุญแจ CNC คุณภาพสูง ทูโทน สำหรับ Honda Giorno+ และรุ่นอื่นๆ',
    specs: JSON.stringify({ material: 'Aluminum CNC', color: 'ทูโทน', compatible: 'Giorno+, Lead, PCX' }),
    categoryId: 'cat1',
    isPopular: 1,
  },
  {
    id: 'prod2',
    name: 'ชุดสี Honda Giorno ปี 2025 สีครีม-เหลืองอ่อน แท้เบิกศูนย์',
    slug: 'honda-giorno-2025-genuine-parts',
    price: 1376,
    discountPrice: 289,
    shopeeUrl: 'https://s.shopee.co.th/1BGWRHouXS',
    images: JSON.stringify(['https://picsum.photos/400/300?random=12']),
    description: 'ชุดสีแท้เบิกศูนย์ Honda Giorno 2025 สีครีม-เหลืองอ่อน แยกชิ้นได้',
    specs: JSON.stringify({ type: 'Genuine', year: '2025', color: 'ครีม-เหลืองอ่อน' }),
    categoryId: 'cat8',
    isPopular: 1,
  },
  {
    id: 'prod3',
    name: 'โช้คหลัง RCB Tarmax สำหรับ Honda Giorno/Lead',
    slug: 'rcb-tarmax-shock-honda-giorno',
    price: 6670,
    discountPrice: 4000,
    shopeeUrl: 'https://s.shopee.co.th/8AQEINDAG5',
    images: JSON.stringify(['https://picsum.photos/400/300?random=13']),
    description: 'โช้คหลัง Racing Boy Tarmax ปรับ 2 จุด สำหรับ Giorno และ Lead',
    specs: JSON.stringify({ brand: 'RCB', adjust: '2 จุด', type: 'Tarmax' }),
    categoryId: 'cat4',
    isPopular: 1,
  },
  {
    id: 'prod4',
    name: 'ยางครอบพื้น Honda Giorno+ H2C (สีดำ)',
    slug: 'honda-giorno-plus-floor-mat-black-h2c',
    price: 1522,
    discountPrice: 350,
    shopeeUrl: 'https://s.shopee.co.th/1VtAGc0kbD',
    images: JSON.stringify(['https://picsum.photos/400/300?random=14']),
    description: 'ยางครอบพื้น H2C แท้เบิกศูนย์ สำหรับ Giorno+ สีดำ',
    specs: JSON.stringify({ material: 'Rubber', color: 'ดำ', model: 'H2C' }),
    categoryId: 'cat9',
    isPopular: 0,
  },
  {
    id: 'prod5',
    name: 'โช้คหน้า Racing Boy สำหรับ Giorno+',
    slug: 'rcb-front-shock-giorno-plus',
    price: 4500,
    discountPrice: 3200,
    shopeeUrl: 'https://s.shopee.co.th/example5',
    images: JSON.stringify(['https://picsum.photos/400/300?random=15']),
    description: 'โช้คหน้า Racing Boy ปรับความสูงได้ สำหรับ Honda Giorno+',
    specs: JSON.stringify({ brand: 'Racing Boy', type: 'Adjustable' }),
    categoryId: 'cat4',
    isPopular: 1,
  },
  {
    id: 'prod6',
    name: 'ท่อไอเสียแต่ง Giorno+ Full System',
    slug: 'exhaust-giorno-full-system',
    price: 8500,
    discountPrice: 6500,
    shopeeUrl: 'https://s.shopee.co.th/example6',
    images: JSON.stringify(['https://picsum.photos/400/300?random=16']),
    description: 'ท่อไอเสียแต่ง Full System เสียงดี แรงขึ้น',
    specs: JSON.stringify({ material: 'Stainless Steel', sound: 'Sport' }),
    categoryId: 'cat7',
    isPopular: 1,
  },
]

const prodNow = now
products.forEach(p => {
  insertProduct.run(
    p.id, p.name, p.slug, p.price, p.discountPrice, p.shopeeUrl, p.images, p.description, p.specs,
    p.categoryId, p.isPopular, 45, prodNow, prodNow
  )
})
console.log(`✅ Created ${products.length} products`)

// Articles
const articles = [
  {
    id: 'art1',
    title: 'เจาะลึกเรื่องท่อ GIORNO+ 125: เลือกยังไงให้แรง เสียงเพราะ ไม่โดนโบก!',
    slug: 'giorno-honda-giorno-plus-125',
    content: `# เจาะลึกเรื่องท่อ GIORNO+ 125\n\nหัวหน้าช่าง GiornoParts มาแจกความรู้เรื่องท่อไอเสีย...\n\n**จุดเด่นของท่อแต่งที่ดีสำหรับ Giorno**\n- เสียงไม่ดังเกินไป\n- แรงเพิ่มขึ้นจริง\n- ไม่ทำให้เครื่องร้อนเกิน\n\nตัวเลือกยอดนิยมในตลาด...`,
    coverImage: 'https://picsum.photos/600/400?random=21',
    categoryId: 'cat1',
    publishedAt: '2026-06-06T00:00:00.000Z',
  },
  {
    id: 'art2',
    title: 'เปลี่ยน Giorno ให้ดุดัน! สัมผัสความสปอร์ตด้วยเบาะแต่งดีไซน์เฉียบ',
    slug: 'giorno-sport-seat',
    content: `# เปลี่ยน Giorno ให้ดุดัน!\n\nเบาะแต่งทรงสปอร์ตช่วยให้ขี่สนุกและดูเท่ขึ้น...`,
    coverImage: 'https://picsum.photos/600/400?random=22',
    categoryId: 'cat9',
    publishedAt: '2026-04-29T00:00:00.000Z',
  },
  {
    id: 'art3',
    title: 'วิธีเลือกยาง Giorno+ ให้คุ้มและปลอดภัย',
    slug: 'how-to-choose-giorno-tires',
    content: `# วิธีเลือกยาง Giorno+\n\nเลือกยางที่เหมาะกับการใช้งานในเมือง...`,
    coverImage: 'https://picsum.photos/600/400?random=23',
    categoryId: 'cat6',
    publishedAt: '2026-05-15T00:00:00.000Z',
  },
]

articles.forEach(a => {
  insertArticle.run(
    a.id, a.title, a.slug, a.content, a.coverImage, a.categoryId, a.publishedAt, 120, now, now
  )
})
console.log(`✅ Created ${articles.length} articles`)

console.log('🎉 Seed completed successfully with direct SQLite inserts!')
db.close()