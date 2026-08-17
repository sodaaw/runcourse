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

const AMENITY_GLYPH: Record<Amenity["type"], string> = {
  toilet: "화",
  "convenience-store": "편",
  water: "물",
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
  dot.style.background = variant === "start" ? "#3D6B4C" : "#14171A";
  dot.style.border = "2px solid #ffffff";
  dot.style.boxShadow = "0 0 0 1px #E2E4E1";

  const tag = document.createElement("div");
  tag.textContent = label;
  tag.style.marginBottom = "4px";
  tag.style.padding = "3px 8px";
  tag.style.fontSize = "12px";
  tag.style.fontWeight = "600";
  tag.style.color = "#14171A";
  tag.style.background = "#ffffff";
  tag.style.border = "1px solid #E2E4E1";
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
  el.style.width = "22px";
  el.style.height = "22px";
  el.style.borderRadius = "9999px";
  el.style.background = "#ffffff";
  el.style.border = "2px solid #767B76";
  el.style.fontSize = "10px";
  el.style.fontWeight = "700";
  el.style.color = "#767B76";
  el.style.cursor = "default";
  el.textContent = AMENITY_GLYPH[amenity.type];
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
              content: pinElement(m.label, "default", () =>
                router.push(`/courses/${m.id}`)
              ),
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
    <div className={`relative ${className ?? ""}`}>
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface">
          <p className="text-sm text-mute">지도를 불러오는 중...</p>
        </div>
      )}
      {status === "ready" && hasAmenityLayer && (
        <button
          type="button"
          onClick={() => setShowAmenities((v) => !v)}
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
