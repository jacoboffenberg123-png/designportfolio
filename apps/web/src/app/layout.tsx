import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import Footer from "@/components/Footer";
import { getCV } from "@/lib/cv";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
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
      <head>
        {/* Repaints the palette from the stored dim level before first paint,
            so a dark page never flashes white on load. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      {/* The header lives in each page rather than here: layouts persist across
          navigation, so a header in the layout could never morph between the
          site header and the project page's top bar. */}
      <body className="min-h-full flex flex-col bg-paper text-ink font-sans">
        {children}
        <Footer
          contactEmail={cv.contactEmail}
          linkedin={cv.linkedin}
          instagram={cv.instagram}
        />
      </body>
    </html>
  );
}
