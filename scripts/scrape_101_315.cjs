const fs = require('fs');
const path = require('path');

async function fetchHtml(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return await res.text();
}

function cleanHtml(raw) {
  if (!raw) return '';
  return raw
    .replace(/^[^>]*>/, '') // remove opening style="..." if matched
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>\s*<p[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s*GUJ\s*/g, '')
    .replace(/\s*GTr\s*/g, '')
    .replace(/\s*HIN\s*/g, '')
    .replace(/\s*ENG\s*/g, '')
    .replace(/\s*MAR\s*/g, '')
    .replace(/\s*PUN\s*/g, '')
    .replace(/\s*SPA\s*/g, '')
    .replace(/\s*FRE\s*/g, '')
    .replace(/\s*GER\s*/g, '')
    .replace(/\n\s*\n+/g, '\n')
    .trim();
}

function extractDivContent(html, idPrefix, idNum) {
  const target = `id="${idPrefix}_${idNum}"`;
  const idx = html.indexOf(target);
  if (idx === -1) return '';
  
  // Find closing </div> for this div
  // The structure is <div class="..." id="..." ...> ... </div>
  const afterTag = html.indexOf('>', idx);
  if (afterTag === -1) return '';
  
  // We can search for the next container div
  // In anirdesh, sections are inside <div ... id="something_X"> <p>...</p> </div>
  const endIdx = html.indexOf('</div>', afterTag);
  if (endIdx === -1) return '';
  
  return html.slice(afterTag + 1, endIdx);
}

// Chapter metadata and shloka ranges
const chapterRanges = [
  { id: 1, range: [1, 4], gu: "પ્રસ્તાવના અને મંગલાચરણ", hi: "प्रस्तावना एवं मंगलाचरण", en: "Introduction & Auspicious Invocation" },
  { id: 2, range: [5, 17], gu: "શાસ્ત્ર નિર્માણ હેતુ અને સ્વરૂપ", hi: "शास्त्र निर्माण हेतु एवं स्वरूप", en: "Purpose and Nature of the Scripture" },
  { id: 3, range: [18, 44], gu: "સ્વરૂપ નિશ્ચય અને ઉપાસના સિદ્ધાંત", hi: "स्वरूप निश्चय एवं उपासना सिद्धांत", en: "Definite Knowledge of God & Core Upasana" },
  { id: 4, range: [45, 76], gu: "નિત્ય કર્મ અને પ્રાતઃપૂજા વિધિ", hi: "नित्य कर्म एवं प्रातःपूजा विधि", en: "Daily Routine & Morning Puja Ritual" },
  { id: 5, range: [77, 115], gu: "ધર્મ અને આહારશુદ્ધિ નિયમો", hi: "धर्म एवं आहारशुद्धि नियम", en: "Moral Codes & Dietary Purity" },
  { id: 6, range: [116, 160], gu: "સદાચાર, કર્તવ્ય અને વ્યવહાર શુદ્ધિ", hi: "सदाचार, कर्तव्य एवं व्यवहार शुद्धि", en: "Right Conduct, Duties & Pure Living" },
  { id: 7, range: [161, 200], gu: "સત્સંગ સભા, ઘરસભા અને સત્સંગ પ્રવૃત્તિ", hi: "सत्संग सभा, घरसभा एवं सत्संग गतिविधि", en: "Satsang Assembly, Ghar Sabha & Spiritual Gatherings" },
  { id: 8, range: [201, 250], gu: "અંતઃશત્રુ જય અને નિર્દોષબુદ્ધિ", hi: "अंतःशत्रु जय एवं निर्दोषबुद्धि", en: "Overcoming Inner Enemies & Pure Vision (Nirdoshbuddhi)" },
  { id: 9, range: [251, 290], gu: "અક્ષર-પુરુષોત્તમ ઉપાસના અને ગુરુભક્તિ", hi: "अक्षर-पुरुषोत्तम उपासना एवं गुरुभक्ति", en: "Akshar-Purushottam Upasana & Guru Devotion" },
  { id: 10, range: [291, 315], gu: "ઉપસંહાર, આશીર્વાદ અને ફલશ્રુતિ", hi: "उपसंहार, आशीर्वाद एवं फलश्रुति", en: "Conclusion, Blessings & Fruits of Study" }
];

