// Stand-in, NOT from the doc page: the printed time-picker-card.tsx imports
// this showcase primitive, which the page never prints. Minimal on purpose.
import * as React from "react";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className = "", ...props }: DivProps) {
  return <div className={`rounded-lg border ${className}`} {...props} />;
}

export function CardHeader({ className = "", ...props }: DivProps) {
  return <div className={`p-4 ${className}`} {...props} />;
}

export function CardTitle({ className = "", ...props }: DivProps) {
  return <div className={`font-semibold ${className}`} {...props} />;
}

export function CardDescription({ className = "", ...props }: DivProps) {
  return <div className={`text-sm ${className}`} {...props} />;
}

export function CardContent({ className = "", ...props }: DivProps) {
  return <div className={`p-4 pt-0 ${className}`} {...props} />;
}
