import fs from 'fs';
import https from 'https';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    });
  });
}

function cleanText(txt) {
  if (!txt) return '';
  return txt
    .replace(/<sup[^>]*>.*?<\/sup>/gi, '')
    .replace(/<span class="lang-badge[^"]*">[\s\S]*?<\/span>/gi, '')
    .replace(/<p class="fn_[^"]*">[\s\S]*?<\/p>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>\s*<p[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s+/g, '\n')
    .replace(/\s+\n/g, '\n')
    .trim();
}

function extractSection(html, id) {
  const marker = 'id="' + id + '"';
  const idx = html.indexOf(marker);
  if (idx === -1) return '';
  const start = html.indexOf('>', idx) + 1;
  
  // Find the end of this div container by counting open/close div tags
  let depth = 1;
  let pos = start;
  while (depth > 0 && pos < html.length) {
    const nextOpen = html.indexOf('<div', pos);
    const nextClose = html.indexOf('</div>', pos);
    if (nextClose === -1) break;
    
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      pos = nextOpen + 4;
    } else {
      depth--;
      if (depth === 0) {
        return cleanText(html.substring(start, nextClose));
      }
      pos = nextClose + 6;
    }
  }
  return cleanText(html.substring(start, Math.min(start + 1500, html.length)));
}

async function scrapeAll() {
  console.log('Starting full scrape of 315 shlokas from anirdesh.com/diksha...');
  const allShlokas = [];

  for (let s = 1; s <= 315; s += 5) {
    const url = `https://www.anirdesh.com/diksha/index.php?shlok=${s}&increment=5`;
    let html = '';
    for (let attempt = 1; attempt <= 4; attempt++) {
      try {
        html = await fetchUrl(url);
        if (html.includes(`id="sanskrit_html_${s}"`)) {
          break;
        }
      } catch (err) {
        console.error(`Attempt ${attempt} failed for shlok ${s}:`, err.message);
      }
      await new Promise(r => setTimeout(r, 1200));
    }

    const endShlok = Math.min(s + 4, 315);
    for (let i = s; i <= endShlok; i++) {
      const sanskritDevanagari = extractSection(html, `sanskrit_html_${i}`);
      const sanskritGujarati = extractSection(html, `gujarati_sans_html_${i}`);
      const sanskritIast = extractSection(html, `sanskrit_trans_html_${i}`);
      const meaningGu = extractSection(html, `gujarati_html_${i}`);
      const meaningEn = extractSection(html, `english_html_${i}`);
      const meaningHi = extractSection(html, `hindi_html_${i}`);

      allShlokas.push({
        id: i,
        sanskritDevanagari,
        sanskritGujarati,
        sanskritIast,
        meaningGu,
        meaningEn,
        meaningHi
      });
    }
    process.stdout.write(`[${s}-${endShlok}] `);
  }

  console.log(`\nSuccessfully extracted ${allShlokas.length} shlokas.`);
  fs.writeFileSync('anirdesh_315.json', JSON.stringify(allShlokas, null, 2), 'utf8');
  
  const emptySans = allShlokas.filter(s => !s.sanskritDevanagari || !s.sanskritGujarati);
  console.log('Empty Sanskrit count:', emptySans.length);
  if (emptySans.length > 0) {
    console.log('Empty IDs:', emptySans.map(s => s.id));
  }
}

scrapeAll().catch(err => {
  console.error('Fatal scrape error:', err);
  process.exit(1);
});
