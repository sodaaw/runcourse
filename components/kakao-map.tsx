"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Layers } from "lucide-react";
import clsx from "clsx";
import {
  loadKakaoMaps,
  KakaoLoadError,
  KakaoLoadErrorReason,
} from "@/lib/kakao-maps-loader";
import { Amenity, LatLng } from "@/lib/types";
import { trackEvent } from "@/lib/gtag";

interface RouteMapProps {
  mode: "route";
  center: LatLng;
  route: LatLng[];
  amenities?: Amenity[];
  className?: string;
}

interface MarkersMapProps {
  mode: "markers";
  center: LatLng;
  markers: { id: string; position: LatLng; label: string }[];
  className?: string;
}

type KakaoMapProps = RouteMapProps | MarkersMapProps;

type Status = "loading" | "ready" | "error";

const AMENITY_ICON_SVG: Record<Amenity["type"], string> = {
  toilet:
    '<path d="M7 12h13a1 1 0 0 1 1 1 5 5 0 0 1-5 5h-.598a.5.5 0 0 0-.424.765l1.544 2.47a.5.5 0 0 1-.424.765H5.402a.5.5 0 0 1-.424-.765L7 18"/><path d="M8 18a5 5 0 0 1-5-5V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8"/>',
  "convenience-store":
    '<path d="M16 10a4 4 0 0 1-8 0"/><path d="M3.103 6.034h17.794"/><path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z"/>',
  water:
    '<path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>',
};

function pinElement(
  label: string,
  variant: "start" | "default" = "default",
  onClick?: () => void
) {
  const el = document.createElement("div");
  el.style.display = "flex";
  el.style.flexDirection = "column";
  el.style.alignItems = "center";
  el.style.cursor = onClick ? "pointer" : "default";
  if (onClick) el.addEventListener("click", onClick);

  const dot = document.createElement("div");
  dot.style.width = "14px";
  dot.style.height = "14px";
  dot.style.borderRadius = "9999px";
  dot.style.background = variant === "start" ? "#3D6B4C" : "#1C1F1B";
  dot.style.border = "2px solid #ffffff";
  dot.style.boxShadow = "0 0 0 1px #E4E2DA";

  const tag = document.createElement("div");
  tag.textContent = label;
  tag.style.marginBottom = "4px";
  tag.style.padding = "3px 8px";
  tag.style.fontSize = "12px";
  tag.style.fontWeight = "600";
  tag.style.color = "#1C1F1B";
  tag.style.background = "#ffffff";
  tag.style.border = "1px solid #E4E2DA";
  tag.style.whiteSpace = "nowrap";

  el.appendChild(tag);
  el.appendChild(dot);
  return el;
}

