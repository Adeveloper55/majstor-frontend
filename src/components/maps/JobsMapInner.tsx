"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import "leaflet/dist/leaflet.css";
import type { JobListing } from "@/types";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function JobsMapInner({ jobs }: { jobs: JobListing[] }) {
  const centerLat = jobs.reduce((s, j) => s + (j.latitude || 0), 0) / jobs.length;
  const centerLon = jobs.reduce((s, j) => s + (j.longitude || 0), 0) / jobs.length;

  return (
    <MapContainer center={[centerLat, centerLon]} zoom={11} className="h-80 w-full rounded-xl z-0">
      <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {jobs.map((job) => (
        <Marker key={job.id} position={[job.latitude!, job.longitude!]} icon={icon}>
          <Popup>
            <p className="font-semibold">{job.title}</p>
            <p className="text-sm">{job.city} • {job.tokenCost} tokena</p>
            <Link href={`/jobs/${job.id}`} className="text-sm text-primary-800 hover:underline">Detalji →</Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
