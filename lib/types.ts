export type Terrain = "flat" | "hill";
export type TimeOfDay = "day" | "night";
export type Difficulty = "easy" | "moderate" | "hard";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface ElevationPoint {
  distanceKm: number;
  elevationM: number;
}

export interface Amenity {
  type: "toilet" | "convenience-store" | "water";
  label: string;
  position: LatLng;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  content: string;
}

export interface Course {
  id: string;
  name: string;
  neighborhood: string;
  distanceKm: number;
  estimatedMinutes: number;
  difficulty: Difficulty;
  terrain: Terrain;
  timeOfDay: TimeOfDay[];
  streetlightLevel: "bright" | "moderate" | "dim";
  sidewalkWidth: "wide" | "narrow";
  surface: string;
  description: string;
  center: LatLng;
  route: LatLng[];
  elevation: ElevationPoint[];
  amenities: Amenity[];
  reviews: Review[];
  recommendScore: number;
}

export interface FilterState {
  maxDistanceKm: number;
  difficulty: Difficulty | "any";
  terrain: Terrain | "any";
  timeOfDay: TimeOfDay | "any";
  streetlightBright: boolean;
  wideSidewalk: boolean;
}

export type SortOption = "recommended" | "distance" | "difficulty";
