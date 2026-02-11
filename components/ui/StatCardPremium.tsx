import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ReactNode } from "react";
import NumberTicker from "@/components/ui/NumberTicker";

interface StatCardPremiumProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    trend: string;
    trendUp: boolean;
    color: 'gold' | 'blue' | 'purple' | 'green';
}

export function StatCardPremium({ title, value, icon, trend, trendUp, color }: StatCardPremiumProps) {
    const theme = {
        gold: { bg: 'bg-brand-primary/10', text: 'text-brand-primary', border: 'border-brand-primary/20 shadow-sm shadow-brand-primary/5' },
        blue: { bg: 'bg-brand-primary/10', text: 'text-brand-primary', border: 'border-brand-primary/20 shadow-sm shadow-brand-primary/5' },
        purple: { bg: 'bg-brand-accent/10', text: 'text-brand-accent', border: 'border-brand-accent/20 shadow-sm shadow-brand-accent/5' },
        green: { bg: 'bg-brand-success/10', text: 'text-brand-success', border: 'border-brand-success/20 shadow-sm shadow-brand-success/5' },
    }[color] || { bg: 'bg-surface-card', text: 'text-theme-text-primary', border: 'border-theme-border-soft' };

    const isNumeric = typeof value === 'number' || (!isNaN(Number(value)) && typeof value === 'string' && !value.includes('%'));
    const numericValue = typeof value === 'number' ? value : Number(value);

    return (
        <Card variant="solid" className="p-6 relative overflow-hidden group hover:border-brand-primary/30 transition-all duration-500 shadow-[var(--shadow-4k)] border-[0.5px]">
            <div className={`absolute top-0 right-0 w-24 h-24 ${theme.bg} rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-20 group-hover:opacity-40 transition-opacity`}></div>

            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`p-3 rounded-[var(--radius-md)] ${theme.bg} ${theme.text} border ${theme.border} group-hover:scale-110 transition-transform duration-500`}>
                    {icon}
                </div>
                <Badge variant={trendUp ? 'success' : 'error'} className="text-[10px font-semibold tracking-wider uppercase shadow-none">
                    {trend}
                </Badge>
            </div>

            <div className="relative z-10">
                <h3 className="text-4xl font-bold text-[var(--theme-text-primary)] tracking-tight tabular-nums mb-1">
                    {isNumeric ? (
                        <NumberTicker value={numericValue} />
                    ) : (
                        value
                    )}
                    {typeof value === 'string' && value.includes('%') && '%'}
                </h3>
                <p className="text-[var(--theme-text-tertiary)] text-xs font-black uppercase tracking-widest leading-none">
                    {title}
                </p>
            </div>
        </Card>
    );
}

export default StatCardPremium;
