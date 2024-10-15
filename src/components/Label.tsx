import { twMerge } from "tailwind-merge";

export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: already configurated to warn on <Label /> call
    <label className={twMerge("font-medium text-sm", className)} {...props} />
  );
}
