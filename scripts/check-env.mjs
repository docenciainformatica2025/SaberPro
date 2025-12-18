
import fs from 'fs';
import path from 'path';

const envPath = path.join(process.cwd(), '.env.local');

try {
    if (!fs.existsSync(envPath)) {
        console.error("❌ .env.local file NOT FOUND!");
        process.exit(1);
    }

    const envContent = fs.readFileSync(envPath, 'utf-8');
    const vars = {};
    envContent.split('\n').forEach(line => {
        const [key, val] = line.split('=');
        if (key && val) vars[key.trim()] = val.trim();
    });

    const required = [
        "NEXT_PUBLIC_FIREBASE_API_KEY",
        "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
        "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
        "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
        "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
        "NEXT_PUBLIC_FIREBASE_APP_ID"
    ];

    let missing = false;
    required.forEach(key => {
        if (!vars[key]) {
            console.error(`❌ Missing: ${key}`);
            missing = true;
        } else {
            // Check for placeholders
            if (vars[key].includes("your_") || vars[key] === "") {
                console.error(`❌ Invalid (Placeholder/Empty): ${key} = ${vars[key]}`);
                missing = true;
            } else {
                console.log(`✅ OK: ${key}`);
            }
        }
    });

    if (missing) {
        console.error("\nSome environment variables are missing or invalid!");
        process.exit(1);
    } else {
        console.log("\nAll required environment variables appear to be set.");
    }

} catch (err) {
    console.error("Error reading .env.local:", err.message);
}
