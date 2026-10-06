/**
 * Cross-Reference Data Structure
 * Maps each Shloka ID to its corresponding Vachnamrut and Vato references
 */

export interface CrossReference {
  shlokaId: number;
  vachnamrutReferences: VachnamrutRef[];
  vatoReferences: VatoRef[];
  summary?: string; // Optional explanation of how they relate
}

export interface VachnamrutRef {
  gadhpur: number; // Gadhpur section number (1-10)
  lesson: number; // Lesson/Satsang number
  paragraph?: number; // Optional paragraph number
  pageRange?: string; // Optional page range like "42-45"
  keyPhrase?: string; // Key phrase from Vachnamrut that relates
  explanation?: string; // Brief explanation of connection
}

export interface VatoRef {
  month: string; // Month when discourse occurred
  day: number; // Day
  year: number; // Year
  lesson?: number; // Lesson number if available
  keyPhrase?: string; // Key phrase from Vato that relates
  explanation?: string; // Brief explanation of connection
}

/**
 * Main cross-reference database
 * Format: shlokaId => { vachnamrutReferences: [], vatoReferences: [] }
 */
export const CROSS_REFERENCES: Record<number, CrossReference> = {
  // Example entries - Replace with actual data
  1: {
    shlokaId: 1,
    vachnamrutReferences: [
      {
        gadhpur: 1,
        lesson: 1,
        paragraph: 5,
        keyPhrase: "Dharma na mul niyam",
        explanation: "This Vachnamrut discusses the fundamental rules of dharma which forms the basis of Satlok Diksha"
      }
    ],
    vatoReferences: [
      {
        month: "January",
        day: 15,
        year: 1880,
        keyPhrase: "Bhagwan nu swaroop",
        explanation: "Gunatitanand Swami expounds on understanding the nature of Bhagwan as described in this shloka"
      }
    ],
    summary: "This shloka encapsulates the dharmic foundation that Swaminarayan expounds in his Vachnamrut."
  },

  2: {
    shlokaId: 2,
    vachnamrutReferences: [
      {
        gadhpur: 2,
        lesson: 3,
        pageRange: "45-48",
        keyPhrase: "Shuddha Bhakti",
        explanation: "Direct reference to pure devotion as the path to liberation"
      }
    ],
    vatoReferences: [],
    summary: "The theme of pure devotion is central to understanding Satsang principles."
  },

  // Add more entries following this pattern
  // To make it easier, create a helper function below to add entries programmatically
};

/**
 * Helper function to add or update cross-references
 * Use this to dynamically add data if needed
 */
export function addCrossReference(ref: CrossReference): void {
  CROSS_REFERENCES[ref.shlokaId] = ref;
}

/**
 * Helper function to get cross-references for a specific shloka
 */
export function getCrossReferences(shlokaId: number): CrossReference | null {
  return CROSS_REFERENCES[shlokaId] || null;
}

/**
 * Helper function to get all shlokas that have cross-references
 */
export function getAllReferencedShlokas(): number[] {
  return Object.keys(CROSS_REFERENCES).map(Number).sort((a, b) => a - b);
}

/**
 * Get reference coverage percentage
 */
export function getReferenceCoverage(): { total: number; referenced: number; percentage: number } {
  const referenced = Object.keys(CROSS_REFERENCES).length;
  const total = 315; // Total shlokas
  return {
    total,
    referenced,
    percentage: Math.round((referenced / total) * 100)
  };
}

/**
 * Check if a shloka has Vachnamrut references
 */
export function hasVachnamrutReferences(shlokaId: number): boolean {
  return !!CROSS_REFERENCES[shlokaId]?.vachnamrutReferences?.length;
}

/**
 * Check if a shloka has Vato references
 */
export function hasVatoReferences(shlokaId: number): boolean {
  return !!CROSS_REFERENCES[shlokaId]?.vatoReferences?.length;
}

/**
 * Get formatted text for Vachnamrut reference
 */
export function formatVachnamrutRef(ref: VachnamrutRef): string {
  let text = `Gadhpur ${ref.gadhpur}, Lesson ${ref.lesson}`;
  if (ref.paragraph) text += `, Para ${ref.paragraph}`;
  if (ref.pageRange) text += ` (pp. ${ref.pageRange})`;
  return text;
}

/**
 * Get formatted text for Vato reference
 */
export function formatVatoRef(ref: VatoRef): string {
  return `${ref.month} ${ref.day}, ${ref.year}`;
}
