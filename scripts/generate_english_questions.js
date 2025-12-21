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
    // --- PART 7: READING ---
    {
        type: "reading_comprehension",
        difficulty: "avanzada",
        generate: () => {
            const subjects = ["Climate Change", "Remote Work", "Mental Health", "Space Exploration", "Artificial Intelligence", "Healthy Eating"];
            const details = ["requires global cooperation", "improves flexibility but reduces social contact", "is as important as physical health", "could be our future survival strategy", "will transform job markets", "extends life expectancy"];

            // Randomly pick subject/detail
            const sIdx = Math.floor(Math.random() * subjects.length);
            const subject = subjects[sIdx];
            const detail = details[sIdx] || details[0]; // Fallback aligned by index roughly or random? Let's align by index for coherence if array same length, else random. Arrays are same length.

            const text = `Recent studies suggest that ${subject.toLowerCase()} ${detail}. Experts argue that we must pay attention to this trend to ensure a better future.`;

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
