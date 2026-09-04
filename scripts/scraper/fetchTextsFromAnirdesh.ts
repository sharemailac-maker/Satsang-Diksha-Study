/**
 * Web Scraper for Anirdesh.com
 * Fetches Gujarati texts for:
 * - Satsang Diksha (all 315 verses with meanings)
 * - Vachnamrut (by subject/topic)
 * - Swami ni Vato (by category and prakaran/vat number)
 * 
 * Output: JSON files with extracted Gujarati text for semantic matching
 */

import fetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path';
import { JSDOM } from 'jsdom';

interface DikshaVerse {
  id: number;
  title_gu: string;
  sanskrit: string;
  meaning_gu: string;
  chapter: number;
}

interface VachnamrutEntry {
  ref: string; // e.g., "ગઢડા પ્રથમ ૧"
  subject_gu: string;
  text_gu: string;
}

interface SwaminiVatoEntry {
  prakaran_vat: string; // e.g., "૧/૩૨૦"
  category_gu: string;
  text_gu: string;
}

const BASE_URL_DIKSHA = 'https://www.anirdesh.com/diksha';
const BASE_URL_VACHNAMRUT = 'https://anirdesh.com/vachanamrut';
const BASE_URL_VATO = 'https://anirdesh.com/vato';

const OUTPUT_DIR = path.join(process.cwd(), 'data', 'scraped');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Fetch Satsang Diksha verses with Gujarati meanings
 */
