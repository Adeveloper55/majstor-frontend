"use client";

import dynamic from "next/dynamic";

const JobLocationMapInner = dynamic(() => import("./JobLocationMapInner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-80 items-center justify-center rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-500">
      Učitavanje mape...
    </div>
  ),
});

interface JobLocationMapProps {
  latitude: number;
  longitude: number;
}

export function JobLocationMap({ latitude, longitude }: JobLocationMapProps) {
  return <JobLocationMapInner latitude={latitude} longitude={longitude} />;
}
