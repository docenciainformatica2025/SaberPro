const crypto = require('crypto');

/**
 * Generates a deterministic ID based on the question content.
 * This ensures that if the same question text is generated twice, it gets the same ID.
 * @param {string} module - The module name.
 * @param {string} text - The question text.
 * @param {string} answer - The correct answer.
 * @returns {string} - A short hash ID (e.g., 'mat-a1b2c3d4').
 */
function generateId(module, text, answer) {
    const data = `${module}:${text}:${answer}`;
    const hash = crypto.createHash('md5').update(data).digest('hex').substring(0, 12);
    // Shorten module name for prefix
    const prefixMap = {
        'razonamiento_cuantitativo': 'mat',
        'ingles': 'eng',
        'lectura_critica': 'lec',
        'competencias_ciudadanas': 'ciu',
        'comunicacion_escrita': 'com'
    };
    const prefix = prefixMap[module] || 'gen';
    return `${prefix}-${hash}`;
}

module.exports = { generateId };
