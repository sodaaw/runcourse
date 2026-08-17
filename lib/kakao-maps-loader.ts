export type KakaoLoadErrorReason = "missing-key" | "rejected";

export class KakaoLoadError extends Error {
  reason: KakaoLoadErrorReason;
  constructor(reason: KakaoLoadErrorReason, message: string) {
    super(message);
    this.reason = reason;
  }
}

let loadingPromise: Promise<typeof kakao> | null = null;

export function loadKakaoMaps(): Promise<typeof kakao> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("kakao maps can only load in the browser"));
  }
  if (window.kakao?.maps) {
    return Promise.resolve(window.kakao);
  }
  if (loadingPromise) {
    return loadingPromise;
  }

  const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
  if (!appKey) {
    return Promise.reject(
      new KakaoLoadError("missing-key", "NEXT_PUBLIC_KAKAO_MAP_KEY is not set")
    );
  }

  loadingPromise = new Promise((resolve, reject) => {
    const rejectLoad = () =>
      reject(
        new KakaoLoadError(
          "rejected",
          "kakao maps sdk request was rejected — check the app key type (JavaScript key, not REST/Admin key) and that the domain is registered under Platform > Web in Kakao Developers"
        )
      );

    const existing = document.getElementById("kakao-maps-sdk");
    if (existing) {
      existing.addEventListener("load", () =>
        window.kakao.maps.load(() => resolve(window.kakao))
      );
      existing.addEventListener("error", rejectLoad);
      return;
    }

    const script = document.createElement("script");
    script.id = "kakao-maps-sdk";
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services`;
    script.async = true;
    script.onload = () => window.kakao.maps.load(() => resolve(window.kakao));
    script.onerror = rejectLoad;
    document.head.appendChild(script);
  });

  return loadingPromise;
}