function getChapterInfo(shlokaId) {
  for (const c of chapterRanges) {
    if (shlokaId >= c.range[0] && shlokaId <= c.range[1]) {
      return c;
    }
  }
  return chapterRanges[chapterRanges.length - 1];
}

async function scrapeAll() {
  console.log('Fetching and parsing authentic shlokas 101 to 315 from Anirdesh...');
  const fetchedShlokas = [];

  for (let startShlok = 101; startShlok <= 315; startShlok += 5) {
    const url = `http://www.anirdesh.com/diksha/index.php?shlok=${startShlok}&increment=5`;
    process.stdout.write(`Fetching ${startShlok} to ${Math.min(startShlok + 4, 315)}... `);
    
    let html = '';
    let retries = 3;
    while (retries > 0) {
      try {
        html = await fetchHtml(url);
        break;
      } catch (err) {
        retries--;
        console.log(`Retry ${3 - retries}...`);
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    for (let id = startShlok; id <= Math.min(startShlok + 4, 315); id++) {
      // Find sections for this shloka
      // We can use extractBetween or regex
      const sanskritRaw = extractDivContent(html, 'sanskrit_html', id);
      const gujSansRaw = extractDivContent(html, 'gujarati_sans_html', id);
      const transRaw = extractDivContent(html, 'sanskrit_trans_html', id);
      const gujMeaningRaw = extractDivContent(html, 'gujarati_html', id);
      const hindiMeaningRaw = extractDivContent(html, 'hindi_html', id);
      const engMeaningRaw = extractDivContent(html, 'english_html', id);

      const sanskritDevanagari = cleanHtml(sanskritRaw);
      const sanskritGujarati = cleanHtml(gujSansRaw);
      const sanskritIast = cleanHtml(transRaw);
      const meaningGu = cleanHtml(gujMeaningRaw);
      const meaningHi = cleanHtml(hindiMeaningRaw);
      const meaningEn = cleanHtml(engMeaningRaw);

      if (!sanskritDevanagari) {
        console.error(`\nWARNING: Shloka ${id} Devanagari is empty!`);
      }

      const chInfo = getChapterInfo(id);

      // Generate a short title from Gujarati meaning or Sanskrit first line
      const firstLineGu = meaningGu.split('.')[0] || meaningGu.split('(')[0] || `શ્લોક ${id}`;
      const shortTitleGu = firstLineGu.length > 50 ? firstLineGu.slice(0, 48) + '...' : firstLineGu;

      const firstLineHi = meaningHi.split('.')[0] || meaningHi.split('(')[0] || `श्लोक ${id}`;
      const shortTitleHi = firstLineHi.length > 50 ? firstLineHi.slice(0, 48) + '...' : firstLineHi;

      const firstLineEn = meaningEn.split('.')[0] || `Verse ${id}`;
      const shortTitleEn = firstLineEn.length > 60 ? firstLineEn.slice(0, 58) + '...' : firstLineEn;

      fetchedShlokas.push({
        id,
        chapterId: chInfo.id,
        chapterGu: chInfo.gu,
        chapterHi: chInfo.hi,
        chapterEn: chInfo.en,
        titleGu: shortTitleGu.trim(),
        titleHi: shortTitleHi.trim(),
        titleEn: shortTitleEn.trim(),
        sanskritDevanagari,
        sanskritGujarati,
        sanskritIast,
        meaningGu,
        meaningHi,
        meaningEn,
        tags: ["Satsang Diksha", `Verse ${id}`, chInfo.en.split(' ')[0]]
      });
    }
    console.log('done.');
    // small delay to be gentle
    await new Promise(r => setTimeout(r, 100));
  }

  console.log(`Total shlokas fetched: ${fetchedShlokas.length}`);
  fs.writeFileSync('/tmp/scraped_101_315.json', JSON.stringify(fetchedShlokas, null, 2));
  console.log('Saved to /tmp/scraped_101_315.json');
}

scrapeAll().catch(err => {
  console.error('Error:', err);
});
