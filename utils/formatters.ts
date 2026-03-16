/**
 * Normalizes and formats text labels for storage in the database.
 * Independent of how the user types them.
 */

export const formatDBInfo = (text: string | undefined): string => {
    if (!text) return "";
    
    // Trim and remove multiple spaces
    const clean = text.trim().replace(/\s+/g, ' ');
    
    if (!clean) return "";

    // Title Case (Example: "ingeniería de sistemas" -> "Ingeniería De Sistemas")
    return clean
        .toLowerCase()
        .split(' ')
        .map(word => {
            if (word.length === 0) return "";
            // Special cases for lowercase (optional, like "de", "la", "y" in Spanish)
            const lowers = ["de", "la", "el", "y", "en", "para", "con"];
            if (lowers.includes(word) && clean.split(' ')[0] !== word) {
                return word;
            }
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
};

/**
 * Normalizes full names specifically (more aggressive trimming)
 */
export const formatFullName = (name: string | undefined): string => {
    return formatDBInfo(name);
};
