import { twMerge } from "tailwind-merge";

export const Label = ({
  className,
  ...props
}: React.ComponentProps<"label">) => {
  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label className={twMerge("font-medium text-sm", className)} {...props} />
  );
};
