import { LabelHTMLAttributes } from "react";
import { Input } from "@/components/atoms";
import type { InputProps } from "@/components/atoms";

interface FormFieldProps extends InputProps {
  label: string;
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>;
}

function FormField({ label, labelProps, id, ...inputProps }: FormFieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={fieldId}
        className="text-sm text-white/70 font-medium"
        {...labelProps}
      >
        {label}
      </label>
      <Input id={fieldId} {...inputProps} />
    </div>
  );
}

export { FormField };
export type { FormFieldProps };
