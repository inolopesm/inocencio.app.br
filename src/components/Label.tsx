import { twMerge } from "tailwind-merge";

export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: no explanation :P
    <label className={twMerge("font-medium text-sm", className)} {...props} />
  );
}
