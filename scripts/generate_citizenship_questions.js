const fs = require('fs');
const path = require('path');
const { generateId } = require('./utils/idGenerator');

const TOTAL_QUESTIONS = 600;
const COUNTS = {
    media: Math.floor(TOTAL_QUESTIONS * 0.5),
    media_alta: Math.floor(TOTAL_QUESTIONS * 0.3),
    avanzada: Math.floor(TOTAL_QUESTIONS * 0.2)
};

const TEMPLATES = [
    // --- CONSTITUTION (Rights & Mechanisms) ---
    {
        type: "constitution_rights",
        difficulty: "media",
        generate: () => {
            const rights = ["la vida", "la libertad de expresión", "el debido proceso", "la intimidad", "la libre asociación", "la salud", "la educación", "el trabajo"];
            const violations = [
                { act: "censurar un periódico sin causa legal", right: "la libertad de expresión", mech: "acción de tutela" },
                { act: "detener a alguien sin orden judicial", right: "la libertad personal", mech: "habeas corpus" },
                { act: "publicar fotos privadas sin permiso", right: "la intimidad", mech: "acción de tutela" },
                { act: "prohibir una reunión pacífica", right: "la libre asociación", mech: "acción de tutela" },
                { act: "negar atención médica vital de urgencia", right: "la salud", mech: "acción de tutela" },
                { act: "despedir a una mujer por estar embarazada", right: "la estabilidad laboral", mech: "acción de tutela" },
                { act: "solicitar información pública y ser ignorado", right: "petición", mech: "acción de cumplimiento" } // Simplified logic
            ];

            const item = violations[Math.floor(Math.random() * violations.length)];

            return {
                text: `Un ciudadano considera que se ha vulnerado su derecho a ${item.right} al ${item.act}. ¿Cuál es el mecanismo constitucional más idóneo para proteger este derecho de manera inmediata?`,
                correct: item.mech,
                distractors: [
                    "Demanda civil ordinaria",
                    "Queja ante la policía",
                    "Recolección de firmas",
                    "Consulta popular"
                ].filter(d => d !== item.mech).slice(0, 3),
                explanation: `El mecanismo preferente es la ${item.mech} dado que se busca proteger un derecho fundamental de manera inmediata.`
            };
        }
    },
    // --- MULTIPERSPECTIVISM (Conflicts) ---
    {
        type: "multiperspectivism",
        difficulty: "media_alta",
        generate: () => {
            const conflicts = [
                { topic: "la construcción de una represa", actor: "la comunidad local", interest: "la protección del ecosistema y sus viviendas", perspective: "rechazar el proyecto si no hay garantías ambientales" },
                { topic: "la minería en páramos", actor: "la empresa minera", interest: "el desarrollo económico y la inversión", perspective: "promover la extracción responsable con regalías" },
                { topic: "el uso de glifosato", actor: "el gobierno", interest: "la erradicación eficiente de cultivos ilícitos", perspective: "usar herramientas efectivas contra el narcotráfico" },
                { topic: "la regulación de plataformas de transporte", actor: "el gremio de taxistas", interest: "la competencia leal y regulación igualitaria", perspective: "exigir las mismas condiciones legales para todos" }
            ];

            const item = conflicts[Math.floor(Math.random() * conflicts.length)];

            return {
                text: `En el debate sobre ${item.topic}, ${item.actor} argumenta priorizando ${item.interest}. ¿Cuál de los siguientes enunciados describe mejor una perspectiva COMPATIBLE con este actor?`,
                correct: item.perspective,
                distractors: [
                    "Abandonar sus intereses por el bien común abstracto",
                    "No opinar al respecto",
                    "Apoyar ciegamente a la contraparte"
                ],
                explanation: `Si la prioridad del actor es ${item.interest}, su postura lógica sería ${item.perspective}.`
            };
        }
    },
    // --- CONSTITUTIONAL CONFLICTS - UPDATED 2026 ---
    {
        type: "constitutional_conflicts",
        difficulty: "avanzada",
        generate: () => {
            const scenarios = [
                {
                    text: "Un medio de comunicación publica la orientación sexual de un funcionario público alegando 'interés general', pero el funcionario demanda alegando su derecho a la intimidad.",
                    question: "En este choque de derechos, ¿qué criterio suele aplicar la Corte Constitucional para resolverlo?",
                    correct: "El test de proporcionalidad: evaluar si la revelación es necesaria, idónea y proporcional para el fin buscado.",
                    explanation: "En conflictos de derechos constitucionales de igual jerarquía, se aplica la ponderación basada en la proporcionalidad.",
                    distractors: ["Priorizar siempre la libertad de prensa sobre cualquier otro derecho.", "Darle la razón a quien interponga la tutela primero.", "Ignorar el caso por ser de ámbito privado."]
                },
                {
                    text: "En una consulta previa, una minoría étnica rechaza un proyecto minero avalado por el interés nacional de crecimiento económico.",
                    question: "¿Qué principio fundamental de la Constitución de 1991 se encuentra en tensión aquí?",
                    correct: "Diversidad étnica y cultural vs. Utilidad pública e interés social.",
                    explanation: "La Constitución colombiana protege la diversidad como valor fundamental, lo que a veces choca con metas extractivas o nacionales.",
                    distractors: ["Derecho a la educación vs. Derecho al trabajo.", "Derecho de petición vs. Libertad de expresión.", "Autonomía regional vs. Centralismo absoluto."]
                },
                {
                    text: "El Estado decide expropiar un terreno privado para construir una vía 4G, ofreciendo una indemnización que el dueño considera insuficiente en comparación con el valor comercial.",
                    question: "¿Bajo qué figura jurídica el Estado justifica priorizar la construcción de la vía?",
                    correct: "La prevalencia del interés general sobre el interés particular.",
                    explanation: "Aunque se protege la propiedad privada, el interés de la comunidad por la infraestructura vial prevalece, siempre que haya indemnización.",
                    distractors: ["El derecho a la libre locomoción.", "La soberanía nacional.", "El estado de sitio."]
                }
            ];

            const sc = scenarios[Math.floor(Math.random() * scenarios.length)];

            return {
                text: `${sc.text}\n\n${sc.question}`,
                correct: sc.correct,
                distractors: sc.distractors,
                explanation: sc.explanation
            };
        }
    }
];

