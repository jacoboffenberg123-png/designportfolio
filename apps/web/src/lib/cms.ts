const CMS_URL = process.env.CMS_URL || "http://localhost:3002";

/**
 * Thin fetch wrapper around the Payload REST API (apps/cms). Returns `null`
 * on any network/HTTP failure instead of throwing, so a page can fall back
 * to an empty state rather than crashing when the CMS isn't reachable
 * (e.g. only `dev:web` is running, not `dev:cms`).
 */
export async function cmsFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${CMS_URL}${path}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      console.warn(`CMS fetch failed: ${path} -> ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`CMS unreachable at ${CMS_URL} (${path}):`, err instanceof Error ? err.message : err);
    return null;
  }
}

/** Resolves a Payload upload doc's `url` (which may be relative) to an absolute URL. */
export function cmsMediaUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${CMS_URL}${url}`;
}

export { CMS_URL };
