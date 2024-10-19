import { useId } from "react";
import { FormHelperText } from "./form-helper-text";
import { Input } from "./input";
import { Label } from "./label";
import type { InputProps } from "./input";

type TextFieldProps = InputProps & {
  helperText?: string | undefined;
  label: string;
};

export const TextField = ({
  className,
  error,
  helperText,
  label,
  ...props
}: TextFieldProps) => {
  const id = useId();

  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>
      <Input className="mt-1" error={error} id={id} {...props} />
      {helperText !== undefined && (
        <FormHelperText className="mt-1" error={error}>
          {helperText}
        </FormHelperText>
      )}
    </div>
  );
};
