import { twMerge } from "tailwind-merge";

interface SelectProps extends React.ComponentProps<"select"> {
  onValueChange?: (value: string) => void;
}

export function Select({
  className,
  onChange,
  onValueChange,
  ...props
}: SelectProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(event);
    }

    if (onValueChange) {
      onValueChange(event.target.value);
    }
  };

  return (
    <select
      onChange={handleChange}
      className={twMerge(
        "flex h-10 w-full appearance-none rounded-md border border-gray-300 bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjNGI1NTYzIiBkPSJtMTIgMTVsLTUtNWgxMHoiLz48L3N2Zz4')] bg-right bg-no-repeat px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
