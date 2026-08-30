// Complete 315 Shlokas from Satsang Diksha PDF
const fs = require('fs');
const path = require('path');

// Convert any Gujarati characters to pure Devanagari using Unicode offset (-0x0180)
function normalizeToDevanagari(rawText) {
  if (!rawText) return '';
  let res = '';
  for (let i = 0; i < rawText.length; i++) {
    const code = rawText.charCodeAt(i);
    if (code >= 0x0A81 && code <= 0x0AEF) {
      res += String.fromCharCode(code - 0x0180);
    } else {
      res += rawText[i];
    }
  }
  return res;
}

// Convert Devanagari to Gujarati script using Unicode offset (+0x0180)
function devanagariToGujarati(rawText) {
  const text = normalizeToDevanagari(rawText);
  let res = '';
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if ((code >= 0x0901 && code <= 0x0939) || (code >= 0x093D && code <= 0x094D) || (code >= 0x0966 && code <= 0x096F)) {
      res += String.fromCharCode(code + 0x0180);
    } else {
      res += text[i];
    }
  }
  return res;
}

// Helper to convert Devanagari to IAST Romanization
function devanagariToIast(rawText) {
  const text = normalizeToDevanagari(rawText);
  const vowels = {
    'अ': 'a', 'आ': 'ā', 'इ': 'i', 'ई': 'ī', 'उ': 'u', 'ऊ': 'ū', 'ऋ': 'ṛ', 'ॠ': 'ṝ',
    'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au'
  };
  const matras = {
    'ा': 'ā', 'ि': 'i', 'ी': 'ī', 'ु': 'u', 'ू': 'ū', 'ृ': 'ṛ', 'ૄ': 'ṝ',
    'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au'
  };
  const consonants = {
    'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ṅ',
    'च': 'c', 'छ': 'ch', 'ज': 'j', 'झ': 'jh', 'ञ': 'ñ',
    'ट': 'ṭ', 'ठ': 'ṭh', 'ड': 'ḍ', 'ढ': 'ḍh', 'ण': 'ṇ',
    'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
    'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
    'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v', 'श': 'ś', 'ष': 'ṣ', 'स': 's', 'ह': 'h'
  };
  const digits = {
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
    '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
  };

  let out = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (vowels[ch]) {
      out += vowels[ch];
    } else if (consonants[ch]) {
      const next = text[i + 1];
      if (next === '्') {
        out += consonants[ch];
        i++; // skip virama
      } else if (matras[next]) {
        out += consonants[ch] + matras[next];
        i++; // skip matra
      } else {
        out += consonants[ch] + 'a';
      }
    } else if (matras[ch]) {
      out += matras[ch];
    } else if (ch === 'ं') {
      out += 'ṁ';
    } else if (ch === 'ः') {
      out += 'ḥ';
    } else if (ch === 'ऽ') {
      out += "'";
    } else if (ch === '॥') {
      out += '||';
    } else if (ch === '।') {
      out += '|';
    } else if (digits[ch]) {
      out += digits[ch];
    } else {
      out += ch;
    }
  }
  return out;
}

module.exports = { normalizeToDevanagari, devanagariToGujarati, devanagariToIast };
