export default function Disclaimer() {
  return (
    <div className="container py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Affiliate Disclaimer</h1>

      <div className="prose prose-invert text-[#B0B8C8]">
        <p>
          เว็บไซต์ GiornoParts.com เป็นเว็บไซต์ที่รวบรวมข้อมูลสินค้าและบทความเกี่ยวกับอะไหล่แต่ง Honda Giorno+
          เพื่อความสะดวกของผู้ใช้งาน
        </p>
        
        <p>
          ลิงก์การซื้อสินค้าทั้งหมดบนเว็บไซต์นี้เป็น <strong>Affiliate Link</strong> ที่เชื่อมต่อไปยัง Shopee 
          เมื่อคุณซื้อสินค้าผ่านลิงก์เหล่านี้ เราอาจได้รับค่าคอมมิชชั่นจาก Shopee โดยไม่เสียค่าใช้จ่ายเพิ่มเติมจากคุณ
        </p>

        <h3>ความรับผิดชอบ</h3>
        <ul>
          <li>ราคาและโปรโมชั่นอาจมีการเปลี่ยนแปลงได้ตลอดเวลา โปรดตรวจสอบราคาจริงที่ Shopee</li>
          <li>ข้อมูลสินค้าและรูปภาพบางส่วนอาจมาจากร้านค้าบน Shopee</li>
          <li>ทางเว็บไซต์ไม่รับผิดชอบต่อคุณภาพสินค้า การจัดส่ง หรือปัญหาอื่น ๆ จากร้านค้า</li>
        </ul>

        <p className="mt-8 text-sm">
          เราขอแนะนำให้อ่านรีวิวและตรวจสอบข้อมูลร้านค้าก่อนตัดสินใจซื้อทุกครั้ง
        </p>
      </div>
    </div>
  )
}