function generateQuestions() {
    const questions = [];

    const generateBatch = (count, difficulty) => {
        let pool = TEMPLATES;
        if (difficulty === 'media') pool = TEMPLATES.filter(t => t.type === 'constitution_rights');
        if (difficulty === 'media_alta') pool = TEMPLATES.filter(t => t.type === 'multiperspectivism');
        if (difficulty === 'avanzada') pool = TEMPLATES.filter(t => t.type === 'systemic_thinking');

        if (pool.length === 0) pool = TEMPLATES;

        for (let i = 0; i < count; i++) {
            const template = pool[Math.floor(Math.random() * pool.length)];
            const qData = template.generate();

            const options = [
                { id: "a", text: qData.correct },
                { id: "b", text: qData.distractors[0] },
                { id: "c", text: qData.distractors[1] },
                { id: "d", text: qData.distractors[2] }
            ].sort(() => Math.random() - 0.5);

            const finalOptions = options.map((opt, idx) => ({
                id: ["a", "b", "c", "d"][idx],
                text: opt.text
            }));

            const correctAnswerId = finalOptions.find(o => o.text === qData.correct).id;

            // Generate deterministic ID
            const qId = generateId("competencias_ciudadanas", qData.text, qData.correct);

            questions.push({
                id: qId,
                module: "competencias_ciudadanas",
                text: qData.text,
                options: finalOptions,
                correctAnswer: correctAnswerId,
                explanation: qData.explanation,
                difficulty: difficulty
            });
        }
    };

    generateBatch(COUNTS.media, 'media');
    generateBatch(COUNTS.media_alta, 'media_alta');
    generateBatch(COUNTS.avanzada, 'avanzada');

    return questions;
}

const data = generateQuestions();
fs.writeFileSync(path.join(__dirname, '../data/questions-citizenship.json'), JSON.stringify(data, null, 2));
console.log(`Generated ${data.length} citizenship questions.`);
