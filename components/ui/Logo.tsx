import React from 'react';
import { BRAND_YEAR } from "@/lib/config";

interface LogoProps {
    className?: string;
    variant?: 'full' | 'icon-only';
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({
    className = '',
    variant = 'full',
    size = 'md'
}) => {

    // Tamaños escalables
    const sizes = {
        sm: { box: 'h-8 w-8', text: 'text-lg', sub: 'text-[0.6rem]' },
        md: { box: 'h-10 w-10', text: 'text-xl', sub: 'text-xs' },
        lg: { box: 'h-12 w-12', text: 'text-2xl', sub: 'text-sm' },
        xl: { box: 'h-16 w-16', text: 'text-4xl', sub: 'text-base' },
    };

    const currentSize = sizes[size];

    return (
        <div className={`flex items-center gap-3 select-none ${className}`}>

            {/* --- ISOTIPO (El Símbolo) --- */}
            <div className={`
        relative flex items-center justify-center 
        ${currentSize.box} 
        rounded-xl 
        bg-gradient-to-br from-[#F4C430] via-[#D4AF37] to-[#8C621D] 
        shadow-[0_0_15px_rgba(212,175,55,0.3)] 
        border border-[#F4C430]/30
      `}>
                {/* SVG Geométrico Personalizado de la 'S' */}
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-[60%] h-[60%] text-[#0A0C0F]"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M6.75 4.5C5.50736 4.5 4.5 5.50736 4.5 6.75V9.75C4.5 10.9926 5.50736 12 6.75 12H13.5C14.3284 12 15 12.6716 15 13.5V15.75C15 16.5784 14.3284 17.25 13.5 17.25H6C5.58579 17.25 5.25 17.5858 5.25 18C5.25 18.4142 5.58579 18.75 6 18.75H13.5C15.1569 18.75 16.5 17.4069 16.5 15.75V13.5C16.5 12.2574 15.4926 11.25 14.25 11.25H7.5C6.67157 11.25 6 10.5784 6 9.75V6.75C6 5.92157 6.67157 5.25 7.5 5.25H18C18.4142 5.25 18.75 4.91421 18.75 4.5C18.75 4.08579 18.4142 3.75 18 3.75H7.5C6.25736 3.75 5.25 4.75736 5.25 6H6.75C6.75 5.17157 7.42157 4.5 8.25 4.5H6.75Z"
                        fill="currentColor"
                        className="drop-shadow-sm"
                    />
                    <path d="M16 4.5L19 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-80" />
                </svg>

                {/* Brillo especular (Glass effect) */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-50"></div>
            </div>

            {/* --- LOGOTIPO (El Texto) --- */}
            {variant === 'full' && (
                <div className="flex flex-col leading-none">
                    <span className={`font-bold tracking-tight text-white ${currentSize.text} whitespace-nowrap`}>
                        Saber
                    </span>
                    <div className="flex items-center gap-1">
                        <span className={`font-black uppercase tracking-[0.2em] text-[#D4AF37] ${currentSize.sub}`}>
                            Pro
                        </span>
                        <span className={`font-black text-slate-500/80 ${currentSize.sub}`}>
                            {BRAND_YEAR}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};
