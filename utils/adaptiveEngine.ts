export interface AdaptiveAdvice {
    criticalModule: { name: string; value: number };
    strengthModule: { name: string; value: number };
    overallStatus: 'excellent' | 'good' | 'improving' | 'critical';
    advice: string;
    actionStep: string;
    nextRecommendedModule: string;
}

export const adaptiveEngine = {
    analyzeProfile: (radarData: any[], kpis: any): AdaptiveAdvice => {
        if (!radarData || radarData.length === 0) {
            return {
                criticalModule: { name: "N/A", value: 0 },
                strengthModule: { name: "N/A", value: 0 },
                overallStatus: 'improving',
                advice: "Aún no hay suficientes datos para un análisis detallado. Completa más simulacros.",
                actionStep: "Realizar un simulacro general para establecer una base.",
                nextRecommendedModule: "Lectura Crítica"
            };
        }

        // Encontrar punto más bajo y más alto (excluyendo los de valor 0 si es posible)
        const sorted = [...radarData].sort((a, b) => a.value - b.value);
        const critical = sorted[0];
        const strength = sorted[sorted.length - 1];

        const avg = kpis.averageScore;
        let status: AdaptiveAdvice['overallStatus'] = 'improving';
        if (avg >= 85) status = 'excellent';
        else if (avg >= 70) status = 'good';
        else if (avg >= 50) status = 'improving';
        else status = 'critical';

        let advice = "";
        let actionStep = "";
        let nextModule = critical.name;

        if (status === 'excellent') {
            advice = `Mantienes un nivel excepcional en ${strength.name}. Tu perfil es altamente competitivo.`;
            actionStep = "Enfócate en la gestión del tiempo para limar los últimos segundos de duda.";
        } else if (status === 'good') {
            advice = `Tienes bases sólidas, especialmente en ${strength.name}. El reto ahora es elevar tu rendimiento en ${critical.name}.`;
            actionStep = "Realiza 3 sesiones cortas de entrenamiento enfocadas únicamente en temas de " + critical.name;
        } else {
            advice = `Se observa una brecha importante en ${critical.name} (${critical.value}%). Esto podría estar afectando tu puntaje global de ${avg}%.`;
            actionStep = "Usa el modo Entrenamiento con IA para recibir explicaciones paso a paso en " + critical.name;
        }

        return {
            criticalModule: critical,
            strengthModule: strength,
            overallStatus: status,
            advice,
            actionStep,
            nextRecommendedModule: nextModule
        };
    }
};
