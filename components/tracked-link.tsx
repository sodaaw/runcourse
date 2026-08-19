"use client";

import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";
import { trackEvent } from "@/lib/gtag";

export function TrackedLink({
  event,
  params,
  className,
  children,
  ...linkProps
}: LinkProps & {
  event: string;
  params?: Record<string, string | number | boolean | undefined>;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      {...linkProps}
      className={className}
      onClick={() => trackEvent(event, params)}
    >
      {children}
    </Link>
  );
}
