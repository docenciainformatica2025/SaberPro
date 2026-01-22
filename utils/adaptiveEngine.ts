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
    },

    /**
     * Calcula los puntos de experiencia (XP) ganados en un simulacro.
     */
    calculateXP: (score: number, timeSavedInSeconds: number = 0): number => {
        const baseXP = 50; // Por completar
        const scoreXP = Math.floor((score / 100) * 100); // 1 XP por cada punto de porcentaje
        const speedBonus = Math.floor(Math.max(0, timeSavedInSeconds) / 10); // 1 XP por cada 10s ahorrados
        return baseXP + scoreXP + speedBonus;
    },

    /**
     * Retorna el nivel actual y el progreso hacia el siguiente.
     */
    getLevelData: (xp: number = 0) => {
        // Fórmula de curva: XP = 100 * (Level^1.5)
        const level = Math.floor(Math.pow(xp / 100, 1 / 1.5)) + 1;

        const currentLevelXP = Math.floor(100 * Math.pow(level - 1, 1.5));
        const nextLevelXP = Math.floor(100 * Math.pow(level, 1.5));

        const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

        return {
            level,
            xp,
            nextLevelXP,
            progress: Math.min(100, Math.max(0, progress))
        };
    },

    /**
     * Verifica y retorna nuevos logros desbloqueados.
     */
    checkNewAchievements: (profile: any, score: number, totalQuestions: number, timeLeft: number): string[] => {
        const newBadges: string[] = [];
        const currentBadges = profile?.gamification?.badges || [];

        // 1. Primer Simulacro
        if (currentBadges.length === 0 && !currentBadges.includes('first_step')) {
            newBadges.push('first_step');
        }

        // 2. Puntaje Perfecto
        if (score === totalQuestions && totalQuestions >= 5 && !currentBadges.includes('perfect_score')) {
            newBadges.push('perfect_score');
        }

        // 3. Demonio de la Velocidad (ahorró más del 50% del tiempo)
        // Asumiendo 15 mins por defecto (900s) si no se provee total. 
        // Mejor simplificar: si ahorró más de 5 minutos.
        if (timeLeft > 300 && score / totalQuestions > 0.7 && !currentBadges.includes('speed_demon')) {
            newBadges.push('speed_demon');
        }

        return newBadges;
    }
};
