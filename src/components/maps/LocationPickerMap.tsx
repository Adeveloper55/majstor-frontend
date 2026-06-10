"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function DraggableMarker({
  lat,
  lon,
  onChange,
}: {
  lat: number;
  lon: number;
  onChange: (lat: number, lon: number) => void;
}) {
  const [position, setPosition] = useState<[number, number]>([lat, lon]);

  useEffect(() => {
    setPosition([lat, lon]);
  }, [lat, lon]);

  useMapEvents({
    click(e) {
      const next: [number, number] = [e.latlng.lat, e.latlng.lng];
      setPosition(next);
      onChange(next[0], next[1]);
    },
  });

  return (
    <Marker
      position={position}
      icon={icon}
      draggable
      eventHandlers={{
        drag(e) {
          const ll = e.target.getLatLng();
          setPosition([ll.lat, ll.lng]);
        },
        dragend(e) {
          const ll = e.target.getLatLng();
          const next: [number, number] = [ll.lat, ll.lng];
          setPosition(next);
          onChange(next[0], next[1]);
        },
      }}
    />
  );
}

function MapReady({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], map.getZoom() || 13);
    const timer = window.setTimeout(() => map.invalidateSize(), 150);
    return () => window.clearTimeout(timer);
  }, [lat, lon, map]);
  return null;
}

export default function LocationPickerMap({
  lat,
  lon,
  onChange,
}: {
  lat: number;
  lon: number;
  onChange: (lat: number, lon: number) => void;
}) {
  return (
    <MapContainer center={[lat, lon]} zoom={13} className="h-64 w-full rounded-lg z-0">
      <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapReady lat={lat} lon={lon} />
      <DraggableMarker lat={lat} lon={lon} onChange={onChange} />
    </MapContainer>
  );
}
