"use client";

import dynamic from "next/dynamic";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const MapInner = dynamic(() => import("./LocationPickerMap"), { ssr: false, loading: () => <div className="h-64 animate-pulse rounded-lg bg-slate-200" /> });

interface LocationPickerProps {
  address: string;
  city: string;
  latitude?: number;
  longitude?: number;
  onAddressChange: (v: string) => void;
  onCityChange: (v: string) => void;
  onLocationChange: (lat: number, lon: number) => void;
}

export function LocationPicker(props: LocationPickerProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="address">Adresa</Label>
        <Input id="address" value={props.address} onChange={(e) => props.onAddressChange(e.target.value)} placeholder="Ulica i broj" />
      </div>
      <div>
        <Label htmlFor="city">Grad *</Label>
        <Input id="city" required value={props.city} onChange={(e) => props.onCityChange(e.target.value)} placeholder="Grad" />
      </div>
      <div>
        <Label>Lokacija na mapi (prevucite pin)</Label>
        <MapInner
          lat={props.latitude ?? 44.8176}
          lon={props.longitude ?? 20.4633}
          onChange={props.onLocationChange}
        />
      </div>
    </div>
  );
}
