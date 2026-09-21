import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

const outputPath = path.join(process.cwd(), 'public', 'Satsang_Diksha_App_Presentation.pdf');

// Create PDF document with presentation dimensions (16:9 widescreen or landscape letter)
const doc = new PDFDocument({
  size: [842, 595], // A4 Landscape
  margins: { top: 0, bottom: 0, left: 0, right: 0 },
  info: {
    Title: 'Satsang Diksha App - Overview & Feature Presentation',
    Author: 'Satsang Diksha Study Platform',
    Subject: 'Scriptural Concordance, Mukhpath & Study Features',
    Keywords: 'Satsang Diksha, Vachnamrut, Swamini Vato, Concordance, Mukhpath, PDF Presentation'
  }
});

const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// Color Palette
const COLORS = {
  primary: '#8B2500',      // Deep Maroon/Saffron
  secondary: '#C05621',    // Warm Amber
  dark: '#2D241E',         // Deep Warm Charcoal
  muted: '#6B5E51',        // Muted Warm Gray
  bgCard: '#FAF5EE',       // Light Warm Card Fill
  accentBg: '#FFF9E6',     // Saffron Tint Fill
  gold: '#D97706',         // Gold Accent
  white: '#FFFFFF',
  border: '#E8DFD1'
};

function drawHeader(title: string, slideNo: number) {
  doc.rect(0, 0, 842, 60).fill(COLORS.primary);
  doc.fillColor(COLORS.white).fontSize(20).font('Helvetica-Bold')
     .text(title, 50, 20, { width: 700 });
  doc.fillColor('#FDE68A').fontSize(12).font('Helvetica')
     .text(`Slide ${slideNo} of 6`, 730, 25, { width: 70, align: 'right' });
}

function drawFooter() {
  doc.rect(0, 560, 842, 35).fill(COLORS.dark);
  doc.fillColor('#D6D3D1').fontSize(10).font('Helvetica')
     .text('Satsang Diksha (315 Verses) • Comprehensive Study & Concordance Platform • sharemailac@gmail.com', 50, 572, { align: 'center', width: 742, lineBreak: false });
}

function drawCard(x: number, y: number, w: number, h: number, title: string, subtitle?: string) {
  doc.roundedRect(x, y, w, h, 8)
     .fillAndStroke(COLORS.bgCard, COLORS.border);
  if (title) {
    doc.fillColor(COLORS.primary).fontSize(14).font('Helvetica-Bold')
       .text(title, x + 16, y + 14, { width: w - 32 });
  }
  if (subtitle) {
    doc.fillColor(COLORS.muted).fontSize(10).font('Helvetica-Oblique')
       .text(subtitle, x + 16, y + 32, { width: w - 32 });
  }
}

// ==========================================
// SLIDE 1: TITLE SLIDE
// ==========================================
doc.rect(0, 0, 842, 595).fill('#FFFDF9');
doc.rect(0, 0, 842, 140).fill(COLORS.primary);

// Header Graphic / Accent Line
doc.rect(0, 136, 842, 6).fill(COLORS.gold);

doc.fillColor(COLORS.white).fontSize(34).font('Helvetica-Bold')
   .text('SATSANG DIKSHA STUDY PLATFORM', 50, 45, { align: 'center', width: 742 });
doc.fillColor('#FEF3C7').fontSize(16).font('Helvetica')
   .text('A Comprehensive Interactive Web & PWA Solution for 315 Verses', 50, 90, { align: 'center', width: 742 });

// Main Content Box
drawCard(50, 170, 742, 280, 'PLATFORM OVERVIEW & EXECUTIVE BRIEF');

doc.fillColor(COLORS.dark).fontSize(13).font('Helvetica')
   .text('Authored by Pragat Brahmaswarup Mahant Swami Maharaj, Satsang Diksha encapsulates the core timeless philosophy of Bhagwan Swaminarayan and the Akshar-Purushottam Upasana across 315 divine Sanskrit verses.', 70, 215, { width: 702, lineGap: 5 });

doc.fillColor(COLORS.dark).fontSize(12).font('Helvetica')
   .text('This digital platform serves as a modern, accessible, and scholarly study companion designed for mumukshus, youths, and scholars worldwide. It combines rigorous textual fidelity with state-of-the-art interactive learning tools.', 70, 275, { width: 702, lineGap: 5 });

// Feature Highlights Grid on Title
const highlights = [
  '315 Verses with Padachheda & Anvaya',
  '243 Vachnamrut & 744 Swamini Vato References',
  'Tri-lingual: Gujarati, Hindi, English',
  'Offline-Ready Progressive Web App (PWA)',
  'Daily Mukhpath Tracker & Streaks',
  'Authentic Audio Recitation & Loop Mode'
];

