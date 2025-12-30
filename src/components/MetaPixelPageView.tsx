"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function MetaPixelPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // @ts-ignore
    if (!window.fbq) return;
    // @ts-ignore
    window.fbq("track", "PageView");
  }, [pathname, searchParams]);

  return null;
}
