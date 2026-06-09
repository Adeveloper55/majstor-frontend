"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function DraggableMarker({ lat, lon, onChange }: { lat: number; lon: number; onChange: (lat: number, lon: number) => void }) {
  const map = useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  useEffect(() => {
    map.setView([lat, lon], map.getZoom() || 13);
  }, [lat, lon, map]);

  useEffect(() => {
    const timer = window.setTimeout(() => map.invalidateSize(), 100);
    return () => window.clearTimeout(timer);
  }, [map]);

  return (
    <Marker
      position={[lat, lon]}
      icon={icon}
      draggable
      eventHandlers={{ dragend: (e) => onChange(e.target.getLatLng().lat, e.target.getLatLng().lng) }}
    />
  );
}

export default function LocationPickerMap({ lat, lon, onChange }: { lat: number; lon: number; onChange: (lat: number, lon: number) => void }) {
  return (
    <MapContainer center={[lat, lon]} zoom={13} className="h-64 w-full rounded-lg z-0">
      <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <DraggableMarker lat={lat} lon={lon} onChange={onChange} />
    </MapContainer>
  );
}
