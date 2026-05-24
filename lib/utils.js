import { format } from "date-fns";

export function formatEventDate(date) {
  if (!date) return "";
  const parsed = typeof date === "string" ? new Date(date) : date;
  return format(parsed, "PPP");
}

export function formatCost(cost) {
  if (cost === 0) return "Free";
  if (Number.isNaN(Number(cost))) return "";
  return `₹${cost}`;
}

export function computeWanderScore(event, preferences) {
  if (!preferences) return 0;
  let score = 0;
  if (preferences.interests && event.tags) {
    event.tags.forEach((tag) => {
      if (preferences.interests.includes(tag)) {
        score += 10;
      }
    });
  }
  if (
    preferences.preferredLocation &&
    event.location === slugifyLocation(preferences.preferredLocation)
  ) {
    score += 5;
  }
  if (typeof preferences.maxCost === "number" && event.cost <= preferences.maxCost) {
    score += 5;
  }
  if (
    typeof preferences.minKtuPoints === "number" &&
    event.ktuPoints >= preferences.minKtuPoints
  ) {
    score += 5;
  }
  return score;
}

export function slugifyLocation(value) {
  return value.toLowerCase().trim().replace(/\s+/g, "-");
}