async function fetchSatsangDiksha(): Promise<DikshaVerse[]> {
  console.log('🔄 Fetching Satsang Diksha verses...');
  
  const verses: DikshaVerse[] = [];
  
  try {
    // Fetch index page to get all verses
    const indexUrl = `${BASE_URL_DIKSHA}/index.php?lang=gu`;
    const response = await fetch(indexUrl);
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Find all verse links
    const verseLinks = document.querySelectorAll('a[href*="id="]');
    console.log(`Found ${verseLinks.length} verse links`);
    
    // Process each verse (limit for testing)
    let count = 0;
    for (const link of verseLinks) {
      if (count >= 315) break; // Maximum 315 verses
      
      const href = link.getAttribute('href');
      if (!href) continue;
      
      const verseId = parseInt(href.match(/id=(\d+)/)?.[1] || '0');
      if (verseId === 0) continue;
      
      try {
        const verseUrl = `${BASE_URL_DIKSHA}/${href}`;
        const verseResponse = await fetch(verseUrl);
        const verseHtml = await verseResponse.text();
        const verseDom = new JSDOM(verseHtml);
        const verseDoc = verseDom.window.document;
        
        // Extract verse data
        const titleElem = verseDoc.querySelector('h1, .verse-title');
        const sanskritElem = verseDoc.querySelector('.sanskrit, .verse-sanskrit');
        const meaningElem = verseDoc.querySelector('.meaning-gu, .meaning, .explanation');
        
        const title = titleElem?.textContent?.trim() || `Verse ${verseId}`;
        const sanskrit = sanskritElem?.textContent?.trim() || '';
        const meaning = meaningElem?.textContent?.trim() || '';
        
        verses.push({
          id: verseId,
          title_gu: title,
          sanskrit: sanskrit,
          meaning_gu: meaning,
          chapter: Math.ceil(verseId / 50) // Approximate
        });
        
        count++;
        if (count % 50 === 0) {
          console.log(`✓ Fetched ${count} verses...`);
        }
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (err) {
        console.warn(`⚠️ Error fetching verse ${verseId}:`, err);
      }
    }
    
    console.log(`✅ Fetched ${verses.length} Satsang Diksha verses`);
  } catch (err) {
    console.error('❌ Error fetching Satsang Diksha:', err);
  }
  
  return verses;
}

/**
 * Fetch Vachnamrut entries by subject
 */
async function fetchVachnamrut(): Promise<VachnamrutEntry[]> {
  console.log('🔄 Fetching Vachnamrut entries by subject...');
  
  const entries: VachnamrutEntry[] = [];
  
  try {
    // Fetch subject index
    const indexUrl = `${BASE_URL_VACHNAMRUT}/appendix-g-gu.php?lang=gu`;
    const response = await fetch(indexUrl);
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Find all subject links
    const subjectLinks = document.querySelectorAll('a[href*="appendix"]');
    console.log(`Found ${subjectLinks.length} subject categories`);
    
    let count = 0;
    for (const link of subjectLinks) {
      const href = link.getAttribute('href');
      if (!href || !href.includes('subject')) continue;
      
      try {
        const subjectUrl = `${BASE_URL_VACHNAMRUT}/${href}`;
        const subjectResponse = await fetch(subjectUrl);
        const subjectHtml = await subjectResponse.text();
        const subjectDom = new JSDOM(subjectHtml);
        const subjectDoc = subjectDom.window.document;
        
        const subject = link.textContent?.trim() || 'Unknown';
        
        // Extract all vachnamrut references under this subject
        const refElements = subjectDoc.querySelectorAll('.reference, .vachnamrut-ref, li');
        
        for (const elem of refElements) {
          const text = elem.textContent?.trim();
          if (!text || text.length < 20) continue;
          
          // Try to extract reference number (e.g., "ગઢડા પ્રથમ ૧")
          const refMatch = text.match(/ગઢડા\s+\w+\s+\d+/);
          const ref = refMatch ? refMatch[0] : `Subject: ${subject}`;
          
          entries.push({
            ref: ref,
            subject_gu: subject,
            text_gu: text.substring(0, 500) // Limit text length
          });
          
          count++;
        }
        
        if (count % 50 === 0) {
          console.log(`✓ Fetched ${count} Vachnamrut entries...`);
        }
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (err) {
        console.warn(`⚠️ Error fetching subject:`, err);
      }
    }
    
    console.log(`✅ Fetched ${entries.length} Vachnamrut entries`);
  } catch (err) {
    console.error('❌ Error fetching Vachnamrut:', err);
  }
  
  return entries;
}

/**
 * Fetch Swami ni Vato entries by category
 */
async function fetchSwaminiVato(): Promise<SwaminiVatoEntry[]> {
  console.log('🔄 Fetching Swami ni Vato entries by category...');
  
  const entries: SwaminiVatoEntry[] = [];
  
  try {
    // Fetch category index
    const indexUrl = `${BASE_URL_VATO}/index.php?by=category&lang=gu`;
    const response = await fetch(indexUrl);
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Find all category links
    const categoryLinks = document.querySelectorAll('a[href*="category="]');
    console.log(`Found ${categoryLinks.length} categories`);
    
    let count = 0;
    for (const link of categoryLinks) {
      const href = link.getAttribute('href');
      if (!href) continue;
      
      try {
        const categoryUrl = `${BASE_URL_VATO}/${href}`;
        const categoryResponse = await fetch(categoryUrl);
        const categoryHtml = await categoryResponse.text();
        const categoryDom = new JSDOM(categoryHtml);
        const categoryDoc = categoryDom.window.document;
        
        const category = link.textContent?.trim() || 'Unknown';
        
        // Extract all vato entries
        const vatoElements = categoryDoc.querySelectorAll('.vato-entry, .entry, li');
        
        for (const elem of vatoElements) {
          const text = elem.textContent?.trim();
          if (!text || text.length < 20) continue;
          
          // Try to extract prakaran/vat number (e.g., "૧/૩૨૦")
          const refMatch = text.match(/(\d+)\/(\d+)/);
          const prakaran = refMatch ? `${refMatch[1]}/${refMatch[2]}` : `Category: ${category}`;
          
          entries.push({
            prakaran_vat: prakaran,
            category_gu: category,
            text_gu: text.substring(0, 500)
          });
          
          count++;
        }
        
        if (count % 50 === 0) {
          console.log(`✓ Fetched ${count} Swami ni Vato entries...`);
        }
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (err) {
        console.warn(`⚠️ Error fetching category:`, err);
      }
    }
    
    console.log(`✅ Fetched ${entries.length} Swami ni Vato entries`);
  } catch (err) {
    console.error('❌ Error fetching Swami ni Vato:', err);
  }
  
  return entries;
}

/**
 * Main execution
 */
async function run() {
  console.log('📚 Starting Anirdesh.com Text Scraper...\n');
  
  try {
    // Fetch all three text sources
    const diksha = await fetchSatsangDiksha();
    const vachnamrut = await fetchVachnamrut();
    const vatoEntries = await fetchSwaminiVato();
    
    // Save to JSON files
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'diksha_verses_gu.json'),
      JSON.stringify(diksha, null, 2),
      'utf8'
    );
    console.log(`✅ Saved ${diksha.length} Diksha verses to diksha_verses_gu.json`);
    
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'vachnamrut_entries_gu.json'),
      JSON.stringify(vachnamrut, null, 2),
      'utf8'
    );
    console.log(`✅ Saved ${vachnamrut.length} Vachnamrut entries to vachnamrut_entries_gu.json`);
    
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'swamini_vato_entries_gu.json'),
      JSON.stringify(vatoEntries, null, 2),
      'utf8'
    );
    console.log(`✅ Saved ${vatoEntries.length} Swami ni Vato entries to swamini_vato_entries_gu.json`);
    
    // Summary
    console.log('\n📊 Scraping Complete!');
    console.log(`Total Satsang Diksha verses: ${diksha.length}`);
    console.log(`Total Vachnamrut entries: ${vachnamrut.length}`);
    console.log(`Total Swami ni Vato entries: ${vatoEntries.length}`);
    
  } catch (err) {
    console.error('❌ Fatal error:', err);
    process.exit(1);
  }
}

run();
