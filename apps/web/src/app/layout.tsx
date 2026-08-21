import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCV } from "@/lib/cv";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jacob Offenberg",
  description: "Portefølje — UI/UX-designer",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cv = await getCV();

  return (
    <html lang="no" className={`${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-paper text-ink font-sans">
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer
          contactEmail={cv.contactEmail}
          linkedin={cv.linkedin}
          instagram={cv.instagram}
        />
      </body>
    </html>
  );
}
