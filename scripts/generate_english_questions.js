const fs = require('fs');
const path = require('path');

const TOTAL_QUESTIONS = 150;
const COUNTS = {
    media: 100, // Part 1-3 (Basic Vocabulary/Conversation)
    media_alta: 30, // Part 4-5 (Grammar/Reading)
    avanzada: 20 // Part 6-7 (Inference)
};

const TEMPLATES = [
    {
        type: "sign_interpretation", // Part 1 style
        difficulty: "media",
        generate: () => {
            const places = [
                { text: "Please do not feed the animals.", place: "In a zoo" },
                { text: "Quiet please, exam in progress.", place: "In a school" },
                { text: "Sale! 50% off everything.", place: "In a shop" },
                { text: "Please fasten your seatbelt.", place: "In a plane" },
                { text: "Do not run near the pool.", place: "In a swimming pool" }
            ];

            const item = places[Math.floor(Math.random() * places.length)];

            const allDistractors = places.map(p => p.place).filter(p => p !== item.place);
            const distractors = allDistractors.sort(() => 0.5 - Math.random()).slice(0, 3); // Get 3 random distractors

            return {
                text: `Where can you see this sign?\n\n"${item.text}"`,
                correct: item.place,
                distractors: distractors,
                explanation: `The phrase "${item.text}" is typical for context: ${item.place}.`
            };
        }
    },
    {
        type: "incomplete_sentences", // Part 4 style
        difficulty: "media_alta",
        generate: () => {
            const sentences = [
                { text: "She _____ to the market yesterday.", correct: "went", options: ["go", "goes", "gone"] },
                { text: "If I _____ you, I would study harder.", correct: "were", options: ["am", "was", "be"] },
                { text: "He has _____ working here for ten years.", correct: "been", options: ["being", "be", "is"] },
                { text: "We enjoy _____ movies on weekends.", correct: "watching", options: ["watch", "watched", "to watch"] },
                { text: "The book _____ was written by Garcia Marquez.", correct: "which", options: ["who", "where", "whose"] }
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
    {
        type: "reading_comprehension", // Part 7 style
        difficulty: "avanzada",
        generate: () => {
            const subjects = ["Climate Change", "Remote Work", "Mental Health", "Space Exploration"];
            const details = ["requires global cooperation", "improves flexibility but reduces social contact", "is as important as physical health", "could be our future survival strategy"];

            const subject = subjects[Math.floor(Math.random() * subjects.length)];
            const detail = details[Math.floor(Math.random() * details.length)]; // Random pairing for procedural generation

            // Logic: The text says X. Question asks about X.
            const text = `Recent studies suggest that ${subject.toLowerCase()} ${detail}. Experts argue that we must pay attention to this trend.`;

            return {
                text: `Read the text:\n"${text}"\n\nWhat do experts suggest about ${subject.toLowerCase()}?`,
                correct: `That it ${detail}.`,
                distractors: [
                    "That it is not important at all.",
                    "That we should ignore the trend.",
                    "That it has no impact on society."
                ],
                explanation: `The text explicitly states that ${subject.toLowerCase()} ${detail}.`
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

        // Fallback
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

            questions.push({
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
