import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ReactNode } from "react";

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
        gold: { bg: 'bg-metal-gold/10', text: 'text-metal-gold', border: 'border-metal-gold/20' },
        blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
        purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
        green: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
    }[color] || { bg: 'bg-white/5', text: 'text-white', border: 'border-white/10' };

    return (
        <Card variant="solid" className="p-6 relative overflow-hidden group hover:border-white/10 transition-colors">
            <div className={`absolute top-0 right-0 w-24 h-24 ${theme.bg} rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-30 group-hover:opacity-60 transition-opacity`}></div>

            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`p-3 rounded-2xl ${theme.bg} ${theme.text} border ${theme.border} shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                    {icon}
                </div>
                <Badge variant={trendUp ? 'success' : 'error'} className="text-[10px] font-black tracking-widest uppercase">
                    {trend}
                </Badge>
            </div>

            <div className="relative z-10">
                <h3 className="text-3xl font-black text-white tracking-tighter tabular-nums mb-1">{value}</h3>
                <p className="text-metal-silver/40 text-[10px] font-black uppercase tracking-widest leading-none">{title}</p>
            </div>
        </Card>
    );
}

// Default export for ease of import
export default StatCardPremium;
