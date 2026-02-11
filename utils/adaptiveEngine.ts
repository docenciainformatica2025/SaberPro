export interface AdaptiveAdvice {
    criticalModule: { name: string; value: number };
    strengthModule: { name: string; value: number };
    overallStatus: 'excellent' | 'good' | 'improving' | 'critical';
    advice: string;
    actionStep: string;
    nextRecommendedModule: string;
}

export const adaptiveEngine = {
    analyzeProfile: (radarData: any[], kpis: any, userProfile?: any): AdaptiveAdvice => {
        if (!radarData || radarData.length === 0) {
            return {
                criticalModule: { name: "Lectura Crítica", value: 0 },
                strengthModule: { name: "General", value: 0 },
                overallStatus: 'improving',
                advice: userProfile?.career
                    ? `Como estudiante de ${userProfile.career}, te recomendamos iniciar con Lectura Crítica.`
                    : "Aún no hay suficientes datos para un análisis detallado. Completa más simulacros.",
                actionStep: "Realizar un simulacro general para establecer una base.",
                nextRecommendedModule: "Lectura Crítica"
            };
        }

        // Encontrar punto más bajo y más alto
        const sorted = [...radarData].sort((a, b) => a.value - b.value);
        const critical = sorted[0];
        const strength = sorted[sorted.length - 1];

        const avg = kpis.averageScore;
        const goal = userProfile?.goal || 'excellence';

        let status: AdaptiveAdvice['overallStatus'] = 'improving';
        if (avg >= 85) status = 'excellent';
        else if (avg >= 70) status = 'good';
        else if (avg >= 50) status = 'improving';
        else status = 'critical';

        let advice = "";
        let actionStep = "";

        // Career-aware advice logic
        const careerContext = userProfile?.career ? `Para tu perfil en ${userProfile.career}, ` : "";

        if (status === 'excellent' && goal === 'excellence') {
            advice = `${careerContext}Mantienes un nivel excepcional. Estás en el top nacional.`;
            actionStep = "Práctica " + critical.name + " para asegurar el puntaje máximo.";
        } else if (status === 'good') {
            advice = `${careerContext}Tienes bases sólidas. Tu fortaleza es ${strength.name}, pero ${critical.name} necesita atención.`;
            actionStep = "Realiza un entrenamiento intensivo en " + critical.name;
        } else {
            advice = `${careerContext}Se observa progreso, pero el enfoque en ${critical.name} es vital para alcanzar tu meta de ${goal === 'excellence' ? 'Excelencia' : 'mejora'}.`;
            actionStep = "Usa el simulacro modular de " + critical.name;
        }

        return {
            criticalModule: critical,
            strengthModule: strength,
            overallStatus: status,
            advice,
            actionStep,
            nextRecommendedModule: critical.name
        };
    },

    /**
     * Determines the next best step for the user based on their current state.
     */
    getRecommendedAction: (stats: any, profile: any) => {
        if (!stats || stats.totalSims === 0) {
            return {
                type: 'DIAGNOSTIC',
                module: 'Lectura Crítica',
                reason: 'Establecer línea base',
                priority: 'high'
            };
        }

        const critical = stats.radarData.sort((a: any, b: any) => a.value - b.value)[0];

        if (critical.value < 60) {
            return {
                type: 'STUDY',
                module: critical.name,
                reason: `Dominio bajo (${critical.value}%)`,
                priority: 'critical'
            };
        }

        return {
            type: 'PRACTICE',
            module: stats.radarData[0].name, // Switch to next or keep improving
            reason: 'Mantener consistencia',
            priority: 'normal'
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
