import React from 'react';
import { BRAND_YEAR } from "@/lib/config";

interface LogoProps {
    className?: string;
    variant?: 'full' | 'icon-only';
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = React.memo(({
    className = '',
    variant = 'full',
    size = 'md'
}) => {
    // ... logic remains same ...
    const sizes = {
        sm: { box: 'h-6 w-6', text: 'text-sm', sub: 'text-[0.45rem]' },
        md: { box: 'h-8 w-8', text: 'text-base', sub: 'text-[0.55rem]' },
        lg: { box: 'h-10 w-10', text: 'text-lg', sub: 'text-[0.65rem]' },
        xl: { box: 'h-14 w-14', text: 'text-3xl', sub: 'text-base' },
    };

    const currentSize = sizes[size];

    return (
        <div
            className={`flex items-center gap-3 select-none group cursor-pointer ${className}`}
            role="img"
            aria-label="SaberPro Logo - Propuesta El Pliegue"
        >
            {/* --- ISOTIPO: EL PLIEGUE (Propuesta 3) --- */}
            <div className={`${currentSize.box} relative flex items-center justify-center transition-all duration-700 ease-elastic group-hover:rotate-6`}>
                {/* Background Glow for Premium Feel */}
                <div className="absolute inset-0 bg-brand-primary/20 blur-lg rounded-full scale-0 group-hover:scale-150 transition-transform duration-1000" />

                <svg
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full drop-shadow-2xl relative z-10"
                >
                    {/* Faceted Shield (Dodecahedron-inspired) */}
                    <path
                        d="M50 5 L89 27.5 V72.5 L50 95 L11 72.5 V27.5 L50 5Z"
                        fill="var(--brand-primary)"
                        className="opacity-90"
                    />

                    {/* Facet Lines (Precision) */}
                    <path d="M50 5 V95" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" />
                    <path d="M11 27.5 L89 27.5" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" />
                    <path d="M11 72.5 L89 72.5" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" />
                    <path d="M11 27.5 L50 50 L89 27.5" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" />
                    <path d="M11 72.5 L50 50 L89 72.5" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" />

                    {/* The "S" Curve (Human Connection) - Negative Space Pliegue */}
                    <path
                        d="M35 35 
                           Q 50 20, 65 35
                           C 80 50, 20 50, 35 65
                           Q 50 80, 65 65"
                        stroke="#F1F0E8"
                        strokeWidth="8"
                        strokeLinecap="round"
                        fill="none"
                        className="drop-shadow-md"
                    />

                    {/* Detail: Precision Fold */}
                    <circle cx="50" cy="50" r="2" fill="white" fillOpacity="0.5" />
                </svg>
            </div>

            {/* --- LOGOTIPO (El Texto) --- */}
            {variant === 'full' && (
                <div className="flex flex-col leading-none">
                    <span className={`font-black tracking-tighter text-theme-text-primary ${currentSize.text} italic uppercase`}>
                        Saber<span className="text-brand-primary font-black">Pro</span>
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className={`font-bold uppercase tracking-[0.4em] text-theme-text-tertiary opacity-60 ${currentSize.sub}`}>
                            Elite Suite
                        </span>
                        <div className="w-1 h-1 rounded-full bg-brand-primary/40" />
                        <span className={`font-bold text-brand-primary/80 ${currentSize.sub} tracking-widest uppercase`}>
                            {BRAND_YEAR}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
});

Logo.displayName = "Logo";
