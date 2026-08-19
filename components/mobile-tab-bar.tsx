"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ListFilter, Bookmark } from "lucide-react";
import clsx from "clsx";
import { trackEvent } from "@/lib/gtag";

const TABS = [
  { href: "/", label: "홈", icon: Home },
  { href: "/courses", label: "추천", icon: ListFilter },
  { href: "/saved", label: "저장", icon: Bookmark },
];

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 border-t border-line bg-canvas sm:hidden">
      {TABS.map(({ href, label, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={() =>
              trackEvent("nav_click", { destination: href, source: "mobile_tab_bar" })
            }
            className="flex flex-1 flex-col items-center justify-center gap-1"
          >
            <Icon
              size={22}
              strokeWidth={active ? 2.5 : 2}
              className={active ? "text-accent" : "text-mute"}
            />
            <span
              className={clsx(
                "text-[11px] font-medium",
                active ? "text-ink" : "text-mute"
              )}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
