const fs = require('fs');
const path = require('path');
const { generateId } = require('./utils/idGenerator');

const TOTAL_QUESTIONS = 600;
const COUNTS = {
    media: Math.floor(TOTAL_QUESTIONS * 0.6),
    media_alta: Math.floor(TOTAL_QUESTIONS * 0.3),
    avanzada: Math.floor(TOTAL_QUESTIONS * 0.1)
};

const TEMPLATES = [
    // --- MEDIA DIFFICULTY ---
    {
        type: "rule_of_three_direct",
        difficulty: "media",
        generate: () => {
            // Context: Purchasing items, Distance/Time, etc.
            const scenarios = [
                { item: "camisas", verb: "costaron" },
                { item: "kilos de arroz", verb: "valen" },
                { item: "libros", verb: "cuestan" },
                { item: "litros de gasolina", verb: "cuestan" }
            ];
            const scen = scenarios[Math.floor(Math.random() * scenarios.length)];

            const count1 = Math.floor(Math.random() * 8) + 2; // 2-9
            const unitPrice = (Math.floor(Math.random() * 20) + 5) * 1000; // 5000 - 25000
            const cost1 = count1 * unitPrice;

            const count2 = count1 + Math.floor(Math.random() * 5) + 2; // Larger quantity
            const correctCost = count2 * unitPrice;

            return {
                text: `Si ${count1} ${scen.item} ${scen.verb} $${cost1.toLocaleString('es-CO')}, ¿cuánto costarán ${count2} ${scen.item}?`,
                correct: `$${correctCost.toLocaleString('es-CO')}`,
                distractors: [
                    `$${(correctCost * 0.8).toLocaleString('es-CO')}`, // Lower
                    `$${(correctCost + unitPrice).toLocaleString('es-CO')}`, // Close
                    `$${(cost1 * 2).toLocaleString('es-CO')}` // Doubled original
                ],
                explanation: `Es una regla de tres directa. Precio unitario = $${cost1} / ${count1} = $${unitPrice}. Costo total = ${count2} * $${unitPrice} = $${correctCost}.`
            };
        }
    },
    {
        type: "percentage_profit",
        difficulty: "media",
        generate: () => {
            const cost = (Math.floor(Math.random() * 50) + 10) * 1000;
            const margin = Math.floor(Math.random() * 5) * 5 + 10; // 10, 15, 20...
            const profit = cost * (margin / 100);
            const price = cost + profit;

            return {
                text: `Un comerciante compra un artículo por $${cost.toLocaleString('es-CO')}. Desea obtener una ganancia del ${margin}% sobre el costo. ¿Cuál debe ser el precio de venta?`,
                correct: `$${price.toLocaleString('es-CO')}`,
                distractors: [
                    `$${(cost + (cost * (margin / 100) * 0.5)).toLocaleString('es-CO')}`,
                    `$${(cost / (1 - margin / 100)).toLocaleString('es-CO')}`, // Margin on sale price error
                    `$${(price - 2000).toLocaleString('es-CO')}`
                ],
                explanation: `Ganancia = $${cost} * ${margin / 100} = $${profit}. Precio Venta = Costo + Ganancia = $${cost} + $${profit} = $${price}.`
            };
        }
    },
    {
        type: "probability_marbles",
        difficulty: "media",
        generate: () => {
            const red = Math.floor(Math.random() * 5) + 3;
            const blue = Math.floor(Math.random() * 5) + 3;
            const green = Math.floor(Math.random() * 5) + 3;
            const total = red + blue + green;

            // Target color: Red
            const probFrac = `${red}/${total}`;
            const probPct = Math.round((red / total) * 100);

            return {
                text: `En una urna hay ${red} balotas rojas, ${blue} azules y ${green} verdes. ¿Cuál es la probabilidad de sacar una balota roja al azar?`,
                correct: `${red}/${total}`,
                distractors: [
                    `${blue}/${total}`,
                    `${green}/${total}`,
                    `1/${total}`
                ],
                explanation: `Probabilidad = Casos favorables / Casos totales. Totales = ${total}. Rojos = ${red}. P(Roja) = ${red}/${total}.`
            };
        }
    },

    // --- MEDIA ALTA ---
    {
        type: "rule_of_three_inverse",
        difficulty: "media_alta",
        generate: () => {
            // Inverse: Workers/Days, Speed/Time
            const workers1 = Math.floor(Math.random() * 5) + 2; // 2-6
            const days1 = Math.floor(Math.random() * 10) + 4; // 4-13
            const work = workers1 * days1; // Total "man-days"

            // Ensure days2 is integer result
            // Try to find a workers2 that divides 'work' cleanly
            let factors = [];
            for (let i = 1; i <= work; i++) {
                if (work % i === 0 && i !== workers1) factors.push(i);
            }
            const workers2 = factors[Math.floor(Math.random() * factors.length)];
            const days2 = work / workers2;

            return {
                text: `Si ${workers1} obreros construyen un muro en ${days1} días, ¿cuántos días tardarán ${workers2} obreros trabajando al mismo ritmo?`,
                correct: `${days2} días`,
                distractors: [
                    `${Math.round(days1 * (workers2 / workers1))} días`, // Direct proportion error
                    `${days2 + 2} días`,
                    `${Math.max(1, days2 - 2)} días`
                ],
                explanation: `Es una regla de tres INVERSA (más obreros, menos tiempo). Constante = ${workers1} * ${days1} = ${work} días-hombre. Nuevos días = ${work} / ${workers2} = ${days2}.`
            };
        }
    },
    {
        type: "geometry_perimeter_area",
        difficulty: "media_alta",
        generate: () => {
            const w = Math.floor(Math.random() * 8) + 3;
            const h = w + Math.floor(Math.random() * 5) + 2;
            const perimeter = 2 * (w + h);
            const area = w * h;

            return {
                text: `Un rectángulo tiene un perímetro de ${perimeter} cm. Si uno de sus lados mide ${w} cm, ¿cuál es su área?`,
                correct: `${area} cm²`,
                distractors: [
                    `${w * w} cm²`,
                    `${perimeter * w} cm²`,
                    `${(perimeter / 2) * w} cm²`
                ],
                explanation: `Perímetro P = 2(w + h). ${perimeter} = 2(${w} + h) -> ${perimeter / 2} = ${w} + h -> h = ${perimeter / 2 - w}. Área = ${w} * ${perimeter / 2 - w} = ${area} cm².`
            };
        }
    },

    // --- AVANZADA ---
    {
        type: "algebra_system",
        difficulty: "avanzada",
        generate: () => {
            const x = Math.floor(Math.random() * 10) + 2;
            const y = Math.floor(Math.random() * 10) + 2;

            const res1 = 2 * x + y;
            const res2 = x - y;

            return {
                text: `Resuelva el sistema de ecuaciones para hallar 'x':\n1) 2x + y = ${res1}\n2) x - y = ${res2}`,
                correct: `x = ${x}`,
                distractors: [
                    `x = ${x + 1}`,
                    `x = ${y}`,
                    `x = ${Math.round((res1 + res2) / 2)}`
                ],
                explanation: `Sumando (1) y (2): (2x + y) + (x - y) = ${res1} + ${res2} --> 3x = ${res1 + res2} --> x = ${(res1 + res2) / 3}.`
            };
        }
    },
    {
        type: "geometry_circle_area",
        difficulty: "avanzada",
        generate: () => {
            const r = Math.floor(Math.random() * 8) + 2;
            const area = Math.PI * r * r;
            const areaStr = `${(r * r)}π`;

            return {
                text: `Si el radio de un círculo es ${r} cm, ¿cuál es su área?`,
                correct: `${areaStr} cm²`,
                distractors: [
                    `${2 * r}π cm²`,
                    `${r}π cm²`,
                    `${r * r * r}π cm²`
                ],
                explanation: `El área de un círculo es A = π*r^2. A = π*(${r})^2 = ${r * r}π.`
            };
        }
    }
];

function generateQuestions() {
    const questions = [];

    // Helper to generate N questions of specific difficulty
    const generateBatch = (count, difficulty) => {
        // Filter templates that match the difficulty
        // Note: We can reuse 'media' templates for higher difficulties if needed, but logic below keeps them strict or mixed.
        // For variety, let's allow overlapping if pool is small.
        let pool = TEMPLATES.filter(t => t.difficulty === difficulty);

        // Fallback for variety
        if (pool.length === 0) pool = TEMPLATES;

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

            // Re-assign IDs based on verified position
            const finalOptions = options.map((opt, idx) => ({
                id: ["a", "b", "c", "d"][idx],
                text: opt.text
            }));

            const correctAnswerId = finalOptions.find(o => o.text === qData.correct).id;

            // Generate deterministic ID
            const qId = generateId("razonamiento_cuantitativo", qData.text, qData.correct);

            questions.push({
                id: qId,
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