highlights.forEach((h, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const hx = 80 + col * 350;
  const hy = 345 + row * 32;
  doc.circle(hx, hy + 5, 4).fill(COLORS.gold);
  doc.fillColor(COLORS.primary).fontSize(11).font('Helvetica-Bold')
     .text(h, hx + 12, hy, { width: 320 });
});

doc.rect(50, 470, 742, 70).fillAndStroke(COLORS.accentBg, '#FDE68A');
doc.fillColor(COLORS.primary).fontSize(11).font('Helvetica-Bold')
   .text('PRESENTATION FOCUS:', 70, 485);
doc.fillColor(COLORS.dark).fontSize(11).font('Helvetica')
   .text('This presentation details the core architectural modules, the newly enhanced Concordance Engine (linking Vachnamrut and Swamini Vato to Shloka Adhyayan), and user study tools.', 70, 502, { width: 702 });

drawFooter();

// ==========================================
// SLIDE 2: CORE PILLARS & ARCHITECTURE
// ==========================================
doc.addPage({ size: [842, 595], margins: { top: 0, bottom: 0, left: 0, right: 0 } });
drawHeader('Core Learning Pillars & Interactive Architecture', 2);

// 4 Major Pillars
const pillars = [
  {
    title: '1. Shloka Adhyayan (Reader)',
    desc: 'Deep multi-layer study of all 315 verses. Includes pristine Sanskrit text, word-by-word grammatical Padachheda breakdowns, Anvaya (prose order), and multi-lingual translations (Gujarati, Hindi, English). Also features custom bookmarks with personal study notes.'
  },
  {
    title: '2. Cross-Scriptural Concordance',
    desc: 'Scholarly cross-referencing between Satsang Diksha, Vachnamrut (243 discourses), and Swamini Vato (744 discourses). Features bidirectional discovery: view scripture references for any shloka, or view all shlokas linked to any specific Vachnamrut or Swamini Vato.'
  },
  {
    title: '3. SMART Mukhpath Tracker',
    desc: 'A 4-stage spaced-repetition memorization workflow: Not Started -> Learning -> Memorized -> Perfected. Features chapter-wise progress analytics, daily practice streaks, interactive memorization badges, and automated study reminders.'
  },
  {
    title: '4. Audio Udgaan & Chanting',
    desc: 'Authentic chanting and recitation recorded by learned Santos. Features single-verse looping, continuous chapter recitation, adjustable playback speeds (0.75x to 1.5x), and synchronized on-screen verse highlighting.'
  }
];

pillars.forEach((p, idx) => {
  const x = 50 + (idx % 2) * 380;
  const y = 80 + Math.floor(idx / 2) * 230;
  drawCard(x, y, 362, 215, p.title);
  doc.fillColor(COLORS.dark).fontSize(11).font('Helvetica')
     .text(p.desc, x + 16, y + 45, { width: 330, lineGap: 4 });
});

drawFooter();

// ==========================================
// SLIDE 3: ENHANCED CONCORDANCE ENGINE
// ==========================================
doc.addPage({ size: [842, 595], margins: { top: 0, bottom: 0, left: 0, right: 0 } });
drawHeader('Cross-Scriptural Concordance: Vachnamrut & Swamini Vato', 3);

doc.fillColor(COLORS.dark).fontSize(12).font('Helvetica')
   .text('The Concordance Engine establishes the theological and practical foundation of Satsang Diksha by linking every verse to the divine discourses of Bhagwan Swaminarayan and Gunatitanand Swami.', 50, 75, { width: 742 });

// Vachnamrut Card
drawCard(50, 110, 362, 430, 'Vachnamrut Concordance (243 Entries)', 'Inverted Scripture Index & Direct Shloka Links');
doc.fillColor(COLORS.dark).fontSize(11).font('Helvetica')
   .text('Covers all 11 sections of Vachnamrut referenced in Satsang Diksha:\n• Gadhada I (69), Sarangpur (12), Kariyani (9)\n• Loya (18), Panchala (7), Gadhada II (60)\n• Vartal (18), Amdavad (7), Gadhada III (37)\n• Jetalpur (5), Ashlali (1)', 66, 160, { width: 330, lineGap: 3 });

doc.fillColor(COLORS.primary).fontSize(11).font('Helvetica-Bold')
   .text('Key Features:', 66, 260);
