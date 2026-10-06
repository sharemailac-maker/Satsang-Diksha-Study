# Missing Cross-Reference Quotations Template

This file helps you systematically add missing Vachnamrut and Swamini Vato quotations for Satsang Diksha shlokas.

## How to Identify Missing Shlokas

1. Open the app and go to the "Cross References" tab
2. Note which shlokas show "No references available"
3. Add the missing quotations using this template

## Data Structure Reference

Each quotation entry follows this format:

### Vachnamrut Reference:
```javascript
{
  type: 'vachnamrut',
  title: 'વચનામૃત ગઢડા પ્રથમ [NUMBER]',
  titleGu: 'વચનામૃત ગઢડા પ્રથમ [NUMBER]',
  titleHi: 'वचनामृत गढडा प्रथम [NUMBER]',
  titleEn: 'Vachnamrut Gadhada I-[NUMBER]',
  section: 'ગઢડા પ્રથમ [NUMBER]',
  textGu: '[EXACT GUJARATI QUOTATION]',
  textHi: '[EXACT HINDI TRANSLATION]',
  textEn: '[ENGLISH MEANING]',
  correlationNote: '[EXPLANATION OF CONNECTION TO SHLOKA - GUJARATI]'
}
```

### Swamini Vato Reference:
```javascript
{
  type: 'swamini_vato',
  title: 'સ્વામીની વાતો પ્રકરણ [CHAPTER]/[NUMBER]',
  titleGu: 'સ્વામીની વાતો પ્રકરણ [CHAPTER]/[NUMBER]',
  titleHi: 'स्वामीनी बातें प्रकरण [CHAPTER]/[NUMBER]',
  titleEn: 'Swamini Vato Chapter [CHAPTER]/[NUMBER]',
  section: 'પ્રકરણ [CHAPTER]/[NUMBER]',
  textGu: '[EXACT GUJARATI QUOTATION]',
  textHi: '[EXACT HINDI TRANSLATION]',
  textEn: '[ENGLISH MEANING]',
  correlationNote: '[EXPLANATION OF CONNECTION - GUJARATI]'
}
```

## Steps to Add Missing Quotations

### 1. Edit the script: `scripts/update_cross_refs.js`

Find the shloka range in the `getCrossReferencesForShloka()` function:

```javascript
else if (id <= [END_OF_RANGE]) {
  refs.push({
    // Add Vachnamrut reference here
  });
  refs.push({
    // Add Swamini Vato reference here
  });
}
```

### 2. Format Requirements

**Gujarati Text (Devanagari-to-Gujarati Guide):**
- Use exact text from authentic sources
- Maintain original spacing and punctuation
- Include all diacritical marks (ં, ः, ઃ, etc.)

**English Translation:**
- Should capture the meaning, not be word-for-word
- Should relate clearly to the Shloka

**Correlation Note:**
- Keep in Gujarati language
- Explain the thematic connection
- Reference the specific chapter/verse concept

### 3. Example Entry

For **Shloka 150** (about maintaining purity and discipline):

