"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Footprints } from "lucide-react";
import clsx from "clsx";
import { trackEvent } from "@/lib/gtag";

const NAV_LINKS = [
  { href: "/", label: "홈" },
  { href: "/courses", label: "코스 추천" },
  { href: "/saved", label: "저장한 코스" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 hidden h-14 items-center border-b border-line bg-canvas/95 backdrop-blur sm:flex">
      <div className="mx-auto flex w-full max-w-content items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-ink">
          <Footprints size={20} strokeWidth={2.25} className="text-accent" />
          Runcourse
        </Link>
        <nav className="flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() =>
                  trackEvent("nav_click", { destination: link.href, source: "header" })
                }
                className={clsx(
                  "relative py-4 text-sm font-medium transition-colors",
                  active ? "text-ink" : "text-mute hover:text-ink"
                )}
              >
                {link.label}
                {active && (
                  <span className="absolute inset-x-0 -bottom-px h-[2px] bg-ink" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
