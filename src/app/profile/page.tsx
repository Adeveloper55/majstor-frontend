"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useCategories } from "@/hooks/useJobs";
import { useReviewsForUser, useReviewsForHandyman } from "@/hooks/useReviews";
import { PanelLayout } from "@/components/layout/PanelLayout";
import { AvatarUpload } from "@/components/shared/AvatarUpload";
import { CategoryPicker } from "@/components/shared/CategoryPicker";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { HandymanViewedJobsHistory } from "@/components/jobs/HandymanViewedJobsHistory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { validatePib, normalizePib } from "@/lib/pibValidation";
import type { Handyman } from "@/types";

export default function ProfilePage() {
  const { user, role, login, token } = useAuth();
  const { data: allCategories } = useCategories();
  const handymanUser = user as Handyman | null;
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    city: user?.city || "",
    bio: handymanUser?.bio || "",
    profileImageUrl: user?.profileImageUrl || "",
    pib: handymanUser?.pib || "",
    companyName: handymanUser?.companyName || "",
  });
  const [categoryIds, setCategoryIds] = useState<number[]>(handymanUser?.categoryIds ?? []);
  const [pibError, setPibError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (role === "ROLE_HANDYMAN" && handymanUser?.categoryIds) {
      setCategoryIds(handymanUser.categoryIds);
    }
  }, [role, handymanUser?.categoryIds]);

  const userReviews = useReviewsForUser(role === "ROLE_CLIENT" ? user?.id || "" : "");
  const handymanReviews = useReviewsForHandyman(role === "ROLE_HANDYMAN" ? user?.id || "" : "");
  const reviews = role === "ROLE_HANDYMAN" ? handymanReviews.data : userReviews.data;

  const handleSave = async () => {
    if (role === "ROLE_HANDYMAN") {
      const pibValidation = validatePib(form.pib, false);
      if (pibValidation) {
        setPibError(pibValidation);
        return;
      }
      if (categoryIds.length === 0) {
        setCategoryError("Izaberite bar jednu kategoriju posla.");
        return;
      }
      if (categoryIds.length > 10) {
        setCategoryError("Možete izabrati najviše 10 kategorija.");
        return;
      }
      setPibError("");
      setCategoryError("");
    }
    const url = role === "ROLE_HANDYMAN" ? "/api/handymen/me" : "/api/users/me";
    const payload =
      role === "ROLE_HANDYMAN"
        ? {
            fullName: form.fullName,
            phone: form.phone,
            city: form.city,
            bio: form.bio,
            profileImageUrl: form.profileImageUrl,
            pib: normalizePib(form.pib) || undefined,
            categoryIds,
          }
        : form;
    const { data } = await api.put(url, payload);
    if (token && role) login(token, role, data);
    setSaved(true);
  };

  return (
    <PanelLayout>
      <main className="flex-1 space-y-8 p-4 sm:p-6">
        <Card className="mx-auto max-w-2xl">
          <CardHeader><CardTitle>Profil</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <AvatarUpload value={form.profileImageUrl} onChange={(url) => setForm({ ...form, profileImageUrl: url })} />
            <div><Label>Ime</Label><Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></div>
            <div><Label>Telefon</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div><Label>Grad</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
            {role === "ROLE_HANDYMAN" && (
              <>
                <div>
                  <Label htmlFor="profile-pib">PIB — Poreski identifikacioni broj (opciono)</Label>
                  <Input
                    id="profile-pib"
                    inputMode="numeric"
                    placeholder="9 cifara"
                    value={form.pib}
                    onChange={(e) => {
                      setForm({ ...form, pib: e.target.value.replace(/\D/g, "").slice(0, 9) });
                      if (pibError) setPibError("");
                    }}
                  />
                  {pibError && <p className="mt-1 text-sm text-red-600">{pibError}</p>}
                </div>
                {form.companyName && (
                  <div>
                    <Label>Preduzeće</Label>
                    <Input value={form.companyName} disabled className="bg-slate-50" />
                  </div>
                )}
                {allCategories && (
                  <CategoryPicker
                    categories={allCategories}
                    selected={categoryIds}
                    onChange={(ids) => {
                      setCategoryIds(ids);
                      if (categoryError) setCategoryError("");
                    }}
                    error={categoryError}
                  />
                )}
                <div><Label>O meni</Label><Input value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>
              </>
            )}
            <Button onClick={handleSave}>Sačuvaj</Button>
            {saved && <p className="text-sm text-green-600">Sačuvano!</p>}
          </CardContent>
        </Card>
        {role === "ROLE_HANDYMAN" && (
          <HandymanViewedJobsHistory limit={10} showViewAllLink />
        )}
        <div>
          <h2 className="mb-4 text-xl font-bold">Moje recenzije</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {reviews?.map((r) => <ReviewCard key={r.id} review={r} />)}
            {!reviews?.length && <p className="text-slate-500">Nemate recenzija.</p>}
          </div>
        </div>
      </main>
    </PanelLayout>
  );
}
