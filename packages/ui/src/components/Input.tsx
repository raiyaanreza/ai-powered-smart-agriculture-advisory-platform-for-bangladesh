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
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full bg-slate-50 border border-slate-200 rounded-2xl px-8 py-5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#052E16]/5 transition-all ${className}`}
          {...props}
        />
        {error && <p className="text-xs font-black text-rose-500 px-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