doc.fillColor(COLORS.dark).fontSize(10.5).font('Helvetica')
   .text('• 100% complete authentic Gujarati quotes for all 243 Vachnamrut references.\n• Searchable by Vachnamrut section code (e.g. GI-1, Sar-1), title, or quote text.\n• Interactive Shloka Chips: each Vachnamrut displays all linked Satsang Diksha verses with single-click navigation to Shloka Adhyayan.\n• Multi-lingual display in Gujarati, Hindi, and English.', 66, 280, { width: 330, lineGap: 3.5 });

// Swamini Vato Card
drawCard(430, 110, 362, 430, 'Swamini Vato Concordance (744 Entries)', 'Prakaran-wise Index & Authentic Discourse Links');
doc.fillColor(COLORS.dark).fontSize(11).font('Helvetica')
   .text('Categorized across Prakarans 1 through 6:\n• Prakaran 1 (185 talks)\n• Prakaran 2 (115 talks)\n• Prakaran 3 (46 talks)\n• Prakaran 4 (62 talks)\n• Prakaran 5 (172 talks)\n• Prakaran 6 (163 talks)', 446, 160, { width: 330, lineGap: 3 });

doc.fillColor(COLORS.primary).fontSize(11).font('Helvetica-Bold')
   .text('Key Features:', 446, 260);
doc.fillColor(COLORS.dark).fontSize(10.5).font('Helvetica')
   .text('• Full authentic Gujarati discourse extracts by Aksharbrahma Gunatitanand Swami.\n• Filter by Prakaran chips or search by talk number (e.g. 1/8) or topic.\n• External links directly to Anirdesh.com reference pages.\n• Interactive Shloka Chips linking directly to Shloka Adhyayan for deep cross-study.', 446, 280, { width: 330, lineGap: 3.5 });

drawFooter();

// ==========================================
// SLIDE 4: SCHOLARLY TOOLS (PADACHHEDA, ANVAYA & QUIZ)
// ==========================================
doc.addPage({ size: [842, 595], margins: { top: 0, bottom: 0, left: 0, right: 0 } });
drawHeader('Scholarly Tools: Padachheda, Anvaya & Quiz Engine', 4);

drawCard(50, 75, 742, 145, 'PADACHHEDA (WORD-BY-WORD GRAMMAR) & ANVAYA');
doc.fillColor(COLORS.dark).fontSize(11).font('Helvetica')
   .text('• Complete Word Breakdown: Every shloka features individual word chips displaying Sandhi separation, Sanskrit grammatical designations (vibhakti, linga, kriya-pad), and accurate word-level meanings in Gujarati, Hindi, and English.\n• Anvaya (Sanskrit Prose Order): Rearranges poetic verses into grammatical Sanskrit prose order (Karta -> Karma -> Kriya) to aid scholarly comprehension.\n• Contextual Correlation: Correlates philosophical terms with related scriptural concepts.', 66, 115, { width: 710, lineGap: 4 });

drawCard(50, 235, 742, 145, 'INTERACTIVE KNOWLEDGE QUIZ & ASSESSMENTS');
doc.fillColor(COLORS.dark).fontSize(11).font('Helvetica')
   .text('• Chapter-by-Chapter Quizzes: Test comprehension on specific chapters (e.g. Upasana, Niyam-Dharma, Guru-Bhakti) or across the entire scripture.\n• Multiple Question Formats: Sanskrit shloka completion, word meaning identification, scriptural reference matching, and philosophical principles.\n• Immediate Pedagogical Feedback: Correct answers highlight the relevant verse number, authentic Vachnamrut cross-reference, and detailed spiritual explanation.', 66, 275, { width: 710, lineGap: 4 });

drawCard(50, 395, 742, 145, 'OFFLINE FIRST & PWA INSTALLABILITY');
doc.fillColor(COLORS.dark).fontSize(11).font('Helvetica')
   .text('• Zero-Latency Offline Access: Entire dataset of 315 shlokas, 243 Vachnamruts, and 744 Swamini Vato is locally packaged. Works reliably in sabhas, travel, and remote areas without internet.\n• Installable as Native App: Supports Progressive Web App (PWA) installation on Android, iOS, Windows, and macOS with custom icon and standalone window experience.\n• Safe Data Preservation: Zero telemetry, zero unconsented data deletion, and permanent local storage of user bookmarks, notes, and memorization progress.', 66, 435, { width: 710, lineGap: 4 });

drawFooter();

// ==========================================
// SLIDE 5: USER EXPERIENCE & ACCESSIBILITY
// ==========================================
doc.addPage({ size: [842, 595], margins: { top: 0, bottom: 0, left: 0, right: 0 } });
drawHeader('User Experience, Accessibility & Design Craft', 5);

