// Stand-in, NOT from the doc page: the printed time-picker-card.tsx imports
// this showcase primitive, which the page never prints. Minimal on purpose.
import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
}

export function Badge({ className = "", variant: _variant, ...props }: BadgeProps) {
  return <div className={`inline-flex rounded-full border px-2 text-xs ${className}`} {...props} />;
}
