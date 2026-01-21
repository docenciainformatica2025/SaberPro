"use client";

import { InputHTMLAttributes, useState, useEffect } from "react";
import { LucideIcon, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface ValidatedInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    label: string;
    error?: string;
    icon?: LucideIcon;
    onValidate?: (value: string) => 'valid' | 'invalid' | 'validating' | 'idle';
    onChange?: (value: string) => void;
}

/**
 * ValidatedInput - Input with inline validation
 * Provides immediate visual feedback (WCAG 2.2 compliant - not just color)
 * Uses icons + colors for accessibility
 */
export default function ValidatedInput({
    label,
    error,
    icon: Icon,
    onValidate,
    onChange,
    className = "",
    ...props
}: ValidatedInputProps) {
    const [value, setValue] = useState("");
    const [validationState, setValidationState] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
    const [touched, setTouched] = useState(false);

    useEffect(() => {
        if (!onValidate || !touched || !value) return;

        const timer = setTimeout(() => {
            const state = onValidate(value);
            setValidationState(state);
        }, 300); // Debounce validation

        return () => clearTimeout(timer);
    }, [value, onValidate, touched]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        onChange?.(newValue);

        if (!touched) setTouched(true);
        if (onValidate) {
            setValidationState('validating');
        }
    };

    const getBorderColor = () => {
        if (error || validationState === 'invalid') return 'border-red-500/50 focus:border-red-500';
        if (validationState === 'valid') return 'border-green-500/50 focus:border-green-500';
        if (validationState === 'validating') return 'border-yellow-500/50 focus:border-yellow-500';
        return 'border-metal-silver/10 focus:border-metal-gold';
    };

    const getValidationIcon = () => {
        if (validationState === 'validating') return <Loader2 size={16} className="text-yellow-500 animate-spin" />;
        if (validationState === 'valid') return <CheckCircle2 size={16} className="text-green-500" />;
        if (validationState === 'invalid' || error) return <AlertCircle size={16} className="text-red-500" />;
        return null;
    };

    return (
        <div className="space-y-2">
            <label className="text-xs font-semibold text-metal-silver/80 uppercase tracking-wider ml-1">
                {label}
            </label>

            <div className="relative">
                {Icon && (
                    <Icon
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-metal-silver/40 pointer-events-none"
                    />
                )}

                <input
                    {...props}
                    value={value}
                    onChange={handleChange}
                    className={`
                        w-full h-12 rounded-xl border transition-all duration-300
                        bg-metal-dark/50 text-white
                        ${Icon ? 'pl-12' : 'pl-4'} 
                        pr-12
                        placeholder:text-metal-silver/30
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
