/** Active delivery milestone — do not implement UI for later milestones until this advances. */
export const CURRENT_MILESTONE = 1 as const;

export type Milestone = 1 | 2 | 3 | 4 | 5;

export function isRouteEnabledForCurrentMilestone(milestone: Milestone): boolean {
  return milestone <= CURRENT_MILESTONE;
}