function amenityPinElement(amenity: Amenity) {
  const el = document.createElement("div");
  el.title = amenity.label;
  el.style.display = "flex";
  el.style.alignItems = "center";
  el.style.justifyContent = "center";
  el.style.width = "24px";
  el.style.height = "24px";
  el.style.borderRadius = "9999px";
  el.style.background = "#ffffff";
  el.style.border = "2px solid #6B6F68";
  el.style.color = "#6B6F68";
  el.style.cursor = "default";
  el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${AMENITY_ICON_SVG[amenity.type]}</svg>`;
  return el;
}

export function KakaoMap(props: KakaoMapProps) {
  const { mode, center, className } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [errorReason, setErrorReason] =
    useState<KakaoLoadErrorReason>("rejected");
  const [showAmenities, setShowAmenities] = useState(true);
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const amenityOverlaysRef = useRef<kakao.maps.CustomOverlay[]>([]);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;

    loadKakaoMaps()
      .then((kakaoSdk) => {
        if (cancelled || !containerRef.current) return;

        const map = new kakaoSdk.maps.Map(containerRef.current, {
          center: new kakaoSdk.maps.LatLng(center.lat, center.lng),
          level: 5,
        });
        mapRef.current = map;

        if (mode === "route") {
          const path = props.route.map(
            (p) => new kakaoSdk.maps.LatLng(p.lat, p.lng)
          );
          const polyline = new kakaoSdk.maps.Polyline({
            path,
            strokeWeight: 4,
            strokeColor: "#3D6B4C",
            strokeOpacity: 0.9,
            strokeStyle: "solid",
          });
          polyline.setMap(map);

          const start = props.route[0];
          new kakaoSdk.maps.CustomOverlay({
            position: new kakaoSdk.maps.LatLng(start.lat, start.lng),
            content: pinElement("출발", "start"),
            map,
            xAnchor: 0.5,
            yAnchor: 1,
          });

          amenityOverlaysRef.current = (props.amenities ?? []).map(
            (amenity) => {
              const overlay = new kakaoSdk.maps.CustomOverlay({
                position: new kakaoSdk.maps.LatLng(
                  amenity.position.lat,
                  amenity.position.lng
                ),
                content: amenityPinElement(amenity),
                xAnchor: 0.5,
                yAnchor: 0.5,
                zIndex: 2,
              });
              overlay.setMap(showAmenities ? map : null);
              return overlay;
            }
          );

          const bounds = new kakaoSdk.maps.LatLngBounds();
          path.forEach((p) => bounds.extend(p));
          map.setBounds(bounds, 40);
        } else {
          const bounds = new kakaoSdk.maps.LatLngBounds();
          props.markers.forEach((m) => {
            const position = new kakaoSdk.maps.LatLng(
              m.position.lat,
              m.position.lng
            );
            bounds.extend(position);
            new kakaoSdk.maps.CustomOverlay({
              position,
              content: pinElement(m.label, "default", () => {
                trackEvent("select_course", {
                  course_id: m.id,
                  source: "map_marker",
                });
                router.push(`/courses/${m.id}`);
              }),
              map,
              xAnchor: 0.5,
              yAnchor: 1,
              zIndex: 1,
            });
          });
          if (props.markers.length > 0) {
            map.setBounds(bounds, 60);
          }
        }

        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        setErrorReason(err instanceof KakaoLoadError ? err.reason : "rejected");
        setStatus("error");
      });

    return () => {
      cancelled = true;
      // React Strict Mode double-invokes effects in dev; since map creation
      // is async, without this a second map instance gets mounted into the
      // same container, leaving orphaned overlays that the amenities toggle
      // can no longer reach. Wiping the container resets it cleanly.
      if (container) container.innerHTML = "";
      mapRef.current = null;
      amenityOverlaysRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, center.lat, center.lng]);

  useEffect(() => {
    amenityOverlaysRef.current.forEach((overlay) =>
      overlay.setMap(showAmenities ? mapRef.current : null)
    );
  }, [showAmenities]);

  const hasAmenityLayer =
    mode === "route" && (props.amenities?.length ?? 0) > 0;

  if (status === "error") {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 border border-line bg-surface px-6 py-16 text-center ${className ?? ""}`}
      >
        <MapPin size={22} strokeWidth={1.75} className="text-mute" />
        <p className="text-sm font-medium text-ink">지도를 불러올 수 없어요</p>
        {errorReason === "missing-key" ? (
          <p className="max-w-xs text-xs text-mute">
            .env.local 에 NEXT_PUBLIC_KAKAO_MAP_KEY 를 설정한 뒤 다시
            실행해주세요.
          </p>
        ) : (
          <p className="max-w-xs text-xs text-mute">
            앱 키가 거부됐어요. 카카오 디벨로퍼스에서 (1) JavaScript 키를
            사용했는지, (2) Platform &gt; Web 에 현재 접속 주소가 등록되어
            있는지 확인해주세요.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface">
          <p className="text-sm text-mute">지도를 불러오는 중...</p>
        </div>
      )}
      {status === "ready" && hasAmenityLayer && (
        <button
          type="button"
          onClick={() => {
            setShowAmenities((v) => {
              trackEvent("toggle_amenities_layer", { value: !v });
              return !v;
            });
          }}
          aria-pressed={showAmenities}
          className={clsx(
            "absolute right-3 top-3 z-10 flex h-9 items-center gap-1.5 border px-3 text-xs font-semibold shadow-sm",
            showAmenities
              ? "border-accent bg-accent-soft text-accent"
              : "border-line bg-canvas text-ink"
          )}
        >
          <Layers size={14} />
          편의시설
        </button>
      )}
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
