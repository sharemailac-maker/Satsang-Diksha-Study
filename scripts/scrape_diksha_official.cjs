const fs = require('fs');
const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', err => reject(err));
  });
}

const clean = (txt) => {
  if (!txt) return '';
  return txt
    .replace(/<sup[^>]*>[\s\S]*?<\/sup>/gi, '')
    .replace(/<p[^>]*class=["']fn_[^"']*["'][\s\S]*?<\/p>/gi, '')
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

async function main() {
  const results = {};
  const offsets = [];
  for (let s = 1; s <= 315; s += 5) offsets.push(s);

  console.log(`Starting scrape of ${offsets.length} pages (315 shlokas)...`);

  // Process in batches of 4
  const batchSize = 4;
  for (let i = 0; i < offsets.length; i += batchSize) {
    const batch = offsets.slice(i, i + batchSize);
    await Promise.all(batch.map(async (s) => {
      const url = `https://www.anirdesh.com/diksha/index.php?shlok=${s}`;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const html = await fetchUrl(url);
          const wrapRegex = /<div class=["']shloks_wrap["'] id=["']shlok_wrap_(\d+)["']([\s\S]*?)(?=<div class=["']shloks_wrap["'] id=["']shlok_wrap_|\s*<div id=["']pagination["']|\s*<\/body>)/gi;
          let m;
          while ((m = wrapRegex.exec(html)) !== null) {
            const id = parseInt(m[1]);
            const block = m[2];

            const extractParas = (cls) => {
              const regex = new RegExp('<p[^>]*class=["\'][^"\']*' + cls + '[^"\']*["\'][^>]*>([\\s\\S]*?)<\\/p>', 'gi');
              const list = [];
              let p;
              while ((p = regex.exec(block)) !== null) {
                const c = clean(p[1]);
                if (c) list.push(c);
              }
              return list.join('\n');
            };

            results[id] = {
              id,
              sansHi: extractParas('shlok_hi'),
              sansGu: extractParas('shlok_gu'),
              sansEn: extractParas('shlok_trans') || extractParas('shlok_en'),
              meaningGu: extractParas('meaning_gu'),
              meaningHi: extractParas('meaning_hi'),
              meaningEn: extractParas('meaning_en'),
              meaningMr: extractParas('meaning_mr'),
              meaningPa: extractParas('meaning_pa'),
              meaningEs: extractParas('meaning_es'),
              meaningFr: extractParas('meaning_fr'),
              meaningDe: extractParas('meaning_de'),
              meaningPl: extractParas('meaning_pl'),
              meaningPt: extractParas('meaning_pt'),
              meaningEl: extractParas('meaning_el'),
              meaningRu: extractParas('meaning_ru')
            };
          }
          break;
        } catch (err) {
          console.log(`Error on shlok ${s} attempt ${attempt}:`, err.message);
          await new Promise(r => setTimeout(r, 1000));
        }
      }
    }));
    console.log(`Processed up to page index ${Math.min(i + batchSize, offsets.length)} / ${offsets.length}, total shlokas: ${Object.keys(results).length}`);
  }

  const ids = Object.keys(results).map(Number).sort((a,b) => a-b);
  console.log(`Finished! Total shlokas: ${ids.length}, range: ${ids[0]} to ${ids[ids.length-1]}`);
  fs.writeFileSync('/tmp/anirdesh_diksha_all_scraped.json', JSON.stringify(results, null, 2));
  console.log('Successfully saved /tmp/anirdesh_diksha_all_scraped.json');
}

main();
