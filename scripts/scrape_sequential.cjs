const fs = require('fs');

async function scrapeSequential() {
  console.log('Scraping 316 shlokas sequentially with increment=15...');
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

  for (let s = 1; s <= 316; s += 15) {
    const url = `https://www.anirdesh.com/diksha/index.php?shlok=${s}&increment=15`;
    let success = false;
    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        const res = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const html = await res.text();

        const wrapRegex = /<div class=\"shloks_wrap\" id=\"shlok_wrap_(\d+)\"[\s\S]*?(?=<div class=\"shloks_wrap\" id=\"shlok_wrap_|$)/g;
        let match;
        let batchCount = 0;
        while ((match = wrapRegex.exec(html)) !== null) {
          const id = parseInt(match[1]);
          const block = match[0];

          const extractParas = (cls) => {
            const regex = new RegExp('<p[^>]*class=[\"\']' + cls + '[\"\'][^>]*>([\\s\\S]*?)<\\/p>', 'gi');
            const list = [];
            let m;
            while ((m = regex.exec(block)) !== null) {
              const c = clean(m[1]);
              if (c) list.push(c);
            }
            return list.join('\n');
          };

          const shlokHi = extractParas('shlok_hi');
          const shlokGu = extractParas('shlok_gu');
          const shlokTrans = extractParas('shlok_trans') || extractParas('shlok_en');
          const meaningGu = extractParas('meaning_gu');
          const meaningEn = extractParas('meaning_en');
          const meaningHi = extractParas('meaning_hi');
          const meaningMr = extractParas('meaning_mr');

          allShlokas.push({
            id,
            sansHi: shlokHi,
            sansGu: shlokGu,
            sansEn: shlokTrans,
            meaningGu,
            meaningEn,
            meaningHi,
            meaningMr
          });
          batchCount++;
        }
        console.log(`Shlok ${s} -> fetched ${batchCount} shlokas.`);
        success = true;
        break;
      } catch (err) {
        console.warn(`Attempt ${attempt} for shlok ${s} failed: ${err.message}`);
        await new Promise(r => setTimeout(r, 600 * attempt));
      }
    }
    if (!success) {
      console.error(`Failed to fetch shlok ${s}`);
    }
    await new Promise(r => setTimeout(r, 200));
  }

  const map = new Map();
  for (const s of allShlokas) {
    if (!map.has(s.id)) map.set(s.id, s);
  }
  const sorted = Array.from(map.values()).sort((a, b) => a.id - b.id);
  console.log(`Finished! Total unique shlokas parsed: ${sorted.length}`);
  fs.writeFileSync('/tmp/anirdesh_316_scraped.json', JSON.stringify(sorted, null, 2));
}

scrapeSequential();
