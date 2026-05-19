"use client";
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2 w-full">
        {label && (
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full bg-slate-50 border border-slate-200 rounded-2xl px-8 py-5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all ${className}`}
          {...props}
        />
        {error && <p className="text-xs font-semibold text-destructive px-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
