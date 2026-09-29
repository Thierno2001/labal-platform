"use client";

import { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <div className="bg-white border border-labal-gray-medium rounded-xl p-6 shadow-sm">
      <div className="mb-5">
        <h3 className="text-lg font-bold text-labal-deep">{title}</h3>
        {description && (
          <p className="text-sm text-labal-gray-dark mt-1">{description}</p>
        )}
        <div className="mt-2 h-0.5 w-10 bg-labal-lime rounded-full" />
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

// ============================================================
// Reusable Form Field Components
// ============================================================

/* eslint-disable @typescript-eslint/no-explicit-any */

interface TextFieldProps {
  label: string;
  name?: string;
  register: any;
  error?: string;
  placeholder?: string;
  type?: "text" | "email" | "tel" | "number";
  required?: boolean;
}

export function TextField({
  label,
  error,
  placeholder,
  type = "text",
  required,
  register,
}: TextFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-labal-deep mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input type={type} placeholder={placeholder} {...register} className={error ? "border-red-400" : ""} />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

interface TextAreaFieldProps {
  label: string;
  register: any;
  error?: string;
  placeholder?: string;
  rows?: number;
}

export function TextAreaField({
  label,
  error,
  placeholder,
  rows = 3,
  register,
}: TextAreaFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-labal-deep mb-1.5">{label}</label>
      <textarea placeholder={placeholder} rows={rows} {...register} className={error ? "border-red-400" : ""} />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

interface RadioGroupProps {
  label: string;
  name?: string;
  options: readonly string[];
  register: any;
  error?: string;
}

export function RadioGroup({ label, options, register, error }: RadioGroupProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-labal-deep mb-2">{label}</label>
      <div className="radio-group grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((option) => (
          <label key={option} className="cursor-pointer">
            <input type="radio" value={option} {...register} />
            <span>{option}</span>
          </label>
        ))}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

interface CheckboxGroupProps {
  label: string;
  options: readonly string[];
  values: string[];
  onChange: (values: string[]) => void;
  error?: string;
}

export function CheckboxGroup({
  label,
  options,
  values = [],
  onChange,
  error,
}: CheckboxGroupProps) {
  const handleChange = (option: string, checked: boolean) => {
    if (checked) {
      onChange([...values, option]);
    } else {
      onChange(values.filter((v) => v !== option));
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-labal-deep mb-2">{label}</label>
      <div className="checkbox-group grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((option) => (
          <label key={option} className="cursor-pointer">
            <input
              type="checkbox"
              checked={values.includes(option)}
              onChange={(e) => handleChange(option, e.target.checked)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

interface BooleanRadioProps {
  label: string;
  name?: string;
  register: any;
  error?: string;
}

export function BooleanRadio({ label, register, error }: BooleanRadioProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-labal-deep mb-2">{label}</label>
      <div className="radio-group flex gap-3">
        <label className="cursor-pointer">
          <input type="radio" value="true" {...register} />
          <span>Oui</span>
        </label>
        <label className="cursor-pointer">
          <input type="radio" value="false" {...register} />
          <span>Non</span>
        </label>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  options: readonly string[];
  register: any;
  error?: string;
  placeholder?: string;
}

export function SelectField({
  label,
  options,
  register,
  error,
  placeholder = "Sélectionnez...",
}: SelectFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-labal-deep mb-1.5">{label}</label>
      <select {...register} className={error ? "border-red-400" : ""}>
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
