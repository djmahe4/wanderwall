"use client";

import { useState } from "react";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import TagChip from "@/components/ui/TagChip";
import { TAG_POOL } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

export default function OnboardingPage() {
  const { user, profile, refreshProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    interests: profile?.interests ?? [],
    preferredLocation: profile?.preferences?.preferredLocation ?? "",
    maxCost: profile?.preferences?.maxCost ?? 0,
    minKtuPoints: profile?.preferences?.minKtuPoints ?? 0,
  });

  if (!user) {
    return (
      <Container className="py-12">
        <p className="text-sm text-charcoal/70">Sign in to start onboarding.</p>
      </Container>
    );
  }

  const toggleInterest = (tag) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(tag)
        ? prev.interests.filter((item) => item !== tag)
        : [...prev.interests, tag],
    }));
  };

  const handleFinish = async () => {
    const token = await user.getIdToken();
    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        interests: form.interests,
        preferences: {
          preferredLocation: form.preferredLocation,
          maxCost: Number(form.maxCost),
          minKtuPoints: Number(form.minKtuPoints),
          ktuCategories: profile?.preferences?.ktuCategories ?? [],
        },
      }),
    });
    if (!res.ok) {
      toast.error("Unable to save preferences.");
      return;
    }
    await refreshProfile();
    toast.success("You're all set. Wander on!");
    setStep(1);
  };

  return (
    <Container className="py-12 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-charcoal">Welcome aboard</h1>
        <p className="text-sm text-charcoal/70">Help us tune your wall.</p>
      </div>
      <div className="rounded-3xl border border-cream/60 bg-cream p-6 shadow-poster">
        <p className="text-xs font-semibold text-charcoal/60">Step {step} of 3</p>
        {step === 1 && (
          <div className="mt-4 space-y-4">
            <h2 className="text-lg font-semibold text-charcoal">
              What are you into?
            </h2>
            <div className="flex flex-wrap gap-2">
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
        )}
        {step === 2 && (
          <div className="mt-4 space-y-4">
            <h2 className="text-lg font-semibold text-charcoal">
              Where do you wander?
            </h2>
            <input
              className="w-full rounded-2xl border border-charcoal/10 px-4 py-2"
              placeholder="Your city or campus"
              value={form.preferredLocation}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  preferredLocation: event.target.value,
                }))
              }
            />
          </div>
        )}
        {step === 3 && (
          <div className="mt-4 space-y-4">
            <h2 className="text-lg font-semibold text-charcoal">
              What matters to you?
            </h2>
            <div>
              <label className="text-xs font-semibold text-charcoal/60">
                Max cost (₹)
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                step="50"
                value={form.maxCost}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    maxCost: event.target.value,
                  }))
                }
                className="mt-2 w-full accent-teal"
              />
              <p className="text-xs text-charcoal/60">₹{form.maxCost}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-charcoal/60">
                Minimum KTU points
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={form.minKtuPoints}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    minKtuPoints: event.target.value,
                  }))
                }
                className="mt-2 w-full accent-teal"
              />
              <p className="text-xs text-charcoal/60">
                {form.minKtuPoints} points
              </p>
            </div>
          </div>
        )}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep((prev) => Math.max(prev - 1, 1))}
            disabled={step === 1}
          >
            Back
          </Button>
          {step < 3 ? (
            <Button onClick={() => setStep((prev) => prev + 1)}>Next</Button>
          ) : (
            <Button onClick={handleFinish}>Finish</Button>
          )}
        </div>
      </div>
    </Container>
  );
}
