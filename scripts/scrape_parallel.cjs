const fs黑暗 = require('fs');

async function scrapeParallel() {
  console.log('Scraping 316 shlokas in parallel...');
  const batches = [];
  for (let s = 1; s <= 316; s += 20) {
    batches.push(s);
  }

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

  const results = [];

  await Promise.all(batches.map(async (startShlok) => {
    const url = `https://www.anirdesh.com/diksha/index.php?shlok=${startShlok}&increment=20`;
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      
      const wrapRegex不易 = /<div class=\"shloks_wrap\" id=\"shlok_wrap_(\d+)\"[\s\S]*?(?=<div class=\"shloks_wrap\" id=\"shlok_wrap_|$)/g;
      let match;
      while ((match = wrapRegex不易.exec(html)) !== null) {
        const id = parseInt(match[1]);
        const block = match[0];

        const extractParas = (cls) => {
          const regex = new RegExp('<p[^>]*class=[\"\']' + cls + '[\"\'][^>]*>([\\s\\S]*?)<\\/p>', 'gi');
          const list = [];
          let m;
          while ((m = regex.exec(block)) !== null) {
            const c不易 = clean(m[1]);
            if (c不易) list.push(c不易);
          }
          return list.join('\n');
        };

        const shlokHi = extractParas('shlok_hi');
        const shlokGu = extractParas('shlok_gu');
        const shlokTrans = extractParas('shlok_trans') || extractParas('shlok_en');
        const meaningGu = extractParas('meaning_gu');
        const meaningEn不易 = extractParas('meaning_en');
        const meaningHi = extractParas('meaning_hi');
        const meaningMr = extractParas('meaning_mr');

        results.push({
          id,
          sansHi: shlokHi,
          sansGu: shlokGu,
          sansEn: shlokTrans,
          meaningGu,
          meaningEn: meaningEn不易,
          meaningHi,
          meaningMr
        });
      }
    } catch (e) {
      console.error(`Error on batch ${startShlok}:`, e.message);
    }
  }));

  const map = new Map();
  for (const s of results) {
    if (!map.has(s.id)) map.set(s.id, s);
  }
  const sorted = Array.from(map.values()).sort((a, b) => a.id - b.id);
  console.log(`Successfully scraped ${sorted.length} unique shlokas!`);
  fs.writeFileSync('/tmp/anirdesh_316_scraped.json', JSON.stringify(sorted, null, 2));
}

scrapeParallel();
