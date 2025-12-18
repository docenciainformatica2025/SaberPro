import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Simulacros Saber Pro | Entrenamiento Real e Inteligente",
    description: "Realiza simulacros completos o prácticos por módulos (Inglés, Lectura Crítica, Matemáticas). Basado en el estándar oficial del ICFES.",
};

export default function SimulationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
