const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const MODELS = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-2.0-flash-001",
    "gemini-flash-latest",
];

async function generateWithFallback(prompt) {
    let lastError = null;

    for (const modelName of MODELS) {
        try {
            console.log(`Trying ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return { text: response.text(), model: modelName };
        } catch (error) {
            lastError = error;
            console.warn(`❌ ${modelName} failed:`, error.message);
        }
    }
    throw lastError;
}

async function verify() {
    try {
        const result = await generateWithFallback("Hola, dime una palabra motivadora.");
        console.log(`\n✅ SUCCESS with ${result.model}!`);
        console.log(`Response: ${result.text}`);
    } catch (e) {
        console.error("\n❌ ALL MODELS FAILED:", e.message);
        if (e.status === 429) {
            console.error("CONFIRMED: Hard Quota Limit Reached for all tried models.");
        }
    }
}

verify();
