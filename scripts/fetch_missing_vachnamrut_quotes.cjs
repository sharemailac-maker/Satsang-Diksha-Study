const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI();

const STORE_PATH = path.join(__dirname, '../src/data/vachnamrutStore.json');
const CONCORDANCE_PATH = path.join(__dirname, '../src/data/concordanceData.ts');

const guDigits = { '૦': '0', '૧': '1', '૨': '2', '૩': '3', '૪': '4', '૫': '5', '૬': '6', '૭': '7', '૮': '8', '૯': '9' };
const hiDigits = { '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9' };

function toAsciiDigits(s) {
  return s
    .replace(/[૦-૯]/g, d => guDigits[d] || d)
    .replace(/[०-९]/g, d => hiDigits[d] || d);
}

function normalizeVachnamrutCode(sec) {
  if (!sec) return '';
  let s = toAsciiDigits(sec).trim();

  if (/અશ્લાલી|असलाली|Aslali/i.test(s)) {
    return 'Ashlali-1';
  }

  s = s.replace(/ગઢડા પ્રથમ|ગ\.પ્ર\.|ગ\. પ્ર\.|गढ़डा प्रथम|ग\.પ્ર\.|ग\.प्र\.|Gadhada I\b|Gadhada 1\b/gi, 'GI-');
  s = s.replace(/ગઢડા મધ્ય|ગ\.મ\.|ગ\. મ\.|गढ़डा मध्य|ग\.મ\.|ग\.म\.|Gadhada II\b|Gadhada 2\b/gi, 'GII-');
  s = s.replace(/ગઢડા અંત્ય|ગ\.અં\.|ગ\. અં\.|गढ़डा अन्त्य|ग\.અં\.|ग\.अं\.|Gadhada III\b|Gadhada 3\b/gi, 'GIII-');

  s = s.replace(/સારંગપુર|સારંગ\.|सारंगपुर|Sarangpur/gi, 'Sar-');
  s = s.replace(/કારિયાણી|કારિ\.|कारियाણી|Kariyani/gi, 'Kar-');
  s = s.replace(/લોયા|લો\.|लोયા|लोया|Loya/gi, 'Loya-');
  s = s.replace(/પંચાળા|पंचाल|Panchala/gi, 'Pan-');
  s = s.replace(/વરતાલ|વર\.|વડતાલ|वड़ताल|वडताल|Vartal/gi, 'Var-');
  s = s.replace(/અમદાવાદ|અમદા\.|અમ\.|अहमदाबाद|Ahmedabad/gi, 'Amd-');
  s = s.replace(/જેતલપુર|જેત\.|જેતલ\.|जेत्तलपुर|जेतलपुर|Jetalpur/gi, 'Jetalpur-');

  const match = s.match(/([A-Za-z]+)[-\s]+(\d+)/);
  if (match) {
    return `${match[1]}-${match[2]}`;
  }
  return '';
}

async function fetchBatch(batch) {
  const prompt = `You are an expert scholar of the sacred Hindu scripture "The Vachnamrut" (વચનામૃત) of Bhagwan Swaminarayan (BAPS authentic edition).
Provide the exact, authentic quotes as written in the original Vachnamrut for each of the following section codes:
${batch.map(b => `${b.code} (${b.raw})`).join(', ')}

For each Vachnamrut section, extract the most important core theological/spiritual passage (1 to 2 key quotes) with:
- "c": canonical section code (e.g. "${batch[0].code}")
- "sg": Gujarati section name (e.g. "ગઢડા પ્રથમ ૧")
- "sh": Hindi section name (e.g. "गढ़डा प्रथम १")
- "se": English section name (e.g. "Gadhada I-1")
- "tg": Gujarati title (e.g. "અખંડ વૃત્તિનું")
- "th": Hindi title (e.g. "अखंड वृत्ति का")
- "te": English title (e.g. "Uninterrupted Focus")
- "q": array of quotes with exact words:
  - "g": exact original Gujarati words written in Vachnamrut ("શ્રીજીમહારાજ બોલ્યા જે...")
  - "h": exact authentic Hindi translation
  - "e": exact official BAPS English translation

CRITICAL:
1. Provide the EXACT same words written in Vachnamrut as per its numbers mentioned in reference.
2. Do NOT paraphrase or invent quotes. Use the authentic text from Bhagwan Swaminarayan's discourses.
3. Return a JSON object where the keys are the exact section codes (${batch.map(b => `"${b.code}"`).join(', ')}).`;

  let attempts = 0;
  while (attempts < 3) {
    try {
      const res = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });
      const parsed = JSON.parse(res.text);
      return parsed;
    } catch (err) {
      attempts++;
      console.warn(`Attempt ${attempts} failed for batch:`, err.message);
      if (attempts >= 3) throw err;
      await new Promise(r => setTimeout(r, 2000 * attempts));
    }
  }
}

async function main() {
  console.log('Reading concordance data...');
  const cContent = fs.readFileSync(CONCORDANCE_PATH, 'utf8');
  const store = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));

  const vRegex = /"t":\s*"v",\s*"sec":\s*"([^"]+)"/g;
  let m;
  const uniqueMap = new Map();

  while ((m = vRegex.exec(cContent)) !== null) {
    const raw = m[1];
    const code = normalizeVachnamrutCode(raw);
    if (code && !uniqueMap.has(code)) {
      uniqueMap.set(code, raw);
    }
  }

  const missing = [];
  for (const [code, raw] of uniqueMap.entries()) {
    if (!store[code] || !store[code].q || store[code].q.length === 0) {
      missing.push({ code, raw });
    }
  }

  console.log(`Total unique Vachnamruts in concordance: ${uniqueMap.size}`);
  console.log(`Already present with quotes: ${uniqueMap.size - missing.length}`);
  console.log(`Missing quotes: ${missing.length}`);

  if (missing.length === 0) {
    console.log('All Vachnamruts already have quotes!');
    return;
  }

  const BATCH_SIZE = 4;
  for (let i = 0; i < missing.length; i += BATCH_SIZE) {
    const batch = missing.slice(i, i + BATCH_SIZE);
    console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(missing.length / BATCH_SIZE)}: ${batch.map(b => b.code).join(', ')}...`);

    const result = await fetchBatch(batch);
    let addedCount = 0;

    for (const b of batch) {
      const entry = result[b.code];
      if (entry && Array.isArray(entry.q) && entry.q.length > 0) {
        store[b.code] = {
          c: b.code,
          sg: entry.sg || b.raw,
          sh: entry.sh || entry.sg || b.raw,
          se: entry.se || b.code,
          tg: entry.tg || '',
          th: entry.th || '',
          te: entry.te || '',
          q: entry.q.map(quote => ({
            g: quote.g || '',
            h: quote.h || '',
            e: quote.e || ''
          }))
        };
        addedCount++;
      } else {
        console.warn(`Warning: Entry for ${b.code} was missing or empty in result!`);
      }
    }

    // Save incrementally
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
    console.log(`Saved ${addedCount} entries to store. Current store total: ${Object.keys(store).length}`);

    // Small delay to respect rate limits
    await new Promise(r => setTimeout(r, 600));
  }

  console.log('Finished fetching and adding all missing Vachnamrut quotes!');
}

main().catch(err => {
  console.error('Fatal error in script:', err);
  process.exit(1);
});
