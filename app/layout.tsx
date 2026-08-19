import type { Metadata } from "next";
import "./globals.css";
import { AppStateProvider } from "@/lib/app-state";
import { Header } from "@/components/header";
import { MobileTabBar } from "@/components/mobile-tab-bar";
import { GoogleAnalytics } from "@/components/google-analytics";

export const metadata: Metadata = {
  title: "Runcourse — 초보 러너를 위한 안전한 코스 추천",
  description:
    "거리, 지형, 안전 요소를 입력하면 검증된 러닝 코스를 즉시 추천받으세요.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-canvas text-ink">
        <GoogleAnalytics />
        <AppStateProvider>
          <Header />
          <main className="flex-1 pb-16 sm:pb-0">{children}</main>
          <MobileTabBar />
        </AppStateProvider>
      </body>
    </html>
  );
}
