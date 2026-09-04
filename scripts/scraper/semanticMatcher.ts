/**
 * Semantic Matcher for Cross-References
 * Matches Satsang Diksha verses with Vachnamrut and Swami ni Vato
 * Uses Gujarati text similarity and concept matching
 * 
 * Output: JSON file with suggested cross-references for manual verification
 */

import * as fs from 'fs';
import * as path from 'path';

interface DikshaVerse {
  id: number;
  title_gu: string;
  sanskrit: string;
  meaning_gu: string;
  chapter: number;
}

interface VachnamrutEntry {
  ref: string;
  subject_gu: string;
  text_gu: string;
}

interface SwaminiVatoEntry {
  prakaran_vat: string;
  category_gu: string;
  text_gu: string;
}

interface SimilarityMatch {
  type: 'vachnamrut' | 'swamini_vato';
  ref: string;
  subject_or_category: string;
  text_snippet: string;
  similarity_score: number;
  matched_keywords: string[];
}

interface CrossReferenceResult {
  diksha_id: number;
  diksha_title_gu: string;
  diksha_meaning_snippet: string;
  suggested_matches: SimilarityMatch[];
}

// Gujarati stop words (common words to exclude from matching)
const GUJARATI_STOP_WORDS = new Set([
  'તે', 'તેમ', 'એ', 'અને', 'કે', 'પણ', 'તો', 'છે', 'હતો', 'હોય',
  'કરવું', 'કરશે', 'નથી', 'નહીં', 'આ', 'તે', 'જે', 'જો', 'કોઈ',
  'ને', 'સાથે', 'વિના', 'માટે', 'મેં', 'તું', 'તમે', 'હું', 'આપણે'
]);

/**
 * Extract keywords from Gujarati text (filtering stop words)
 */
function extractKeywords(text: string): string[] {
  if (!text) return [];
  
  // Split by spaces and punctuation
  const words = text
    .toLowerCase()
    .split(/[\s\.\,\!\?\;\:\(\)]+/)
    .filter(word => word.length > 2 && !GUJARATI_STOP_WORDS.has(word));
  
  return [...new Set(words)]; // Remove duplicates
}

/**
 * Calculate Jaccard similarity between two sets of keywords
 */
