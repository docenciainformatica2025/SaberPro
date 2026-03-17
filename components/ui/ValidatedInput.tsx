"use client";

import React, { InputHTMLAttributes, useState, useEffect } from "react";
import { LucideIcon, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface ValidatedInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    icon?: LucideIcon;
    onValidate?: (value: string) => 'valid' | 'invalid' | 'validating' | 'idle';
    onValueChange?: (value: string) => void;
}

/**
 * ValidatedInput - Input with inline validation
 * Provides immediate visual feedback (WCAG 2.2 compliant - not just color)
 * Uses icons + colors for accessibility
 */
const ValidatedInput = React.forwardRef<HTMLInputElement, ValidatedInputProps>(
    ({
        label,
        error,
        icon: Icon,
        onValidate,
        onValueChange,
        className = "",
        ...props
    }, ref) => {
        const [touched, setTouched] = useState(false);
        const [validationState, setValidationState] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');

        useEffect(() => {
            if (error) {
                setValidationState('invalid');
            } else if (touched && props.value) {
                if (onValidate) {
                    setValidationState(onValidate(String(props.value)));
                } else {
                    setValidationState('valid');
                }
            } else {
                setValidationState('idle');
            }
        }, [error, touched, props.value, onValidate]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!touched) setTouched(true);
            
            // Llama al onChange que viene de RHF (si existe)
            if (props.onChange) {
                props.onChange(e);
            }
            
            // Llama al callback personalizado si existe
            if (onValueChange) {
                onValueChange(e.target.value);
            }
        };

        const getBorderColor = () => {
            if (error || validationState === 'invalid') return 'border-red-500/50 focus:border-red-500';
            if (validationState === 'valid') return 'border-green-500/50 focus:border-green-500';
            return 'border-[var(--theme-border-soft)] focus:border-brand-primary';
        };

        const getValidationIcon = () => {
            if (validationState === 'valid') return <CheckCircle2 size={16} className="text-green-500" />;
            if (validationState === 'invalid' || error) return <AlertCircle size={16} className="text-red-500" />;
            return null;
        };

        return (
            <div className="space-y-2">
                <label className="text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider ml-1">
                    {label}
                </label>

                <div className="relative">
                    {Icon && (
                        <Icon
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--theme-text-quaternary)] pointer-events-none"
                        />
                    )}

                    <input
                        {...props}
                        ref={ref}
                        onChange={handleChange}
                        onBlur={(e) => {
                            setTouched(true);
                            props.onBlur?.(e);
                        }}
                        className={`
                            w-full h-12 rounded-xl border transition-all duration-300
                            bg-[var(--theme-bg-surface)]/50 text-[var(--theme-text-primary)]
                            ${Icon ? 'pl-12' : 'pl-4'} 
                            pr-12
                            placeholder:text-[var(--theme-text-quaternary)]/30
                            focus:outline-none focus:ring-2 focus:ring-offset-0
                            ${getBorderColor()}
                            ${className}
                        `}
                    />

                    {touched && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            {getValidationIcon()}
                        </div>
                    )}
                </div>

                {/* Error/Validation Message */}
                {touched && (error || validationState === 'invalid') && (
                    <p className="text-xs text-red-400 ml-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                        <AlertCircle size={12} />
                        {error || "Campo inválido"}
                    </p>
                )}

                {touched && validationState === 'valid' && !error && (
                    <p className="text-xs text-green-400 ml-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                        <CheckCircle2 size={12} />
                        Campo válido
                    </p>
                )}
            </div>
        );
    }
);

ValidatedInput.displayName = "ValidatedInput";

export default ValidatedInput;
