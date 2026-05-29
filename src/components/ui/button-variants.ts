import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary-800 text-white hover:bg-primary-900 shadow-sm",
        outline: "border-2 border-slate-300 bg-white text-slate-800 hover:bg-slate-50 hover:text-slate-900",
        ghost: "text-slate-700 hover:bg-slate-100",
        destructive: "bg-red-600 text-white hover:bg-red-700",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 px-4 text-sm font-medium",
        lg: "h-12 px-7 text-lg",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
