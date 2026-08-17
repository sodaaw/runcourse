import { notFound } from "next/navigation";
import { MapPin, Star, Droplets, ShoppingBag, ToiletIcon } from "lucide-react";
import { getCourseById, courses } from "@/lib/mock-data";
import { DIFFICULTY_CLASS, DIFFICULTY_LABEL } from "@/lib/format";
import { ElevationChart } from "@/components/elevation-chart";
import { SafetyTags } from "@/components/safety-tags";
import { FeedbackBar } from "@/components/feedback-bar";
import { KakaoMap } from "@/components/kakao-map";

export function generateStaticParams() {
  return courses.map((c) => ({ id: c.id }));
}

const AMENITY_ICON = {
  toilet: ToiletIcon,
  "convenience-store": ShoppingBag,
  water: Droplets,
};

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = getCourseById(id);
  if (!course) notFound();

  return (
    <div className="mx-auto max-w-content px-6 py-8 pb-44 sm:pb-28">
      <p className="flex items-center gap-1 text-sm font-medium text-mute">
        <MapPin size={14} />
        {course.neighborhood}
      </p>
      <h1 className="mt-1 text-[26px] font-extrabold leading-tight text-ink sm:text-3xl">
        {course.name}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-4 tabular-nums">
        <span className="text-3xl font-extrabold text-ink">
          {course.distanceKm}
          <span className="ml-0.5 text-base font-medium text-mute">km</span>
        </span>
        <span className="text-sm text-mute">약 {course.estimatedMinutes}분</span>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${DIFFICULTY_CLASS[course.difficulty]}`}
        >
          {DIFFICULTY_LABEL[course.difficulty]}
        </span>
        <span className="flex items-center gap-1 text-sm font-semibold text-ink">
          <Star size={14} fill="#3D6B4C" className="text-accent" />
          추천 {course.recommendScore}%
        </span>
      </div>

      <p className="mt-5 max-w-2xl text-sm leading-relaxed text-mute">
        {course.description}
      </p>

      <div className="mt-4 border-y border-line py-4">
        <SafetyTags course={course} />
      </div>

      {/* Route map */}
      <section className="mt-8">
        <h2 className="text-base font-bold text-ink">코스 지도</h2>
        <p className="mt-1 text-sm text-mute">
          출발/도착 지점, 경로, 편의시설 위치가 실제 지도 위에 표시됩니다.
        </p>
        <div className="mt-4">
          <KakaoMap
            mode="route"
            center={course.center}
            route={course.route}
            amenities={course.amenities}
            className="h-72 w-full border border-line sm:h-96"
          />
        </div>
      </section>

      {/* Elevation */}
      <section className="mt-8">
        <h2 className="text-base font-bold text-ink">고도 프로필</h2>
        <p className="mt-1 text-sm text-mute">노면: {course.surface}</p>
        <div className="mt-4">
          <ElevationChart data={course.elevation} />
        </div>
      </section>

      {/* Amenities */}
      <section className="mt-10">
        <h2 className="text-base font-bold text-ink">편의시설</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {course.amenities.map((a, i) => {
            const Icon = AMENITY_ICON[a.type];
            return (
              <li
                key={i}
                className="flex items-center gap-2.5 border border-line px-4 py-3 text-sm text-ink"
              >
                <Icon size={16} className="text-accent" strokeWidth={2} />
                {a.label}
              </li>
            );
          })}
        </ul>
      </section>

      {/* Reviews */}
      <section className="mt-10">
        <h2 className="text-base font-bold text-ink">
          유저 후기 <span className="text-mute">({course.reviews.length})</span>
        </h2>
        <ul className="mt-3 flex flex-col divide-y divide-line border-y border-line">
          {course.reviews.map((r) => (
            <li key={r.id} className="py-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-ink">{r.author}</p>
                <p className="text-xs text-mute tabular-nums">{r.date}</p>
              </div>
              <div className="mt-1 flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className="text-accent"
                    fill={i < r.rating ? "#3D6B4C" : "none"}
                  />
                ))}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink">{r.content}</p>
            </li>
          ))}
        </ul>
      </section>

      <FeedbackBar courseId={course.id} />
    </div>
  );
}
