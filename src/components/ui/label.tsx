import * as React from "react";
import { cn } from "@/lib/utils";

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      className={cn("mb-1.5 block text-base font-semibold text-slate-800", className)}
      ref={ref}
      {...props}
    />
  )
);
Label.displayName = "Label";
