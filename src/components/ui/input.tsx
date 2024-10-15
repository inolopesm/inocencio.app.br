import { twMerge } from "tailwind-merge";

export type InputProps = React.ComponentProps<"input"> & {
  onValueChange?: (value: string) => void;
  error?: boolean | undefined;
};

export function Input({
  className,
  onChange,
  onValueChange,
  error,
  ...props
}: InputProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event);
    }

    if (onValueChange) {
      onValueChange(event.target.value);
    }
  };

  return (
    <input
      onChange={handleChange}
      className={twMerge(
        "flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        error ? "border-red-500" : "border-gray-300",
        className,
      )}
      {...props}
    />
  );
}
