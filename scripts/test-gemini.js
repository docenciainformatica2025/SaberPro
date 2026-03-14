const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function testGemini() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("❌ No GEMINI_API_KEY found in .env.local");
        return;
    }

    console.log(`Using API Key: ${apiKey.substring(0, 5)}...`);
    const genAI = new GoogleGenerativeAI(apiKey);

    // Testing both models
    const models = ["gemini-2.0-flash", "gemini-1.5-flash"];

    for (const modelName of models) {
        try {
            console.log(`\nTesting model: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Explica brevemente por qué el cielo es azul.");
            const response = await result.response;
            const text = response.text();
            console.log(`✅ ${modelName} Success! Response start: ${text.substring(0, 50)}...`);
        } catch (error) {
            console.error(`❌ ${modelName} Failed:`, error.message);
        }
    }
}

testGemini();
