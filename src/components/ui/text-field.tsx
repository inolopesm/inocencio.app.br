import { useId } from "react";
import { FormHelperText } from "./form-helper-text";
import { Input, type InputProps } from "./input";
import { Label } from "./label";

type TextFieldProps = Pick<
  InputProps,
  | "className"
  | "type"
  | "autoCapitalize"
  | "value"
  | "onValueChange"
  | "disabled"
  | "error"
  | "inputMode"
  | "placeholder"
  | "autoComplete"
> & {
  helperText?: string | undefined;
  label: string;
};

export function TextField({
  className,
  error,
  helperText,
  label,
  ...props
}: TextFieldProps) {
  const id = useId();

  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>
      <Input className="mt-1" id={id} error={error} {...props} />
      {helperText !== undefined && (
        <FormHelperText className="mt-1" error={error}>
          {helperText}
        </FormHelperText>
      )}
    </div>
  );
}
