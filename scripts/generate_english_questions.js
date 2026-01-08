const fs = require('fs');
const path = require('path');
const { generateId } = require('./utils/idGenerator');

const TOTAL_QUESTIONS = 1000;
const COUNTS = {
    media: Math.floor(TOTAL_QUESTIONS * 0.4), // Part 1 (Signs) & Part 2 (Matching)
    media_alta: Math.floor(TOTAL_QUESTIONS * 0.4), // Part 3-4 (Conversation/Grammar)
    avanzada: Math.floor(TOTAL_QUESTIONS * 0.2) // Part 5-7 (Reading)
};

const TEMPLATES = [
    // --- PART 1: SIGNS ---
    {
        type: "sign_interpretation",
        difficulty: "media",
        generate: () => {
            const places = [
                { text: "Please do not feed the animals.", place: "In a zoo" },
                { text: "Quiet please, exam in progress.", place: "In a school" },
                { text: "Sale! 50% off everything.", place: "In a shop" },
                { text: "Please fasten your seatbelt.", place: "In a plane" },
                { text: "Do not run near the pool.", place: "In a swimming pool" },
                { text: "Keep off the grass.", place: "In a park" },
                { text: "Slow down, school zone.", place: "On a road" },
                { text: "Insert coins here.", place: "On a vending machine" },
                { text: "Staff only.", place: "In an office" },
                { text: "Wash your hands before eating.", place: "In a restaurant" },
                { text: "No photography allowed.", place: "In a museum" },
                { text: "Silence, library reading room.", place: "In a library" }
            ];

            const item = places[Math.floor(Math.random() * places.length)];
            const allDistractors = places.map(p => p.place).filter(p => p !== item.place);
            const distractors = allDistractors.sort(() => 0.5 - Math.random()).slice(0, 3);

            return {
                text: `Where can you see this sign?\n\n"${item.text}"`,
                correct: item.place,
                distractors: distractors,
                explanation: `The phrase "${item.text}" is typical for context: ${item.place}.`
            };
        }
    },
    // --- PART 4: GRAMMAR ---
    {
        type: "incomplete_sentences",
        difficulty: "media_alta",
        generate: () => {
            const sentences = [
                { text: "She _____ to the market yesterday.", correct: "went", options: ["go", "goes", "gone"] },
                { text: "If I _____ you, I would study harder.", correct: "were", options: ["am", "was", "be"] },
                { text: "He has _____ working here for ten years.", correct: "been", options: ["being", "be", "is"] },
                { text: "We enjoy _____ movies on weekends.", correct: "watching", options: ["watch", "watched", "to watch"] },
                { text: "The book _____ was written by Garcia Marquez.", correct: "which", options: ["who", "where", "whose"] },
                { text: "I look forward to _____ from you.", correct: "hearing", options: ["hear", "heard", "hears"] },
                { text: "She is good _____ playing the piano.", correct: "at", options: ["in", "on", "of"] },
                { text: "I have lived here _____ 2010.", correct: "since", options: ["for", "during", "ago"] },
                { text: "You _____ wear a uniform at school.", correct: "must", options: ["can", "might", "would"] },
                { text: "The car was _____ by my father.", correct: "washed", options: ["wash", "washing", "washes"] }
            ];

            const item = sentences[Math.floor(Math.random() * sentences.length)];

            return {
                text: `Complete the sentence:\n\n${item.text}`,
                correct: item.correct,
                distractors: item.options,
                explanation: `Grammatically correct choice is "${item.correct}".`
            };
        }
    },
    // --- PART 7: INFERENTIAL READING (B1/B2) - UPDATED 2026 ---
    {
        type: "inferential_reading",
        difficulty: "avanzada",
        generate: () => {
            const scenarios = [
                {
                    text: "Despite the government's efforts to digitalize all public services, a significant portion of the elderly population still prefers face-to-face interaction, claiming that technology feels 'impersonal and cold'.",
                    question: "What can be inferred from the text about the digitalization process?",
                    correct: "It has faced social resistance due to emotional or generational factors.",
                    explanation: "The text mentions a 'preference' and 'claims' from a specific group, implying a gap between policy and user experience.",
                    distractors: ["The government has failed to build any websites.", "Elderly people are unable to learn new skills.", "Digital services are cheaper than face-to-face ones."]
                },
                {
                    text: "The rise of conscious consumerism has forced major corporations to rethink their supply chains, although critics argue these changes are often more about marketing than ethics.",
                    question: "What is the critics' main concern regarding the companies' changes?",
                    correct: "That the changes might be superficial or profit-driven.",
                    explanation: "Explicitly mentions 'marketing than ethics', suggesting a lack of genuine commitment.",
                    distractors: ["That corporations are losing too much money.", "That consumers do not care about supply chains.", "That supply chains are becoming too complex."]
                },
                {
                    text: "While urban agriculture is often praised for its ecological benefits, its scalability remains a subject of intense debate among urban planners who prioritize housing density.",
                    question: "Which of the following best expresses the tension described in the text?",
                    correct: "The conflict between environmental sustainability and space optimization for housing.",
                    explanation: "The text highlights a trade-off between green benefits and the need for high-density housing.",
                    distractors: ["The cost of organic food vs. traditional farming.", "The lack of interest from citizens in growing their own food.", "The government's refusal to fund urban gardens."]
                }
            ];

            const sc = scenarios[Math.floor(Math.random() * scenarios.length)];

            return {
                text: `Read the passage:\n"${sc.text}"\n\n${sc.question}`,
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
        if (difficulty === 'media') pool = TEMPLATES.filter(t => t.type === 'sign_interpretation');
        if (difficulty === 'media_alta') pool = TEMPLATES.filter(t => t.type === 'incomplete_sentences');
        if (difficulty === 'avanzada') pool = TEMPLATES.filter(t => t.type === 'reading_comprehension');

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
            const qId = generateId("ingles", qData.text, qData.correct);

            questions.push({
                id: qId,
                module: "ingles",
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
fs.writeFileSync(path.join(__dirname, '../data/questions-english.json'), JSON.stringify(data, null, 2));
console.log(`Generated ${data.length} english questions.`);
