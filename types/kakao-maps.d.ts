declare namespace kakao.maps {
  class LatLng {
    constructor(lat: number, lng: number);
    getLat(): number;
    getLng(): number;
  }

  class LatLngBounds {
    constructor();
    extend(latlng: LatLng): void;
  }

  interface MapOptions {
    center: LatLng;
    level?: number;
  }

  class Map {
    constructor(container: HTMLElement, options: MapOptions);
    setBounds(bounds: LatLngBounds, paddingTop?: number): void;
    setCenter(latlng: LatLng): void;
    setLevel(level: number): void;
    relayout(): void;
  }

  interface PolylineOptions {
    path: LatLng[];
    strokeWeight?: number;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeStyle?: "solid" | "shortdash" | "shortdot" | "longdash" | "dash";
  }

  class Polyline {
    constructor(options: PolylineOptions);
    setMap(map: Map | null): void;
  }

  class Size {
    constructor(width: number, height: number);
  }

  class Point {
    constructor(x: number, y: number);
  }

  class MarkerImage {
    constructor(src: string, size: Size, options?: { offset?: Point });
  }

  interface MarkerOptions {
    position: LatLng;
    map?: Map;
    image?: MarkerImage;
    title?: string;
  }

  class Marker {
    constructor(options: MarkerOptions);
    setMap(map: Map | null): void;
  }

  interface CustomOverlayOptions {
    position: LatLng;
    content: string | HTMLElement;
    map?: Map;
    xAnchor?: number;
    yAnchor?: number;
    zIndex?: number;
    clickable?: boolean;
  }

  class CustomOverlay {
    constructor(options: CustomOverlayOptions);
    setMap(map: Map | null): void;
  }

  namespace event {
    function addListener(
      target: object,
      type: string,
      handler: () => void
    ): void;
  }

  function load(callback: () => void): void;
}

interface Window {
  kakao: typeof kakao;
}
