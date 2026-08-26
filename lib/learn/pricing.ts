// Premium pricing, in one place.
//
// Deliberately far below the global comparables (Brilliant is ~₹9,750/year
// in India): the whole point of this platform is that the price is not the
// reason someone in India can't learn. Everything downstream — the upsell
// copy, the settings screen, the receipts — reads these numbers.

export type PlanId = "monthly" | "annual";

export type Plan = {
  id: PlanId;
  label: string;
  /** What the learner is actually charged, in rupees. */
  amount: number;
  /** How often `amount` is charged. */
  period: "month" | "year";
  /** Effective monthly cost, for comparison against the monthly plan. */
  perMonth: number;
  /** Rounded saving against paying monthly for a year. */
  savingPercent: number;
};

const MONTHLY_AMOUNT = 99;
const ANNUAL_AMOUNT = 499;

export const PLANS: Record<PlanId, Plan> = {
  monthly: {
    id: "monthly",
    label: "Monthly",
    amount: MONTHLY_AMOUNT,
    period: "month",
    perMonth: MONTHLY_AMOUNT,
    savingPercent: 0,
  },
  annual: {
    id: "annual",
    label: "Annual",
    amount: ANNUAL_AMOUNT,
    period: "year",
    perMonth: Math.round(ANNUAL_AMOUNT / 12),
    savingPercent: Math.round((1 - ANNUAL_AMOUNT / (MONTHLY_AMOUNT * 12)) * 100),
  },
};

export const TRIAL_DAYS = 7;
