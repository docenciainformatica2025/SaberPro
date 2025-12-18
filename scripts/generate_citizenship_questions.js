const fs = require('fs');
const path = require('path');

const TOTAL_QUESTIONS = 150;
const COUNTS = {
    media: 100,
    media_alta: 30,
    avanzada: 20
};

const TEMPLATES = [
    {
        type: "constitution_rights",
        difficulty: "media",
        generate: () => {
            const rights = ["la vida", "la libertad de expresión", "el debido proceso", "la intimidad", "la libre asociación"];
            const violations = ["censurar un periódico", "detener a alguien sin orden judicial", "publicar fotos privadas sin permiso", "prohibir una reunión pacífica", "negar atención médica vital"];
            const actions = ["acción de tutela", "derecho de petición", "habeas corpus", "acción popular"];

            const right = rights[Math.floor(Math.random() * rights.length)];
            const violation = violations[Math.floor(Math.random() * violations.length)];

            // Basic logic linking violation to mechanism
            let correctAction = "acción de tutela";
            let logic = "proteger derechos fundamentales";

            if (violation.includes("detener")) {
                correctAction = "habeas corpus";
                logic = "proteger la libertad personal ante detenciones arbitrarias";
            }

            return {
                text: `Un ciudadano considera que se ha vulnerado su derecho a ${right} al ${violation}. ¿Cuál es el mecanismo constitucional más idóneo para proteger este derecho de manera inmediata?`,
                correct: correctAction,
                distractors: [
                    "Demanda civil ordinaria",
                    "Queja ante la policía",
                    "Recolección de firmas"
                ].filter(d => d !== correctAction),
                explanation: `La ${correctAction} es el mecanismo preferente para ${logic} cuando no existen otros medios eficaces.`
            };
        }
    },
    {
        type: "multiperspectivism",
        difficulty: "media_alta",
        generate: () => {
            const conflicts = ["la construcción de una represa", "la minería en páramos", "el uso de glifosato", "la regulación de plataformas de transporte"];
            const actors = ["la comunidad local", "la empresa privada", "el gobierno nacional", "los grupos ambientalistas"];
            const interests = ["el desarrollo económico", "la protección del ecosistema", "la generación de empleo", "la soberanía nacional"];

            const conflict = conflicts[Math.floor(Math.random() * conflicts.length)];
            const actor = actors[Math.floor(Math.random() * actors.length)];
            const interest = interests[Math.floor(Math.random() * interests.length)];

            return {
                text: `En el debate sobre ${conflict}, ${actor} argumenta priorizando ${interest}. ¿Cuál de los siguientes enunciados describe mejor una perspectiva COMPATIBLE con este actor?`,
                correct: `Es necesario fomentar ${interest} aunque implique sacrificios menores.`,
                distractors: [
                    `Se debe prohibir totalmente ${conflict} sin excepciones.`,
                    `El único interés válido es el de la contraparte.`,
                    `El estado no debe intervenir en absoluto.`
                ],
                explanation: `Si la prioridad del actor es ${interest}, buscará medidas que lo favorezcan o lo maximicen en el contexto de ${conflict}.`
            };
        }
    },
    {
        type: "systemic_thinking",
        difficulty: "avanzada",
        generate: () => {
            const problems = ["el desempleo juvenil", "la inseguridad urbana", "la corrupción administrativa", "la informalidad laboral"];
            const measures = ["aumentar las penas de cárcel", "reducir los impuestos a empresas", "militarizar las calles", "subsidiar el primer empleo"];
            const consequences = ["hacinamiento carcelario a largo plazo", "déficit fiscal", "violación de derechos humanos", "precarización laboral futura"];

            const problem = problems[Math.floor(Math.random() * problems.length)];
            const measure = measures[Math.floor(Math.random() * measures.length)];
            const consequence = consequences[Math.floor(Math.random() * consequences.length)];

            return {
                text: `Para combatir ${problem}, un alcalde propone ${measure}. Un analista advierte que esta medida, aunque popular, podría generar ${consequence} como efecto no deseado. ¿Qué dimensión del problema está privilegiando el analista?`,
                correct: "El impacto estructural a largo plazo.",
                distractors: [
                    "La popularidad inmediata de la medida.",
                    "El costo político para el alcalde.",
                    "La opinión de los medios de comunicación."
                ],
                explanation: `El analista está evaluando consecuencias sistémicas de segundo orden (${consequence}) más allá de la solución inmediata.`
            };
        }
    }
];

function generateQuestions() {
    const questions = [];

    const generateBatch = (count, difficulty) => {
        const templates = TEMPLATES.filter(t => t.difficulty === difficulty || (difficulty === 'media' && t.difficulty === 'media'));
        const pool = templates.length > 0 ? templates : TEMPLATES;

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

            questions.push({
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
