"use client";

import { useEffect, useState } from "react";
import { TAG_POOL, KTU_CATEGORIES } from "@/lib/constants";
import TagChip from "@/components/ui/TagChip";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";

export default function ProfileEditor() {
  const { user, profile, refreshProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(() => ({
    phone: profile?.phone ?? "",
    interests: profile?.interests ?? [],
    preferredLocation: profile?.preferences?.preferredLocation ?? "",
    maxCost: profile?.preferences?.maxCost ?? 0,
    minKtuPoints: profile?.preferences?.minKtuPoints ?? 0,
    ktuCategories: profile?.preferences?.ktuCategories ?? [],
  }));

  useEffect(() => {
    if (!profile) return;
    setForm({
      phone: profile.phone ?? "",
      interests: profile.interests ?? [],
      preferredLocation: profile.preferences?.preferredLocation ?? "",
      maxCost: profile.preferences?.maxCost ?? 0,
      minKtuPoints: profile.preferences?.minKtuPoints ?? 0,
      ktuCategories: profile.preferences?.ktuCategories ?? [],
    });
  }, [profile]);

  if (!profile) return null;

  const toggleInterest = (interest) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((item) => item !== interest)
        : [...prev.interests, interest],
    }));
  };

  const toggleCategory = (category) => {
    setForm((prev) => ({
      ...prev,
      ktuCategories: prev.ktuCategories.includes(category)
        ? prev.ktuCategories.filter((item) => item !== category)
        : [...prev.ktuCategories, category],
    }));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phone: form.phone || null,
          interests: form.interests,
          preferences: {
            preferredLocation: form.preferredLocation,
            maxCost: Number(form.maxCost),
            minKtuPoints: Number(form.minKtuPoints),
            ktuCategories: form.ktuCategories,
          },
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to save");
      }
      await refreshProfile();
      toast.success("Profile updated.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-3xl border border-cream/60 bg-cream p-6 shadow-poster">
      <h3 className="text-lg font-semibold text-charcoal">Profile settings</h3>
      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        <div>
          <label className="text-xs font-semibold text-charcoal/70">Phone</label>
          <input
            className="mt-1 w-full rounded-2xl border border-charcoal/10 px-4 py-2"
            value={form.phone}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, phone: event.target.value }))
            }
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-charcoal/70">
            Preferred location
          </label>
          <input
            className="mt-1 w-full rounded-2xl border border-charcoal/10 px-4 py-2"
            value={form.preferredLocation}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                preferredLocation: event.target.value,
              }))
            }
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-charcoal/70">
            Max cost
          </label>
          <input
            type="range"
            min="0"
            max="1000"
            step="50"
            value={form.maxCost}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, maxCost: event.target.value }))
            }
            className="mt-2 w-full accent-teal"
          />
          <p className="text-xs text-charcoal/60">₹{form.maxCost}</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-charcoal/70">
            Minimum KTU points
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={form.minKtuPoints}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, minKtuPoints: event.target.value }))
            }
            className="mt-2 w-full accent-teal"
          />
          <p className="text-xs text-charcoal/60">{form.minKtuPoints} points</p>
        </div>
      </div>

      <div className="mt-6">
        <label className="text-xs font-semibold text-charcoal/70">
          Interests
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {TAG_POOL.map((tag) => (
            <TagChip
              key={tag}
              label={tag}
              active={form.interests.includes(tag)}
              onClick={() => toggleInterest(tag)}
            />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <label className="text-xs font-semibold text-charcoal/70">
          KTU Categories
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {KTU_CATEGORIES.map((category) => (
            <TagChip
              key={category.value}
              label={category.label}
              active={form.ktuCategories.includes(category.value)}
              onClick={() => toggleCategory(category.value)}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save profile"}
        </Button>
      </div>
    </div>
  );
}
