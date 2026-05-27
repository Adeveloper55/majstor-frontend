"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useReviewsForUser, useReviewsForHandyman } from "@/hooks/useReviews";
import { Sidebar } from "@/components/layout/Sidebar";
import { AvatarUpload } from "@/components/shared/AvatarUpload";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";

export default function ProfilePage() {
  const { user, role, login, token } = useAuth();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    city: user?.city || "",
    bio: (user as { bio?: string })?.bio || "",
    profileImageUrl: user?.profileImageUrl || "",
  });
  const [saved, setSaved] = useState(false);

  const userReviews = useReviewsForUser(role === "ROLE_CLIENT" ? user?.id || "" : "");
  const handymanReviews = useReviewsForHandyman(role === "ROLE_HANDYMAN" ? user?.id || "" : "");
  const reviews = role === "ROLE_HANDYMAN" ? handymanReviews.data : userReviews.data;

  const handleSave = async () => {
    const url = role === "ROLE_HANDYMAN" ? "/api/handymen/me" : "/api/users/me";
    const { data } = await api.put(url, form);
    if (token && role) login(token, role, data);
    setSaved(true);
  };

  const deactivate = async () => {
    const url = role === "ROLE_HANDYMAN" ? "/api/handymen/me" : "/api/users/me";
    await api.delete(url);
    logout();
    router.push("/login");
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 space-y-8 p-6">
        <Card className="mx-auto max-w-lg">
          <CardHeader><CardTitle>Profil</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <AvatarUpload value={form.profileImageUrl} onChange={(url) => setForm({ ...form, profileImageUrl: url })} />
            <div><Label>Ime</Label><Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></div>
            <div><Label>Telefon</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div><Label>Grad</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
            {role === "ROLE_HANDYMAN" && (
              <div><Label>O meni</Label><Input value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>
            )}
            <Button onClick={handleSave}>Sačuvaj</Button>
            {saved && <p className="text-sm text-green-600">Sačuvano!</p>}
            <div className="border-t pt-4">
              <Button variant="destructive" onClick={() => setConfirmOpen(true)}>Deaktiviraj nalog</Button>
            </div>
          </CardContent>
        </Card>
        <div>
          <h2 className="mb-4 text-xl font-bold">Moje recenzije</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {reviews?.map((r) => <ReviewCard key={r.id} review={r} />)}
            {!reviews?.length && <p className="text-slate-500">Nemate recenzija.</p>}
          </div>
        </div>
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Deaktivirati nalog?"
          description="Nećete moći da se prijavite dok admin ne reaktivira nalog."
          confirmLabel="Deaktiviraj"
          onConfirm={deactivate}
        />
      </main>
    </div>
  );
}
