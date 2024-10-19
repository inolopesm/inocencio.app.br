import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

const button = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded border font-medium text-sm ring-offset-white duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-primary bg-primary text-white hover:border-[#0dab45] hover:bg-[#0dab45] active:border-[#0c983d] active:bg-[#0c983d]",
        destructive:
          "border-transparent text-red-500 hover:bg-red-500/5 active:bg-red-500/10",
        outline:
          "border-gray-200 hover:border-gray-300 hover:bg-white/5 active:border-gray-400 active:bg-white/10",
        secondary:
          "border-gray-200 bg-gray-200 hover:border-gray-300 hover:bg-gray-300 active:border-gray-400 active:bg-gray-400",
        ghost: "border-transparent hover:bg-black/5 active:bg-black/10",
        link: "border-transparent hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof button> & {
    asChild?: boolean;
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild, disabled, className, variant, size, ...props }, ref) => {
    const Component = asChild ? Slot : "button";

    return (
      <Component
        ref={ref}
        className={twMerge(button({ variant, size }), className)}
        {...(asChild ? { "data-disabled": disabled } : { disabled })}
        {...props}
      />
    );
  },
);

export { Button };
