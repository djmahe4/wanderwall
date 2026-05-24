"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import TagChip from "@/components/ui/TagChip";
import { KTU_CATEGORIES, TAG_POOL } from "@/lib/constants";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";

const initialState = {
  title: "",
  description: "",
  date: "",
  posterFile: null,
  posterPreview: "",
  locationDisplay: "",
  cost: 0,
  ktuPoints: 0,
  ktuCategory: KTU_CATEGORIES[0].value,
  tags: [],
  phone: "",
};

export default function EventSubmissionForm() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const toggleTag = (tag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((item) => item !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        posterFile: file,
        posterPreview: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Sign in to submit events.");
      return;
    }
    setSubmitting(true);
    try {
      const token = await user.getIdToken();
      const payload = {
        title: form.title,
        description: form.description,
        date: form.date,
        location: form.locationDisplay.toLowerCase(),
        locationDisplay: form.locationDisplay,
        coordinates: null,
        cost: Number(form.cost),
        costDisplay: form.cost === 0 ? "Free" : `₹${form.cost}`,
        ktuPoints: Number(form.ktuPoints),
        ktuCategory: form.ktuCategory,
        tags: form.tags,
        phone: form.phone,
        posterImageBase64: form.posterPreview || undefined,
      };
      const res = await fetch("/api/events/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error("Submission failed");
      }
      toast.success("Your event has been pinned for review! ✨");
      setForm(initialState);
      setStep(1);
      setConfirmed(false);
    } catch (error) {
      console.error(error);
      toast.error("Unable to submit event.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-cream/60 bg-cream p-6 shadow-poster">
      <div className="mb-6 flex items-center justify-between text-sm text-charcoal/70">
        <span>Step {step} of 4</span>
        <span className="font-semibold text-charcoal">Pin your event</span>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-charcoal/70">
              Event title
            </label>
            <input
              className="mt-1 w-full rounded-2xl border border-charcoal/10 px-4 py-2"
              value={form.title}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, title: event.target.value }))
              }
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-charcoal/70">
              Description
            </label>
            <textarea
              className="mt-1 w-full rounded-2xl border border-charcoal/10 px-4 py-2"
              rows={5}
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-charcoal/70">
              Date & time
            </label>
            <input
              type="datetime-local"
              className="mt-1 w-full rounded-2xl border border-charcoal/10 px-4 py-2"
              value={form.date}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, date: event.target.value }))
              }
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <label className="text-xs font-semibold text-charcoal/70">
            Poster image
          </label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {form.posterPreview ? (
            <div className="relative h-56 w-full overflow-hidden rounded-2xl">
              <Image
                src={form.posterPreview}
                alt="Poster preview"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-charcoal/30 text-sm text-charcoal/60">
              Drag and drop your poster here
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-charcoal/70">
              Location
            </label>
            <input
              className="mt-1 w-full rounded-2xl border border-charcoal/10 px-4 py-2"
              value={form.locationDisplay}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  locationDisplay: event.target.value,
                }))
              }
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-charcoal/70">
                Cost (₹)
              </label>
              <input
                type="number"
                className="mt-1 w-full rounded-2xl border border-charcoal/10 px-4 py-2"
                value={form.cost}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, cost: event.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-charcoal/70">
                KTU points
              </label>
              <input
                type="number"
                className="mt-1 w-full rounded-2xl border border-charcoal/10 px-4 py-2"
                value={form.ktuPoints}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    ktuPoints: event.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-charcoal/70">
              KTU Category
            </label>
            <select
              className="mt-1 w-full rounded-2xl border border-charcoal/10 px-4 py-2"
              value={form.ktuCategory}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  ktuCategory: event.target.value,
                }))
              }
            >
              {KTU_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-charcoal/70">
              Tags
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {TAG_POOL.map((tag) => (
                <TagChip
                  key={tag}
                  label={tag}
                  active={form.tags.includes(tag)}
                  onClick={() => toggleTag(tag)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-charcoal/70">
              Phone number
            </label>
            <input
              className="mt-1 w-full rounded-2xl border border-charcoal/10 px-4 py-2"
              value={form.phone}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, phone: event.target.value }))
              }
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-charcoal/70">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(event) => setConfirmed(event.target.checked)}
            />{" "}
            I confirm this event is genuine and I can be reached at this number.
          </label>
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
        {step < 4 ? (
          <Button onClick={() => setStep((prev) => prev + 1)}>Next</Button>
        ) : (
          <Button onClick={handleSubmit} disabled={submitting || !confirmed}>
            {submitting ? "Submitting..." : "Submit event"}
          </Button>
        )}
      </div>
    </div>
  );
}