```javascript
else if (id <= 170) {
  refs.push({
    type: 'vachnamrut',
    title: 'વચનામૃત ગઢડા અંત્ય ૪',
    titleGu: 'વચનામૃત ગઢડા અંત્ય ૪',
    titleHi: 'वचनामृत गढडा अंत्य ४',
    titleEn: 'Vachnamrut Gadhada III-4',
    section: 'ગઢડા અંત્ય ૪',
    textGu: 'પવિત્રતા અને ધર્મ પાલન વિના કોઈ ભક્તિ નથી; તેથી સર્વ પરિસ્થિતિમાં નિયમ જ રાખવો.',
    textHi: 'पवित्रता और धर्म पालन के बिना कोई भक्ति नहीं; इसलिए सभी परिस्थितियों में नियम रखें।',
    textEn: 'Without purity and adherence to dharma, there is no true devotion; therefore maintain discipline in all circumstances.',
    correlationNote: 'શુદ્ધતા અને નિયમ-ધર્મ પાલનનું સત્સંગ દીક્ષા શ્લોક ૧૪૮-૧૫૨ સાથે પ્રત્યક્ષ સમન્વય.'
  });
  refs.push({
    type: 'swamini_vato',
    title: 'સ્વામીની વાતો પ્રકરણ ૩/૪૫',
    titleGu: 'સ્વામીની વાતો પ્રકરણ ૩/૪૫',
    titleHi: 'स्वामीनी बातें प्रकरण ३/४५',
    titleEn: 'Swamini Vato Chapter 3/45',
    section: 'પ્રકરણ ૩/૪૫',
    textGu: 'આપણે જે સ્વીકાર કર્યું તે નિયમો કેટલું કેટલું જ હોય તોય સર્વદા પાલન કરવા જોઈએ.',
    textHi: 'हमने जो नियम स्वीकार किए हैं उन्हें कितने भी कठिन हों, सदा पालन करना चाहिए।',
    textEn: 'Whatever vows we have undertaken must be observed at all times, however difficult they may be.',
    correlationNote: 'ધર્મ અને નિયમ પાલનની મહત્તા સાથે શ્લોક ૧૫૦-૧୫୨ નું સર્વાંગીણ સમર્થન.'
  });
}
```

## Source References

### Vachnamrut Sections:
- **ગઢડા પ્રથમ (Gadhada I)**: 1-71 (main teachings)
- **ગઢડા મધ્ય (Gadhada II)**: 1-52 (devotional practices)
- **ગઢડા અંત્ય (Gadhada III)**: 1-41 (final discourses)
- **કારિયાણી (Kariyani)**: 1-11 (household conduct)
- **લોયા (Loya)**: 1-12 (final teachings)

### Swamini Vato Structure:
- **પ્રકરણ (Chapters)**: Organized by topic and season
- **પ્રકરણ ૧**: General principles and worship
- **પ્રકરણ ૨**: Daily conduct and ethics
- **પ્રકરણ ૩**: Advanced spiritual practices
- **પ્રકરણ ૪**: Philosophy of liberation
- **પ્રકરણ ૫**: Divine mysteries and ultimate knowledge

## How to Integrate

Once you've added the quotations to `scripts/update_cross_refs.js`:

```bash
# Run the update script
node scripts/update_cross_refs.js

# This will regenerate src/data/shlokas.ts with all cross-references
```

## Validation Checklist

Before submitting:
- [ ] Gujarati text matches authentic source exactly
- [ ] Hindi translation is accurate
- [ ] English meaning captures the essence
- [ ] Correlation note explains the connection clearly
- [ ] All required fields are filled
- [ ] No spelling errors in source names
- [ ] Chapter/lesson numbers are correct
- [ ] Thematic connection is logical and authentic

## Example Missing Ranges to Fill

Currently covered ranges:
- ✅ Shlokas 1-17 (Mangalacharan)
- ✅ Shlokas 18-44 (Auspicious practices)
- ✅ Shlokas 45-76 (Daily rituals & tilak)
- ✅ Shlokas 77-115 (Dietary purity)
- ✅ Shlokas 116-158 (Satsang assembly)
- ✅ Shlokas 159-200 (Family conduct)
- ✅ Shlokas 201-246 (Faultless vision)
- ✅ Shlokas 247-287 (Akshar-Purushottam worship)
- ❌ **Shlokas 288-315 (Final teachings)** ← NEEDS MORE QUOTATIONS

## Contact for Authentic Sources

If you need exact quotations:
- Consult the official Satsang Diksha text
- Reference BAPS Swaminarayan library
- Cross-check with Sanskrit scholars in the community

---

**Last Updated**: 2026-10-06
**Status**: Accepting contributions for Shlokas 288-315
