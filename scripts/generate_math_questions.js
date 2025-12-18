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
        type: "percentage",
        difficulty: "media",
        generate: () => {
            const cost = (Math.floor(Math.random() * 50) + 10) * 1000; // 10000 - 60000
            const margin = Math.floor(Math.random() * 5) * 5 + 10; // 10, 15, 20, 25, 30
            const profit = cost * (margin / 100);
            const price = cost + profit;

            const distractors = [
                price * 0.8,
                price * 1.1,
                price - (profit / 2)
            ].map(d => Math.round(d));

            return {
                text: `Un comerciante compra un artículo por $${cost}. Desea venderlo ganando el ${margin}% sobre el costo. ¿Cuál debe ser el precio de venta?`,
                correct: `$${price}`,
                distractors: distractors.map(d => `$${d}`),
                explanation: `El costo es $${cost}. El ${margin}% de ganancia es $${cost} * ${margin / 100} = $${profit}. Precio venta = $${cost} + $${profit} = $${price}.`
            };
        }
    },
    {
        type: "probability_basic",
        difficulty: "media",
        generate: () => {
            const total = (Math.floor(Math.random() * 10) + 2) * 10; // 20, 30... 110
            const percentage = Math.floor(Math.random() * 8) * 10 + 10; // 10 - 90
            const target = (total * percentage) / 100;

            return {
                text: `En una urna hay ${total} balotas. El ${percentage}% son rojas. ¿Cuántas balotas NO son rojas?`,
                correct: `${total - target}`,
                distractors: [`${target}`, `${total - target + 10}`, `${target + 5}`],
                explanation: `Si el ${percentage}% son rojas, entonces el ${100 - percentage}% NO son rojas. ${100 - percentage}% de ${total} es ${total - target}.`
            };
        }
    },
    {
        type: "geometry_area",
        difficulty: "media_alta",
        generate: () => {
            const side = Math.floor(Math.random() * 10) + 5;
            const factor = 2;

            return {
                text: `Se tiene un cuadrado de lado ${side} cm. Si cada lado se duplica, ¿cuántas veces aumenta su área?`,
                correct: `4 veces`,
                distractors: [`2 veces`, `8 veces`, `6 veces`],
                explanation: `Área inicial = L^2. Nuevo lado = 2L. Nueva área = (2L)^2 = 4L^2. Aumenta 4 veces.`
            };
        }
    },
    {
        type: "algebra_system",
        difficulty: "avanzada",
        generate: () => {
            const x = Math.floor(Math.random() * 10) + 1;
            const y = Math.floor(Math.random() * 10) + 1;
            const eq1 = x + y;
            const eq2 = x - y;

            return {
                text: `Si x + y = ${eq1} y x - y = ${eq2}, ¿cuál es el valor de x*y?`,
                correct: `${x * y}`,
                distractors: [`${x * y + 2}`, `${x * y - 2}`, `${x + y}`],
                explanation: `Sumando ecuaciones: 2x = ${eq1 + eq2} -> x = ${(eq1 + eq2) / 2}. Restando: 2y = ${eq1 - eq2} -> y = ${(eq1 - eq2) / 2}. x*y = ${x * y}.`
            };
        }
    }
];

function generateQuestions() {
    const questions = [];

    // Helper to generate N questions of specific difficulty
    const generateBatch = (count, difficulty) => {
        const matchingTemplates = TEMPLATES.filter(t => t.difficulty === difficulty || (difficulty === 'media' && t.difficulty === 'media')); // Simplification: use all templates
        // Creating specific pools based on difficulty requested

        let pool = [];
        if (difficulty === 'media') {
            pool = TEMPLATES.filter(t => t.difficulty === 'media');
        } else if (difficulty === 'media_alta') {
            pool = TEMPLATES.filter(t => t.difficulty === 'media_alta' || t.type === 'percentage'); // Mix hard percentage
        } else {
            pool = TEMPLATES.filter(t => t.difficulty === 'avanzada' || t.type === 'geometry_area');
        }

        for (let i = 0; i < count; i++) {
            const template = pool[Math.floor(Math.random() * pool.length)];
            const qData = template.generate();

            // Randomize options position
            const options = [
                { id: "a", text: qData.correct },
                { id: "b", text: qData.distractors[0] },
                { id: "c", text: qData.distractors[1] },
                { id: "d", text: qData.distractors[2] }
            ].sort(() => Math.random() - 0.5);

            // Re-assign IDs based on position
            const finalOptions = options.map((opt, idx) => ({
                id: ["a", "b", "c", "d"][idx],
                text: opt.text
            }));

            const correctAnswerId = finalOptions.find(o => o.text === qData.correct).id;

            questions.push({
                module: "razonamiento_cuantitativo",
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
fs.writeFileSync(path.join(__dirname, '../data/questions-quantitative.json'), JSON.stringify(data, null, 2));
console.log(`Generated ${data.length} questions.`);
