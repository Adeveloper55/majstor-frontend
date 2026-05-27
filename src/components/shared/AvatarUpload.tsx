"use client";

import { useState } from "react";
import api from "@/lib/api";
import { Label } from "@/components/ui/label";

interface AvatarUploadProps {
  value?: string;
  onChange: (url: string) => void;
}

export function AvatarUpload({ value, onChange }: AvatarUploadProps) {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await api.post<{ url: string }>("/api/uploads/image", formData);
      onChange(data.url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-2xl font-bold text-slate-500">
        {value ? <img src={value} alt="Avatar" className="h-full w-full object-cover" /> : "?"}
      </div>
      <div>
        <Label>Profilna slika</Label>
        <input type="file" accept="image/*" onChange={handleUpload} disabled={loading} className="mt-1 block text-sm" />
        {loading && <p className="text-sm text-slate-500">Otpremanje...</p>}
      </div>
    </div>
  );
}
