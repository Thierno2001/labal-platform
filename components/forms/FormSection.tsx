"use client";

import { ReactNode } from "react";
import { AlertCircle, Check } from "lucide-react";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <div className="bg-white border border-labal-deep/10 rounded-2xl p-5 sm:p-7 shadow-xs hover:shadow-sm transition-all duration-300">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-labal-deep tracking-tight flex items-center gap-2">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-labal-gray-dark mt-1 leading-relaxed">
            {description}
          </p>
        )}
        <div className="mt-3 h-1 w-12 bg-gradient-to-r from-labal-lime to-labal-deep rounded-full" />
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
}

// ============================================================
// Reusable Form Field Components (Touch Targets >= 48px)
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
    <div className="space-y-1.5">
      <label className="block text-xs sm:text-sm font-bold text-labal-deep uppercase tracking-wider">
        {label}
        {required && <span className="text-red-500 ml-1 font-black">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        {...register}
        className={`form-input-styled ${
          error ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-200" : ""
        }`}
      />
      {error && (
        <p className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
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
    <div className="space-y-1.5">
      <label className="block text-xs sm:text-sm font-bold text-labal-deep uppercase tracking-wider">
        {label}
      </label>
      <textarea
        placeholder={placeholder}
        rows={rows}
        {...register}
        className={`form-input-styled py-3 resize-y ${
          error ? "border-red-400 bg-red-50/30" : ""
        }`}
      />
      {error && (
        <p className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
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
    <div className="space-y-2">
      <label className="block text-xs sm:text-sm font-bold text-labal-deep uppercase tracking-wider">
        {label}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {options.map((option) => (
          <label key={option} className="radio-card-option touch-target">
            <input
              type="radio"
              value={option}
              {...register}
              className="w-4 h-4 text-labal-lime focus:ring-labal-lime border-gray-300"
            />
            <span className="text-sm font-semibold text-labal-deep">{option}</span>
          </label>
        ))}
      </div>
      {error && (
        <p className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
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
    <div className="space-y-2">
      <label className="block text-xs sm:text-sm font-bold text-labal-deep uppercase tracking-wider">
        {label}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {options.map((option) => {
          const isChecked = values.includes(option);
          return (
            <label
              key={option}
              className={`radio-card-option touch-target ${
                isChecked ? "border-labal-lime bg-labal-lime/10 shadow-xs" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => handleChange(option, e.target.checked)}
                className="w-4 h-4 text-labal-lime rounded focus:ring-labal-lime border-gray-300"
              />
              <span className="text-sm font-semibold text-labal-deep">{option}</span>
            </label>
          );
        })}
      </div>
      {error && (
        <p className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
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
    <div className="space-y-2">
      <label className="block text-xs sm:text-sm font-bold text-labal-deep uppercase tracking-wider">
        {label}
      </label>
      <div className="flex gap-3">
        <label className="radio-card-option flex-1 justify-center touch-target">
          <input
            type="radio"
            value="true"
            {...register}
            className="w-4 h-4 text-labal-lime focus:ring-labal-lime border-gray-300"
          />
          <span className="text-sm font-bold text-labal-deep flex items-center gap-1">
            <Check className="w-4 h-4 text-labal-lime" /> Oui
          </span>
        </label>
        <label className="radio-card-option flex-1 justify-center touch-target">
          <input
            type="radio"
            value="false"
            {...register}
            className="w-4 h-4 text-labal-lime focus:ring-labal-lime border-gray-300"
          />
          <span className="text-sm font-bold text-labal-deep">Non</span>
        </label>
      </div>
      {error && (
        <p className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
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
  placeholder = "Sélectionnez une option...",
}: SelectFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs sm:text-sm font-bold text-labal-deep uppercase tracking-wider">
        {label}
      </label>
      <select
        {...register}
        className={`form-input-styled appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23064420%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-[right_1.25rem_center] bg-no-repeat pr-10 ${
          error ? "border-red-400 bg-red-50/30" : ""
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
