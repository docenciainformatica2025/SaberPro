const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("❌ No GEMINI_API_KEY found");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        // Unfortunately the JS SDK doesn't have a direct listModels method on genAI
        // We'd have to use the REST API directly or check documentation for standard names.
        // But we can try a few common ones.

        const testModels = [
            "gemini-1.5-flash",
            "gemini-1.5-flash-8b",
            "gemini-1.5-pro",
            "gemini-1.0-pro",
            "gemini-2.0-flash-exp"
        ];

        for (const m of testModels) {
            try {
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent("hi");
                console.log(`✅ ${m}: Success`);
            } catch (e) {
                console.log(`❌ ${m}: ${e.message}`);
            }
        }
    } catch (err) {
        console.error("Global error:", err.message);
    }
}

listModels();
