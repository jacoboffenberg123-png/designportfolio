import type { Metadata } from "next";
import localFont from "next/font/local";
import Footer from "@/components/Footer";
import { getCV } from "@/lib/cv";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import "./globals.css";

// Inter, per the design brief: metrically close to Helvetica Neue, which isn't
// web-licensed off macOS.
//
// Self-hosted rather than pulled from next/font/google, because Google strips
// stylistic sets from the fonts it serves — including ss02, the disambiguation
// set that gives the slashed zero the catalogue numbering uses.
const inter = localFont({
  src: "./fonts/InterVariable.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jacob Offenberg",
  description: "Portefølje — UI/UX-designer",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cv = await getCV();

  return (
    <html lang="no" className={`${inter.variable} h-full antialiased`}>
      <head>
        {/* Repaints the palette from the stored dim level before first paint,
            so a dark page never flashes white on load. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      {/* The header lives in each page rather than here: layouts persist across
          navigation, so a header in the layout could never morph between the
          site header and the project page's top bar. */}
      {/* Paper rather than sunken: the grey used to be the surface revealed
          behind the roll-down panel. With that gone it would only ever show as
          a mismatched band on an overscroll bounce. */}
      <body className="min-h-full bg-paper text-ink font-sans">
        <div className="flex min-h-dvh flex-col bg-paper">
          {children}
          <Footer
            contactEmail={cv.contactEmail}
            linkedin={cv.linkedin}
            instagram={cv.instagram}
          />
        </div>
      </body>
    </html>
  );
}
