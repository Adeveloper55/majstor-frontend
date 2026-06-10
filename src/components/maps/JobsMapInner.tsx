"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
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

function MapRecenter({ lat, lon, zoom }: { lat: number; lon: number; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], zoom);
  }, [lat, lon, zoom, map]);
  return null;
}

export default function JobsMapInner({
  jobs,
  centerLat,
  centerLon,
  zoom = 11,
}: {
  jobs: JobListing[];
  centerLat: number;
  centerLon: number;
  zoom?: number;
}) {
  return (
    <MapContainer center={[centerLat, centerLon]} zoom={zoom} className="h-80 w-full rounded-xl z-0">
      <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapRecenter lat={centerLat} lon={centerLon} zoom={zoom} />
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
