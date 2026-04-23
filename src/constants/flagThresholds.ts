export const FLAG_THRESHOLDS = {
  sleep_hours: { below: 6 },
  sleep_quality: { below: 4 },
  energy: { below: 3 },
  soreness: { above: 8 },
  stress: { above: 8 },
  mood: { below: 3 },
  readiness: { below: 4 },
  pain_reported: { equals: true },
} as const;

export function computeFlags(answers: Record<string, unknown>): string[] {
  const flags: string[] = [];

  for (const [key, rules] of Object.entries(FLAG_THRESHOLDS)) {
    const value = answers[key];
    if (value === undefined) continue;
    if ("below" in rules && typeof value === "number" && value < rules.below) {
      flags.push(`${key} below ${rules.below}`);
    }
    if ("above" in rules && typeof value === "number" && value > rules.above) {
      flags.push(`${key} above ${rules.above}`);
    }
    if ("equals" in rules && value === rules.equals) {
      flags.push(`${key} reported`);
    }
  }

  return flags;
}

export function computeReadinessScore(answers: Record<string, unknown>): number {
  const weights: Record<
    string,
    { max: number; weight: number; invert?: boolean }
  > = {
    sleep_hours: { max: 9, weight: 0.2 },
    sleep_quality: { max: 10, weight: 0.15 },
    energy: { max: 10, weight: 0.2 },
    soreness: { max: 10, weight: 0.15, invert: true },
    stress: { max: 10, weight: 0.1, invert: true },
    mood: { max: 10, weight: 0.1 },
    readiness: { max: 10, weight: 0.1 },
  };

  let score = 0;
  let totalWeight = 0;

  for (const [key, config] of Object.entries(weights)) {
    const value = answers[key];
    if (typeof value !== "number") continue;

    const normalized = Math.min(value / config.max, 1);
    const adjusted = config.invert ? 1 - normalized : normalized;
    score += adjusted * config.weight;
    totalWeight += config.weight;
  }

  return totalWeight > 0 ? Math.round((score / totalWeight) * 100) : 0;
}
