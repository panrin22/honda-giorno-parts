import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="site-footer bg-[#12121A] border-t border-[rgba(255,255,255,0.06)] py-12 text-sm text-[#B0B8C8]">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-white font-display text-lg mb-3">GIORNOPARTS</h3>
            <p className="max-w-sm">
              ศูนย์รวมข้อมูล ของแต่ง อะไหล่แต่ง Giorno และไอเทมเด็ดสำหรับ Honda Giorno+ ครบวงจร 
              เราคัดสรรและรวบรวมสินค้าคุณภาพจากร้านค้าชั้นนำมาไว้ให้คุณที่นี่
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 text-sm">
            <div>
              <div className="text-white font-semibold mb-2">เมนูหลัก</div>
              <div className="flex flex-col gap-1">
                <Link href="/">หน้าแรก</Link>
                <Link href="/shop">สินค้า Giorno+</Link>
                <Link href="/articles">Giorno Magazine</Link>
              </div>
            </div>
            <div>
              <div className="text-white font-semibold mb-2">หมวดหมู่ยอดนิยม</div>
              <div className="flex flex-col gap-1">
                <Link href="/shop-category/ช่วงล่างและโช้คอัพ">ช่วงล่างและโช้คอัพ</Link>
                <Link href="/shop-category/ระบบเบรกและจานดิสก์">ระบบเบรก</Link>
                <Link href="/shop-category/ชุดล้อและยาง">ชุดล้อและยาง</Link>
              </div>
            </div>
            <div className="col-span-2 md:col-span-1">
              <div className="text-white font-semibold mb-2">Partner</div>
              <a href="https://s.shopee.co.th/1gG19oW9Ev" target="_blank" className="block hover:text-[#FF5722]">Affiliate Program</a>
              <p className="text-xs mt-3 text-[#9CA3AF]">
                คลิกลิงก์เพื่อรับโปรโมชั่นพิเศษจาก Shopee Thailand โดยตรง
              </p>
              <p className="text-[10px] mt-2 text-[#9CA3AF]">
                <Link href="/disclaimer" className="hover:text-white">Affiliate Disclaimer</Link> • 
                รูปภาพและข้อมูลสินค้าบางส่วนอาจมาจากร้านค้าบน Shopee
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 text-xs text-center text-[#9CA3AF]">
          © {new Date().getFullYear()} GiornoParts.com - All Rights Reserved. ปลอดภัย 100% ผ่าน Shopee.
        </div>
      </div>
    </footer>
  )
}
