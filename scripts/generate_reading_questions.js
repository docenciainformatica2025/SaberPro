const fs = require('fs');
const path = require('path');
const { generateId } = require('./utils/idGenerator');

const TOTAL_QUESTIONS = 600;
const COUNTS = {
    media: Math.floor(TOTAL_QUESTIONS * 0.5),
    media_alta: Math.floor(TOTAL_QUESTIONS * 0.3),
    avanzada: Math.floor(TOTAL_QUESTIONS * 0.2)
};

// Bases para generar textos "semi-coherentes" proceduralmente para pruebas
const TEMPLATES = [
    // --- ARGUMENTATION (Conectores) ---
    {
        type: "argumentation",
        difficulty: "media",
        generate: () => {
            const topics = ["el cambio climático", "la inteligencia artificial", "la democracia digital", "la educación virtual", "la economía colaborativa", "el teletrabajo", "la biotecnología"];
            const stances = ["es fundamental para el progreso", "plantea riesgos ineludibles", "requiere regulación inmediata", "transformará nuestra sociedad", "es una moda pasajera", "debe ser prioridad nacional"];

            const connectors = [
                { word: "Sin embargo,", func: "Introducir una idea que contrasta o limita la anterior" },
                { word: "Por consiguiente,", func: "Introducir una consecuencia lógica de lo anterior" },
                { word: "Además,", func: "Añadir información que refuerza el argumento" },
                { word: "En contraste,", func: "Señalar una diferencia u oposición directa" },
                { word: "Es decir,", func: "Aclarar o explicar la idea precedente" }
            ];

            const topic = topics[Math.floor(Math.random() * topics.length)];
            const stance = stances[Math.floor(Math.random() * stances.length)];
            const conn = connectors[Math.floor(Math.random() * connectors.length)];

            const text = `Muchos expertos afirman que ${topic} ${stance}. ${conn.word} otros sostienen que sus efectos a largo plazo son impredecibles. La evidencia sugiere que debemos ser cautelosos.`;

            return {
                text: `${text}\n\n¿Cuál es la función del conector "${conn.word}" en el texto?`,
                correct: conn.func,
                distractors: connectors.filter(c => c.word !== conn.word).slice(0, 3).map(c => c.func),
                explanation: `El conector "${conn.word}" se utiliza gramaticalmente para: ${conn.func.toLowerCase()}.`
            };
        }
    },
    // --- INFERENCE (Implicit Meaning) ---
    {
        type: "inference",
        difficulty: "media_alta",
        generate: () => {
            const subjects = ["El protagonista", "El autor", "El narrador", "El político citado"];
            const scenarios = [
                { action: "miró el reloj con ansiedad y golpeó el suelo con el pie", inference: "tenía prisa o estaba impaciente" },
                { action: "cerró la puerta de un golpe y respiró hondo", inference: "estaba intentando controlar su ira" },
                { action: "bajó la mirada y su voz se quebró", inference: "sentía tristeza o vergüenza" },
                { action: "evitó responder y cambió de tema bruscamente", inference: "ocultaba algo o se sentía incómodo" },
                { action: "se frotó las manos y sonrió maliciosamente", inference: "planeaba algo con doble intención" }
            ];

            const subject = subjects[Math.floor(Math.random() * subjects.length)];
            const scen = scenarios[Math.floor(Math.random() * scenarios.length)];

            return {
                text: `"${subject} ${scen.action} mientras le hablaban."\n\nDel fragmento anterior se puede inferir que ${subject}:`,
                correct: scen.inference,
                distractors: [
                    "Estaba totalmente indiferente",
                    "No entendía lo que le decían",
                    "Estaba muy feliz y relajado"
                ],
                explanation: `La acción descrita ("${scen.action}") denota típicamente que el sujeto ${scen.inference}.`
            };
        }
    },
    // --- PHILOSOPHICAL (Abstractions) ---
    {
        type: "philosophical",
        difficulty: "avanzada",
        generate: () => {
            const concepts = ["La libertad", "La justicia", "La verdad", "El conocimiento", "La ética"];
            const definitions = [
                { def: "no es un fin, sino un medio constante", incompatible: "es un objetivo final y estático" },
                { def: "es una construcción social variable", incompatible: "es un valor absoluto natural e inmutable" },
                { def: "reside en la mente del individuo sin ataduras", incompatible: "depende exclusivamente de las leyes externas" },
                { def: "es inalcanzable en su totalidad por el ser humano", incompatible: "puede ser comprendida perfectamente por cualquiera" }
            ];

            const concept = concepts[Math.floor(Math.random() * concepts.length)];
            const defData = definitions[Math.floor(Math.random() * definitions.length)];

            const text = `Para el autor, ${concept.toLowerCase()} ${defData.def}. Esto implica que no podemos juzgarla bajo parámetros rígidos, sino relativos al contexto.`;

            return {
                text: `${text}\n\n¿Cuál de las siguientes afirmaciones es INCOMPATIBLE con el texto?`,
                correct: `${concept} ${defData.incompatible}.`,
                distractors: [
                    `${concept} depende del contexto.`,
                    `No existen parámetros únicos para ${concept.toLowerCase()}.`,
                    `El autor tiene una visión flexible de ${concept.toLowerCase()}.`
                ],
                explanation: `El texto define el concepto como algo que "${defData.def}". Afirmar que "${defData.incompatible}" contradice directamente esa definición.`
            };
        }
    },
    // --- PHILOSOPHICAL (Abstractions & Intents) - UPDATED 2026 ---
    {
        type: "philosophical_intents",
        difficulty: "avanzada",
        generate: () => {
            const fragments = [
                {
                    text: "Si la justicia es solo el interés del más fuerte, como propone Trasímaco, entonces la ley no es un refugio sino una herramienta de dominación.",
                    question: "¿Qué intención oculta se puede identificar en la premisa sobre Trasímaco?",
                    correct: "Criticar la reducción de la moral a una cuestión de poder.",
                    explanation: "El autor usa un condicional para mostrar las consecuencias negativas de una visión puramente cínica de la justicia.",
                    distractors: ["Apoyar la idea de que los fuertes deben mandar.", "Describir objetivamente la historia de Grecia.", "Elogiar la claridad de Trasímaco."]
                },
                {
                    text: "La libertad no consiste en hacer lo que uno quiere, sino en no estar obligado a hacer lo que otro quiere bajo coacción injusta.",
                    question: "¿Cuál es el prejuicio ético que intenta desmontar el fragmento?",
                    correct: "La falsa equivalencia entre libertad y ausencia total de normas o deseos caprichosos.",
                    explanation: "El texto redefine la libertad enfocándose en la autonomía frente a la coacción externa.",
                    distractors: ["Que nadie debe seguir leyes.", "Que la libertad es un concepto imposible.", "Que el autor está en contra de la voluntad individual."]
                }
            ];

            const frag = fragments[Math.floor(Math.random() * fragments.length)];

            return {
                text: `${frag.text}\n\n${frag.question}`,
                correct: frag.correct,
                distractors: frag.distractors,
                explanation: frag.explanation
            };
        }
    },
    // --- OPINION COLUMNS (Arguments & Validity) - NEW 2026 ---
    {
        type: "opinion_analysis",
        difficulty: "media_alta",
        generate: () => {
            const columns = [
                {
                    text: "No podemos permitir que expertos en algoritmos decidan el futuro de nuestra privacidad, pues su único norte es la rentabilidad, no el bienestar ciudadano. Ignorar esto es ingenuidad pura.",
                    question: "¿Cuál es el principal recurso argumentativo del autor para descalificar a los expertos?",
                    correct: "El cuestionamiento de sus intenciones basado en un interés económico (argumento ad hominem circunstancial).",
                    explanation: "El autor ataca la propuesta de los expertos señalando que su motivación es el lucro, no la competencia técnica.",
                    distractors: ["El uso de estadísticas de privacidad.", "La comparación entre algoritmos y seres humanos.", "La cita de una autoridad en derechos humanos."]
                },
                {
                    text: "La libertad de prensa no es un cheque en blanco; es un contrato social que exige veracidad. Cuando el rumor se disfraza de noticia, el contrato se rompe y la democracia sangra.",
                    question: "¿Qué metáfora utiliza el autor para enfatizar el daño a la democracia?",
                    correct: "La personificación de la democracia como un organismo que puede 'sangrar' por la desinformación.",
                    explanation: "El autor usa un lenguaje figurado para mostrar que la mala prensa hiere el tejido democrático.",
                    distractors: ["La comparación de la prensa con un banco.", "La descripción de la noticia como un disfraz.", "El uso de términos legales como 'contrato social'."]
                }
            ];

            const col = columns[Math.floor(Math.random() * columns.length)];

            return {
                text: `Fragmento de columna:\n"${col.text}"\n\n${col.question}`,
                correct: col.correct,
                distractors: col.distractors,
                explanation: col.explanation
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

            // Generate deterministic ID
            const qId = generateId("lectura_critica", qData.text, qData.correct);

            questions.push({
                id: qId,
                module: "lectura_critica",
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
fs.writeFileSync(path.join(__dirname, '../data/questions-reading.json'), JSON.stringify(data, null, 2));
console.log(`Generated ${data.length} reading questions.`);
