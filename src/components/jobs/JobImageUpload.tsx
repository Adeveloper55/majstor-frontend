"use client";

import { useRef, useState } from "react";
import api from "@/lib/api";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const DEFAULT_MAX_IMAGES = 10;

interface JobImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export function JobImageUpload({ images, onChange, maxImages = DEFAULT_MAX_IMAGES }: JobImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const remaining = maxImages - images.length;
  const canAddMore = remaining > 0;

  const uploadFiles = async (files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!list.length) {
      setError("Izaberite validne slike.");
      return;
    }
    if (list.length > remaining) {
      setError(`Možete dodati još najviše ${remaining} slika (ukupno ${maxImages}).`);
      return;
    }

    setError("");
    setUploading(true);
    const uploaded: string[] = [];

    try {
      for (const file of list) {
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await api.post<{ url: string }>("/api/uploads/image", formData);
        uploaded.push(data.url);
      }
      onChange([...images, ...uploaded]);
    } catch {
      if (uploaded.length) {
        onChange([...images, ...uploaded]);
      }
      setError(uploaded.length ? "Neke slike nisu otpremljene. Pokušajte ponovo." : "Greška pri otpremanju slika.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div>
        <Label>Slike posla (opciono)</Label>
        <p className="mt-1 text-xs text-slate-500">
          Možete dodati do {maxImages} slika. {canAddMore ? `Preostalo: ${remaining}.` : "Dostignut je maksimum."}
        </p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((url, i) => (
            <div key={`${url}-${i}`} className="group relative overflow-hidden rounded-lg border border-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Slika ${i + 1}`} className="h-28 w-full object-cover" />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute right-2 top-2 h-7 px-2 text-xs opacity-90"
                onClick={() => removeImage(i)}
              >
                Ukloni
              </Button>
            </div>
          ))}
        </div>
      )}

      {canAddMore && (
        <Input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          disabled={uploading}
          onChange={(e) => {
            if (e.target.files?.length) void uploadFiles(e.target.files);
          }}
        />
      )}

      {uploading && <p className="text-sm text-slate-600">Otpremanje slika...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
