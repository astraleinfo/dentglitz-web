"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { sendGTMEvent } from "@next/third-parties/google";

export function GTMPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    sendGTMEvent({ event: "pageview", page: query ? `${pathname}?${query}` : pathname });
  }, [pathname, searchParams]);

  return null;
}
