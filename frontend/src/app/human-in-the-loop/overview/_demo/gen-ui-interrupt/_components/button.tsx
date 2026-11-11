// Stand-in, NOT from the doc page: the printed time-picker-card.tsx imports
// this showcase primitive, which the page never prints. Minimal on purpose.
import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string;
  size?: string;
}

export function Button({ className = "", variant: _variant, size: _size, ...props }: ButtonProps) {
  return <button className={`rounded border px-3 py-1 text-sm ${className}`} {...props} />;
}
