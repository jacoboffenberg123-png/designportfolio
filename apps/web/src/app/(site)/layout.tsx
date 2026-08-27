import SiteHeader from "@/components/SiteHeader";

/**
 * Shared shell for the overview and CV pages. The header lives here rather than
 * in each page so it survives navigation between the two — that's what lets the
 * tab switcher's thumb slide instead of snapping to its new position.
 *
 * Project pages sit outside this group; they get their own slim top bar.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
}
