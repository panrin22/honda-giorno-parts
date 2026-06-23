import type { Metadata } from "next";
import { Kanit, Prompt } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Giorno Parts | ศูนย์รวม ของแต่ง Giorno อะไหล่แต่ง Honda Giorno ระดับพรีเมี่ยม",
    template: "%s | Giorno Parts",
  },
  description: "ศูนย์รวมข้อมูล ของแต่ง อะไหล่แต่ง Giorno และบทความข่าวสาร Honda Giorno+ ครบวงจร เราคัดสรรสินค้าคุณภาพจาก Shopee",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Giorno Parts | ศูนย์รวม ของแต่ง Giorno+",
    description: "อะไหล่แต่ง Honda Giorno+ ครบวงจร ทั้งแท้และแต่ง",
    images: [{ url: "https://picsum.photos/1200/630?random=giorno" }],
  },
};

// Google Analytics (replace GA_MEASUREMENT_ID with your ID)
const GA_ID = 'G-XXXXXXXXXX'; // TODO: Replace with real ID for Phase 5

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${kanit.variable} ${prompt.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#0A0A0F] text-white font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />

        {/* Google Analytics - Phase 5 */}
        {GA_ID !== 'G-XXXXXXXXXX' && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}');
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}