function calculateSimilarity(keywords1: string[], keywords2: string[]): number {
  if (keywords1.length === 0 || keywords2.length === 0) return 0;
  
  const set1 = new Set(keywords1);
  const set2 = new Set(keywords2);
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

/**
 * Find common keywords between two texts
 */
function findCommonKeywords(keywords1: string[], keywords2: string[]): string[] {
  const set1 = new Set(keywords1);
  return keywords2.filter(k => set1.has(k));
}

/**
 * Match a single Diksha verse with all Vachnamrut entries
 */
function matchWithVachnamrut(
  verse: DikshaVerse,
  vachnamrutEntries: VachnamrutEntry[],
  topN: number = 3
): SimilarityMatch[] {
  const verseKeywords = extractKeywords(verse.meaning_gu);
  
  const matches = vachnamrutEntries
    .map(entry => {
      const entryKeywords = extractKeywords(entry.text_gu);
      const similarity = calculateSimilarity(verseKeywords, entryKeywords);
      const commonKeywords = findCommonKeywords(verseKeywords, entryKeywords);
      
      return {
        type: 'vachnamrut' as const,
        ref: entry.ref,
        subject_or_category: entry.subject_gu,
        text_snippet: entry.text_gu.substring(0, 200),
        similarity_score: similarity,
        matched_keywords: commonKeywords
      };
    })
    .filter(match => match.similarity_score > 0.1) // Only matches with >10% similarity
    .sort((a, b) => b.similarity_score - a.similarity_score)
    .slice(0, topN);
  
  return matches;
}

/**
 * Match a single Diksha verse with all Swami ni Vato entries
 */
function matchWithSwaminiVato(
  verse: DikshaVerse,
  vatoEntries: SwaminiVatoEntry[],
  topN: number = 3
): SimilarityMatch[] {
  const verseKeywords = extractKeywords(verse.meaning_gu);
  
  const matches = vatoEntries
    .map(entry => {
      const entryKeywords = extractKeywords(entry.text_gu);
      const similarity = calculateSimilarity(verseKeywords, entryKeywords);
      const commonKeywords = findCommonKeywords(verseKeywords, entryKeywords);
      
      return {
        type: 'swamini_vato' as const,
        ref: entry.prakaran_vat,
        subject_or_category: entry.category_gu,
        text_snippet: entry.text_gu.substring(0, 200),
        similarity_score: similarity,
        matched_keywords: commonKeywords
      };
    })
    .filter(match => match.similarity_score > 0.1) // Only matches with >10% similarity
    .sort((a, b) => b.similarity_score - a.similarity_score)
    .slice(0, topN);
  
  return matches;
}

/**
 * Main execution
 */
async function run() {
  console.log('🔍 Starting Semantic Matching for Cross-References...\n');
  
  const dataDir = path.join(process.cwd(), 'data', 'scraped');
  
  // Load scraped data
  let dikshaVerses: DikshaVerse[] = [];
  let vachnamrutEntries: VachnamrutEntry[] = [];
  let vatoEntries: SwaminiVatoEntry[] = [];
  
  try {
    const dikshaPath = path.join(dataDir, 'diksha_verses_gu.json');
    const vachnamrutPath = path.join(dataDir, 'vachnamrut_entries_gu.json');
    const vatoPath = path.join(dataDir, 'swamini_vato_entries_gu.json');
    
    if (fs.existsSync(dikshaPath)) {
      dikshaVerses = JSON.parse(fs.readFileSync(dikshaPath, 'utf8'));
      console.log(`✅ Loaded ${dikshaVerses.length} Diksha verses`);
    } else {
      console.warn('⚠️ Diksha verses file not found. Please run scraper first.');
    }
    
    if (fs.existsSync(vachnamrutPath)) {
      vachnamrutEntries = JSON.parse(fs.readFileSync(vachnamrutPath, 'utf8'));
      console.log(`✅ Loaded ${vachnamrutEntries.length} Vachnamrut entries`);
    }
    
    if (fs.existsSync(vatoPath)) {
      vatoEntries = JSON.parse(fs.readFileSync(vatoPath, 'utf8'));
      console.log(`✅ Loaded ${vatoEntries.length} Swami ni Vato entries`);
    }
    
    if (dikshaVerses.length === 0) {
      console.error('❌ No data to process. Exiting.');
      process.exit(1);
    }
    
    // Process each verse
    console.log('\n🔄 Matching verses with cross-references...\n');
    const results: CrossReferenceResult[] = [];
    
    for (let i = 0; i < dikshaVerses.length; i++) {
      const verse = dikshaVerses[i];
      
      const vachnamrutMatches = matchWithVachnamrut(verse, vachnamrutEntries, 3);
      const vatoMatches = matchWithSwaminiVato(verse, vatoEntries, 3);
      
      const allMatches = [...vachnamrutMatches, ...vatoMatches]
        .sort((a, b) => b.similarity_score - a.similarity_score);
      
      results.push({
        diksha_id: verse.id,
        diksha_title_gu: verse.title_gu,
        diksha_meaning_snippet: verse.meaning_gu.substring(0, 200),
        suggested_matches: allMatches
      });
      
      if ((i + 1) % 50 === 0) {
        console.log(`✓ Processed ${i + 1}/${dikshaVerses.length} verses...`);
      }
    }
    
    // Save results
    const outputPath = path.join(dataDir, 'cross_references_suggested.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf8');
    
    console.log(`\n✅ Saved ${results.length} cross-reference suggestions to cross_references_suggested.json`);
    
    // Print sample results
    console.log('\n📊 Sample Results (First 3 Verses):\n');
    results.slice(0, 3).forEach(result => {
      console.log(`\n📖 Shloka ${result.diksha_id}: ${result.diksha_title_gu}`);
      console.log(`   Meaning: ${result.diksha_meaning_snippet.substring(0, 100)}...`);
      
      if (result.suggested_matches.length > 0) {
        console.log(`   Suggested matches:`);
        result.suggested_matches.slice(0, 3).forEach((match, idx) => {
          console.log(`   ${idx + 1}. [${match.type.toUpperCase()}] ${match.ref}`);
          console.log(`      Category: ${match.subject_or_category}`);
          console.log(`      Similarity: ${(match.similarity_score * 100).toFixed(1)}%`);
          console.log(`      Common keywords: ${match.matched_keywords.slice(0, 3).join(', ')}`);
        });
      } else {
        console.log(`   ⚠️  No strong matches found`);
      }
    });
    
  } catch (err) {
    console.error('❌ Error during matching:', err);
    process.exit(1);
  }
}

run();
