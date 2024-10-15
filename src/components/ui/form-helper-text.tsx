import { twMerge } from "tailwind-merge";

export type FormHelperTextProps = React.ComponentProps<"p"> & {
  error?: boolean | undefined;
};

export function FormHelperText({
  className,
  error,
  ...props
}: FormHelperTextProps) {
  return (
    <p
      className={twMerge(
        "text-sm",
        error ? "text-red-500" : "text-gray-600",
        className,
      )}
      {...props}
    />
  );
}