const uxCards = [
  {
    title: 'Warm Sanctuary Aesthetic',
    bullets: [
      'Tailored parchment color palette inspired by traditional manuscript codices.',
      'Sanskrit display typography paired with legible, balanced UI fonts.',
      'Strict adherence to Anti-Slop principles: no neon gradients, no artificial marketing fluff, no cluttered UI.',
      'Full Dark Mode support with eye-comfort low-contrast tones for night study.'
    ]
  },
  {
    title: 'Tri-Lingual Seamless Switching',
    bullets: [
      'Gujarati: Native Gujarati script for Sanskrit and detailed Gujarati translations.',
      'Hindi / Devanagari: High-fidelity Devanagari script for Sanskrit verses and translations.',
      'English: IAST transliteration and English translations for global youths and diaspora.',
      'Instant toggle via top navigation with persistent language preference.'
    ]
  },
  {
    title: 'Daily Study & Habit Formation',
    bullets: [
      'Custom daily notification reminders to maintain consistent mukhpath habit.',
      'Streak counter rewarding consecutive days of scriptural adhyayan.',
      'Quick Jump Modal (Ctrl+K / Cmd+K) to rapidly navigate to any of the 315 verses in milliseconds.',
      'Interactive Chapter Index with thematic badges and verse counters.'
    ]
  },
  {
    title: 'Data Integrity & Privacy',
    bullets: [
      'Immutable scriptural texts: original words of Mahant Swami Maharaj, Shriji Maharaj, and Gunatitanand Swami are strictly safeguarded.',
      'Local client-side state: private bookmarks and personal study notes never leave the device.',
      'No third-party trackers, advertisements, or unnecessary data collection.',
      'Exportable and shareable presentation and study materials.'
    ]
  }
];

uxCards.forEach((c, idx) => {
  const x = 50 + (idx % 2) * 380;
  const y = 80 + Math.floor(idx / 2) * 230;
  drawCard(x, y, 362, 215, c.title);
  c.bullets.forEach((b, bIdx) => {
    const by = y + 45 + bIdx * 38;
    doc.circle(x + 16, by + 5, 2.5).fill(COLORS.secondary);
    doc.fillColor(COLORS.dark).fontSize(9.5).font('Helvetica')
       .text(b, x + 26, by, { width: 320, lineGap: 2 });
  });
});

drawFooter();

// ==========================================
// SLIDE 6: CONCLUSION & SUMMARY
// ==========================================
doc.addPage({ size: [842, 595], margins: { top: 0, bottom: 0, left: 0, right: 0 } });
drawHeader('Summary & Ongoing Development', 6);

drawCard(50, 80, 742, 260, 'PROJECT SUMMARY & IMPACT');
doc.fillColor(COLORS.dark).fontSize(12).font('Helvetica')
   .text('The Satsang Diksha Study Platform bridges ancient wisdom with modern digital craftsmanship. By providing an integrated ecosystem of Shloka Adhyayan, Concordance, Mukhpath tracking, and scholarly tools, it empowers devotees of all generations to live and understand the divine commands of Bhagwan Swaminarayan.', 70, 120, { width: 702, lineGap: 5 });

doc.fillColor(COLORS.primary).fontSize(12).font('Helvetica-Bold')
   .text('Key Achievements in Current Release:', 70, 185);
doc.fillColor(COLORS.dark).fontSize(11).font('Helvetica')
   .text('1. 100% coverage of all 315 Sanskrit verses with Padachheda, Anvaya, and translations.\n2. Complete resolution of all 243 Vachnamrut quotes with verbatim authentic text.\n3. Brand new Inverted Scripture Indexes for both Vachnamrut and Swamini Vato, allowing direct lookup by discourse and seamless jumping into Shloka Adhyayan.\n4. Audio recitation integration and comprehensive quiz module with pedagogical feedback.', 70, 205, { width: 702, lineGap: 4 });

// Contact & Attribution Box
doc.rect(50, 360, 742, 175).fillAndStroke(COLORS.accentBg, '#FDE68A');
doc.fillColor(COLORS.primary).fontSize(14).font('Helvetica-Bold')
   .text('CONTACT & SHARING INFORMATION', 70, 380);

doc.fillColor(COLORS.dark).fontSize(11).font('Helvetica')
   .text('This application is maintained with deep devotion for the spiritual upliftment of mumukshus worldwide.\n\n• Primary Stakeholder / Contact: sharemailac@gmail.com\n• Scripture Authority: BAPS Swaminarayan Sanstha\n• Platform: AI Studio Web Applet & Progressive Web App (PWA)\n• Document: Official Feature & Architecture Presentation (PDF Format)', 70, 410, { width: 702, lineGap: 4 });

drawFooter();

doc.end();

stream.on('finish', () => {
  console.log(`Presentation PDF successfully generated at: ${outputPath}`);
});
