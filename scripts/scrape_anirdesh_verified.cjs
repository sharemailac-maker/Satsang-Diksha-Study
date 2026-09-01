const fs = require('fs');

async function scrapeAll() {
  console.log('Fetching all 316 shlokas page by page (s += 5) from anirdesh.com...');
  const allShlokas = [];

  const clean = (txt) => {
    if (!txt) return '';
    return txt
      .replace(/<sup[^>]*>[\s\S]*?<\/sup>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#039;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, ' ')
      .trim();
  };

  for (let s = 1; s <= 316; s += 5) {
    const url = `https://www.anirdesh.com/diksha/index.php?shlok=${s}`;
    let success = false;
    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        const res = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const html = await res.text();

        const splitRegex = /<div[^>]*id=["']shlok_wrap_(\d+)["']/gi;
        const parts = html.split(splitRegex);
        let count = 0;
        for (let i = 1; i < parts.length; i += 2) {
          const id = parseInt(parts[i]);
          const block = parts[i + 1];

          const extractParas = (cls) => {
            const regex = new RegExp('<p[^>]*class=["\'][^"\']*' + cls + '[^"\']*["\'][^>]*>([\\s\\S]*?)<\\/p>', 'gi');
            const list = [];
            let m;
            while ((m = regex.exec(block)) !== null) {
              const c = clean(m[1]);
              if (c) list.push(c);
            }
            return list.join('\n');
          };

          const sansHi = extractParas('shlok_hi');
          const sansGu = extractParas('shlok_gu');
          const sansEn = extractParas('shlok_trans') || extractParas('shlok_en');
          const meaningGu = extractParas('meaning_gu');
          const meaningEn = extractParas('meaning_en');
          const meaningHi = extractParas('meaning_hi');
          const meaningMr = extractParas('meaning_mr');

          allShlokas.push({
            id,
            sansHi,
            sansGu,
            sansEn,
            meaningGu,
            meaningEn,
            meaningHi,
            meaningMr
          });
          count++;
        }
        process.stdout.write(`[${s}..${s+count-1}] `);
        success = true;
        break;
      } catch (err) {
        console.warn(`\nAttempt ${attempt} failed for ${s}: ${err.message}`);
        await new Promise(r => setTimeout(r, 400 * attempt));
      }
    }
    await new Promise(r => setTimeout(r, 60));
  }

  console.log('\nDeduplicating...');
  const map = new Map();
  for (const s of allShlokas) {
    if (!map.has(s.id)) map.set(s.id, s);
  }
  const sorted = Array.from(map.values()).sort((a, b) => a.id - b.id);
  console.log(`Finished scraping! Total unique shlokas: ${sorted.length}`);
  fs.writeFileSync('/tmp/anirdesh_316_scraped.json', JSON.stringify(sorted, null, 2));
}

scrapeAll();
