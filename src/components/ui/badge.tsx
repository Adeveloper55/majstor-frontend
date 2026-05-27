import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "destructive";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-primary-100 text-primary-900",
    success: "bg-green-100 text-green-900",
    warning: "bg-amber-100 text-amber-900",
    destructive: "bg-red-100 text-red-900",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
