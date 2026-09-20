import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function createPresentationPDF() {
  const pdfDoc = await PDFDocument.create();
  
  // Slide dimensions: 16:9 Widescreen (960 x 540 points)
  const width = 960;
  const height = 540;

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Palette (Warm saffron, rich maroon, gold, soft cream, and dark slate)
  const colors = {
    maroon: rgb(0.48, 0.11, 0.02),      // #7A1D05
    deepMaroon: rgb(0.35, 0.08, 0.01),  // #591402
    gold: rgb(0.85, 0.58, 0.12),        // #D9941F
    softGold: rgb(0.96, 0.88, 0.72),    // #F5E0B8
    creamBg: rgb(0.98, 0.96, 0.93),     // #FAF5EE
    white: rgb(1, 1, 1),
    cardBg: rgb(1, 1, 1),
    cardBorder: rgb(0.91, 0.84, 0.75),  // #E8D7C0
    textDark: rgb(0.18, 0.12, 0.08),    // #2E1F14
    textMuted: rgb(0.45, 0.38, 0.32),   // #736152
    accentSaffron: rgb(0.88, 0.40, 0.08),// #E06614
    lightRed: rgb(0.98, 0.94, 0.92)
  };

  // Helper to draw standard header & footer for content slides
  function drawSlideChrome(page, slideNum, totalSlides, category, title) {
    // Background
    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: colors.creamBg,
    });

    // Top decorative saffron accent bar
    page.drawRectangle({
      x: 0,
      y: height - 6,
      width,
      height: 6,
      color: colors.maroon,
    });
    page.drawRectangle({
      x: 0,
      y: height - 10,
      width,
      height: 4,
      color: colors.gold,
    });

    // Category badge
    if (category) {
      page.drawText(category.toUpperCase(), {
        x: 48,
        y: height - 42,
        size: 11,
        font: fontBold,
        color: colors.accentSaffron,
      });
    }

    // Slide Title
    page.drawText(title, {
      x: 48,
      y: height - 68,
      size: 22,
      font: fontBold,
      color: colors.maroon,
    });

    // Bottom footer bar
    page.drawLine({
      start: { x: 48, y: 36 },
      end: { x: width - 48, y: 36 },
      thickness: 1,
      color: colors.cardBorder,
    });

    page.drawText('Satsang Diksha Web Application  |  BAPS Swaminarayan Sanstha', {
      x: 48,
      y: 20,
      size: 10,
      font: fontRegular,
      color: colors.textMuted,
    });

    const pageNumStr = `Slide ${slideNum} of ${totalSlides}`;
    const pageNumWidth = fontRegular.widthOfTextAtSize(pageNumStr, 10);
    page.drawText(pageNumStr, {
      x: width - 48 - pageNumWidth,
      y: 20,
      size: 10,
      font: fontRegular,
      color: colors.textMuted,
    });
  }

  // Helper to draw structured cards
  function drawCard(page, x, y, cardWidth, cardHeight, title, subtitle, bullets) {
    // Card background
    page.drawRectangle({
      x,
      y,
      width: cardWidth,
      height: cardHeight,
      color: colors.white,
      borderColor: colors.cardBorder,
      borderWidth: 1.2,
    });

    // Top card accent strip
    page.drawRectangle({
      x,
      y: y + cardHeight - 4,
      width: cardWidth,
      height: 4,
      color: colors.maroon,
    });

    let textY = y + cardHeight - 26;

    if (title) {
      page.drawText(title, {
        x: x + 16,
        y: textY,
        size: 15,
        font: fontBold,
        color: colors.maroon,
      });
      textY -= 16;
    }

    if (subtitle) {
      page.drawText(subtitle, {
        x: x + 16,
        y: textY,
        size: 11,
        font: fontItalic,
        color: colors.textMuted,
      });
      textY -= 20;
    } else {
      textY -= 8;
    }

    for (const bullet of bullets) {
      // Bullet dot
      page.drawCircle({
        x: x + 20,
        y: textY + 4,
        size: 3,
        color: colors.gold,
      });

      // Render bullet text (wrap if needed)
      const maxTextWidth = cardWidth - 44;
      const words = bullet.split(' ');
      let currentLine = '';
      
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = fontRegular.widthOfTextAtSize(testLine, 11);
        if (testWidth > maxTextWidth) {
          page.drawText(currentLine, {
            x: x + 30,
            y: textY,
            size: 11,
            font: fontRegular,
            color: colors.textDark,
          });
          textY -= 15;
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) {
        page.drawText(currentLine, {
          x: x + 30,
          y: textY,
          size: 11,
          font: fontRegular,
          color: colors.textDark,
        });
        textY -= 18;
      }
    }
  }

  const TOTAL_SLIDES = 10;

  // ==========================================
  // SLIDE 1: Title Slide (Grand Saffron & Maroon)
  // ==========================================
  {
    const page = pdfDoc.addPage([width, height]);
    // Deep gradient-style background
    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: colors.deepMaroon,
    });

    // Decorative inner border
    page.drawRectangle({
      x: 28,
      y: 28,
      width: width - 56,
      height: height - 56,
      borderColor: colors.gold,
      borderWidth: 1.5,
    });

    // Golden lotus emblem text
    page.drawText('JAI SWAMINARAYAN', {
      x: width / 2 - 80,
      y: height - 100,
      size: 14,
      font: fontBold,
      color: colors.gold,
    });

    // Main Title
    const title = 'SATSANG DIKSHA WEB APPLICATION';
    const titleWidth = fontBold.widthOfTextAtSize(title, 28);
    page.drawText(title, {
      x: width / 2 - titleWidth / 2,
      y: height - 160,
      size: 28,
      font: fontBold,
      color: colors.white,
    });

    // Subtitle
    const sub = 'Complete Architecture, Divine Features & Study Ecosystem Guide';
    const subWidth = fontRegular.widthOfTextAtSize(sub, 16);
    page.drawText(sub, {
      x: width / 2 - subWidth / 2,
      y: height - 195,
      size: 16,
      font: fontRegular,
      color: colors.softGold,
    });

    // Decorative divider line
    page.drawLine({
      start: { x: width / 2 - 140, y: height - 225 },
      end: { x: width / 2 + 140, y: height - 225 },
      thickness: 2,
      color: colors.gold,
    });

    // Highlights Box
    page.drawRectangle({
      x: 180,
      y: 110,
      width: 600,
      height: 90,
      color: rgb(0.25, 0.05, 0.01),
      borderColor: colors.gold,
      borderWidth: 1,
    });

    page.drawText('Scripture: Satsang Diksha (315 Shlokas in 10 Divine Prakrans)', {
      x: 205,
      y: 165,
      size: 12,
      font: fontBold,
      color: colors.softGold,
    });
    page.drawText('Author: Pragat Guruhari Param Pujya Mahant Swami Maharaj (Nenpur, 2020)', {
      x: 205,
      y: 145,
      size: 11,
      font: fontRegular,
      color: colors.white,
    });
    page.drawText('Modules: Multilingual, Multi-Script, Audio Udgaan, Concordance & Mukhpath', {
      x: 205,
      y: 125,
      size: 11,
      font: fontRegular,
      color: colors.gold,
    });

    page.drawText('Digital Study & Memorization Companion  |  BAPS Swaminarayan Sanstha', {
      x: width / 2 - 210,
      y: 50,
      size: 11,
      font: fontItalic,
      color: colors.softGold,
    });
  }

  // ==========================================
  // SLIDE 2: Executive Overview & Divine Origin
  // ==========================================
  {
    const page = pdfDoc.addPage([width, height]);
    drawSlideChrome(page, 2, TOTAL_SLIDES, '1. Overview & Heritage', 'Divine Scripture & Digital Mission');

    drawCard(page, 48, 70, 416, 380, 'The Scripture: Satsang Diksha', 'Authored by Guruhari Mahant Swami Maharaj', [
      'Sacred shastra composed in lucid, metered Sanskrit verses embodying the core principles of Akshar-Purushottam Darshan.',
      'Released and consecrated on July 7, 2020 at Nenpur, Gujarat for the spiritual elevation of all spiritual seekers.',
      'Contains 315 Shlokas systematically structured across 10 Prakrans (Chapters) covering daily discipline, worship, and ultimate redemption.',
      'Consecrated with Guruhari\'s personal blessing letter urging devotees to daily recite at least five verses and memorize as per ability.'
    ]);

    drawCard(page, 496, 70, 416, 380, 'The Digital Application Mission', 'Modern, Accessible & Offline-First Web Platform', [
      'Designed to provide a faithful, tamper-proof study and memorization portal accessible anywhere on phones, tablets, and desktops.',
      'Multi-Language Support: Gujarati, English, Hindi, and Sanskrit with word-by-word grammatical breakdowns (Padachheda & Anvaya).',
      'Multi-Script Sanskrit Engine: View verses seamlessly in Devanagari, Gujarati Script, or Roman IAST with diacritics.',
      'Integrated Spiritual Media: Complete audio chanting tracks, official Guruhari blessing letters, quizzes, and concordance references.'
    ]);
  }

  // ==========================================
  // SLIDE 3: 10 Sacred Prakrans (Chapters) Structure
  // ==========================================
  {
    const page = pdfDoc.addPage([width, height]);
    drawSlideChrome(page, 3, TOTAL_SLIDES, '2. Scriptural Organization', 'The 10 Divine Prakrans (Chapters 1 - 10)');

    drawCard(page, 48, 70, 416, 380, 'Foundational Prakrans (Verses 1 - 146)', 'Initiation, Upasana & Daily Worship Codes', [
      'Prakran 1 (1 - 3): Mangalacharan & Grantha Aarambha - Divine invocation of Akshar-Purushottam Maharaj.',
      'Prakran 2 (4 - 44): Diksha Vidhi & Sadachara - Code of initiation, five sacred vows (Panch Vartaman), and pure living.',
      'Prakran 3 (45 - 69): Nitya Puja & Bhakti Vidhi - Step-by-step morning puja, mansi puja, tilak-chandlo, and arti.',
      'Prakran 4 (70 - 105): Satsang Niyam & Ahimsa - Complete non-violence, truthfulness, abstaining from vices, and dietary purity.',
      'Prakran 5 (106 - 146): Gurubhakti & Gunatit Guru - Glory of the Aksharbrahma Guru and steadfast refuge in the manifest Satpurush.'
    ]);

    drawCard(page, 496, 70, 416, 380, 'Philosophical & Redemption Prakrans (147 - 315)', 'Metaphysics, Sevabhav & Ultimate Liberation', [
      'Prakran 6 (147 - 188): Upasana & Siddhanta - Akshar-Purushottam Upasana, distinct ontological entities, and Parabrahma devotion.',
      'Prakran 7 (189 - 235): Kartavyapalan & Seva - Virtuous duty, seva without ego, harmony (Samp, Suhradbhav, Ekta), and tolerance.',
      'Prakran 8 (236 - 275): Niyamit Satsang Sabha - Attendance in weekly assemblies, spiritual introspection, and family harmony (Ghar Sabha).',
      'Prakran 9 (276 - 305): Brahmarup Moksha Siddhanta - Attaining the Brahmarup state, transcendence of Maya, and eternal Akshardham.',
      'Prakran 10 (306 - 315): Grantha Samapti & Phala-Shruti - Eternal blessings, spiritual fruits of daily reading, and completion.'
    ]);
  }

  // ==========================================
  // SLIDE 4: Multilingual & Multi-Script Reading Engine
  // ==========================================
  {
    const page = pdfDoc.addPage([width, height]);
    drawSlideChrome(page, 4, TOTAL_SLIDES, '3. Reading & Linguistic Engine', 'Multilingual & Multi-Script Reading Experience');

    drawCard(page, 48, 70, 416, 380, 'Three Script Views for Sanskrit Verses', 'Seamless Dynamic Script Rendering', [
      'Devanagari (Default): Original authentic Sanskrit script with traditional metered layout and punctuation.',
      'Gujarati Script: Transliterated directly into Gujarati characters for easy reading by Gujarati-speaking devotees.',
      'Roman IAST Script: Academic International Alphabet of Sanskrit Transliteration with diacritical marks for global seekers.',
      'Quick Switcher: Instant dropdown menu in Settings to seamlessly transition the entire application without reloading.'
    ]);

    drawCard(page, 496, 70, 416, 380, 'Deep Linguistic & Grammatical Breakdown', 'Unrivaled Scholarly Precision for Every Verse', [
      'Padachheda (Word-by-Word Analysis): Every compound Sanskrit word broken into individual roots, cases, and grammatical components.',
      'Anvaya (Prose Order): Verses rearranged from poetic meter into direct syntactic sentence order for effortless comprehension.',
      'Rich Meaning & Translations: Full context translations available in Gujarati, English, Hindi, and Sanskrit.',
      'Interactive Word Meaning Modals: Tap any individual Sanskrit word to inspect its root, meaning, and theological relevance.'
    ]);
  }

  // ==========================================
  // SLIDE 5: Authentic Cross-Scriptural Concordance
  // ==========================================
  {
    const page = pdfDoc.addPage([width, height]);
    drawSlideChrome(page, 5, TOTAL_SLIDES, '4. Theological Concordance', 'Vachnamrut & Swamini Vato Cross-References');

    drawCard(page, 48, 70, 416, 380, 'Vachnamrut Cross-Scriptural Mapping', 'Grounded in Bhagwan Swaminarayan\'s Discourses', [
      'Every Shloka is mapped to foundational Vachnamrut prakrans (Gadhada, Sarangpur, Kariyani, Loya, Panchala, Vadtal, Amdavad, etc.).',
      'Reveals the divine roots of each injunction directly from Bhagwan Swaminarayan\'s nectar-like words.',
      'Interactive Concordance Tabs: View full Vachnamrut titles, context excerpts, and theological harmony right below the verse.',
      'Enables serious students and scholars to conduct deep comparative study between Satsang Diksha and the Vachnamrut.'
    ]);

    drawCard(page, 496, 70, 416, 380, 'Swamini Vato Concordance & Wisdom', 'Teachings of Aksharbrahma Gunatitanand Swami', [
      'Direct cross-citations to Gunatitanand Swami\'s revolutionary spiritual discourses (Prakran & Vato numbers).',
      'Provides practical commentaries and spiritual remedies that illustrate how to live the injunctions in everyday life.',
      'Thematic Indexing: Verses tagged by spiritual topics such as Mahima, Atmanishtha, Dharma, Vairagya, and Bhakti.',
      'Authentic & Verified: Every scriptural reference is strictly verified against sanctioned BAPS publications.'
    ]);
  }

  // ==========================================
  // SLIDE 6: Audio Chanting & Continuous Recitation (Udgaan)
  // ==========================================
  {
    const page = pdfDoc.addPage([width, height]);
    drawSlideChrome(page, 6, TOTAL_SLIDES, '5. Audio & Chanting', 'Multi-Track Udgaan (Audio Recitation) Suite');

    drawCard(page, 48, 70, 416, 380, 'Continuous Playback & Learning Modes', 'Customized Chanting Experience', [
      'Multiple Grouping Options: Listen by Prakran, in sets of 5 shlokas (Guruhari\'s daily recommendation), 10, 25, or all 315 shlokas.',
      'Auto-Advance / Continuous Play: Seamlessly transitions to the next verse automatically upon completion of the audio.',
      'Loop Mode: Repeat the current verse continuously for rhythmic memorization and vocal practice.',
      'Playback Speed Control: Adjust speed to 0.75x (slow learning), 1.0x (standard chanting), 1.25x, or 1.5x.'
    ]);

    drawCard(page, 496, 70, 416, 380, 'Interactive Chanting UI & Visual Sync', 'Audio Synchronized with Scriptural Display', [
      'Active Verse Highlighting: Real-time visual focus on the active shloka during chanting with smooth auto-scroll.',
      'Synchronized Settings: Toggle Auto Swipe While Listening either from the audio player controls or the Settings modal.',
      'Multi-Track Audio Formats: Switch between traditional Sanskrit Shloka Gaan and word-by-word pronunciation.',
      'Background Audio Support: Continues playing smoothly while navigating through different tabs and verses.'
    ]);
  }

  // ==========================================
  // SLIDE 7: Mukhpath (Memorization) & Interactive Quizzes
  // ==========================================
  {
    const page = pdfDoc.addPage([width, height]);
    drawSlideChrome(page, 7, TOTAL_SLIDES, '6. Study & Memorization', 'Mukhpath Tracker, Quizzes & Flashcards');

    drawCard(page, 48, 70, 416, 380, 'Mukhpath (Memorization) Progress Suite', 'Fulfilling Guruhari\'s Wish for Memorization', [
      'One-Tap Memorization Status: Mark individual verses as "Memorized" with instant visual feedback and streak records.',
      'Interactive Progress Analytics: Circular visual gauge displaying exact memorized count and percentage out of 315 shlokas.',
      'Hidden Word / Recall Mode: Interactive flashcard tool that masks keywords or phrases to test verbal recall.',
      'Prakran-wise Breakdown: Track memorization progress chapter-by-chapter to identify areas needing revision.'
    ]);

    drawCard(page, 496, 70, 416, 380, 'Comprehensive Interactive Quizzes', 'Knowledge Reinforcement & Self-Testing', [
      'Chapter-Wise & Comprehensive Quizzes: Test understanding across all 10 Prakrans with multi-choice and fill-in questions.',
      'Instant Feedback & Scorecards: Immediate explanations citing exact shloka numbers and scriptural context upon answer selection.',
      'Retake & Mastery Features: Ability to re-attempt quizzes, review incorrect responses, and master difficult concepts.',
      'Designed for All Age Groups: Ideal for Bal, Balika, Kishore, Kishori, and Yuvak-Yuvati Mandal study circles.'
    ]);
  }

  // ==========================================
  // SLIDE 8: Guruhari's Blessing Letters & Archival Media
  // ==========================================
  {
    const page = pdfDoc.addPage([width, height]);
    drawSlideChrome(page, 8, TOTAL_SLIDES, '7. Blessings & Letters', 'Historic Nenpur Aashirvad Letters & Audio');

    drawCard(page, 48, 70, 416, 380, 'Historic Nenpur Blessing Letters', 'Preserving the Divine Foundation of the Scripture', [
      'Original Sacred Epistles: Historic letters penned by Mahant Swami Maharaj on July 7, 2020 at Nenpur, Gujarat.',
      'Adaptive Single-Card Banner: Smartly presents the Gujarati or English letter according to the user\'s language preference.',
      'Full-Screen High-Resolution Lightbox: Inspect original handwritten Gujarati manuscript and official English letter.',
      'Dual-Mode Modal: Seamlessly toggle between High-Definition Archival Image and Clean Text Transcript.'
    ]);

    drawCard(page, 496, 70, 416, 380, 'Core Exhortations in the Letter', 'The Spiritual Injunctions of the Satpurush', [
      '"Read at least 5 Shlokas daily": Established as the foundational daily spiritual discipline for every devotee.',
      '"Memorize in Sanskrit as per capacity": Encouraging youths and children to commit the divine principles to memory.',
      '"Yogi Bapa & Pramukh Swami will be pleased": Proclaiming that living by these verses earns the highest spiritual grace.',
      'Permanent Preservation: Guarded under immutable data directives to ensure pure, uncorrupted scripture records.'
    ]);
  }

  // ==========================================
  // SLIDE 9: Technical Architecture, PWA & Security
  // ==========================================
  {
    const page = pdfDoc.addPage([width, height]);
    drawSlideChrome(page, 9, TOTAL_SLIDES, '8. Technical Architecture', 'Full-Stack Performance, Offline PWA & Data Safety');

    drawCard(page, 48, 70, 416, 380, 'Modern Tech Stack & Architecture', 'Engineered for Blazing Speed and Reliability', [
      'Frontend: React 19, TypeScript, Vite, Tailwind CSS 4, and Motion for fluid 60 FPS transitions.',
      'Backend & Routing: Node.js, Express, and secure modular server-side endpoints.',
      'Offline-First PWA (Progressive Web App): Full Service Worker caching enabling complete offline reading anywhere.',
      'Local Storage Persistence: User bookmarks, notes, memorization ticks, and font sizes securely preserved locally.'
    ]);

    drawCard(page, 496, 70, 416, 380, 'Strict Data Protection & Privacy', 'Safeguarding Sacred Texts & User Privacy', [
      'Zero Data Deletion Protocol: Permanent immutable protection for all 315 shlokas, padachheda, and concordance records.',
      'Zero Secret Leakage: Strict anti-misuse security with zero client-side exposed tokens or telemetry trackers.',
      'Daily Spiritual Notification Service: Automated 12h/24h nitya niyam reminder running safely via Service Worker.',
      'Cross-Device Compatibility: Native responsive UI for ultra-wide monitors, tablets, and handheld mobile devices.'
    ]);
  }

  // ==========================================
  // SLIDE 10: Conclusion & Summary
  // ==========================================
  {
    const page = pdfDoc.addPage([width, height]);
    // Deep grand footer slide
    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: colors.deepMaroon,
    });

    page.drawRectangle({
      x: 28,
      y: 28,
      width: width - 56,
      height: height - 56,
      borderColor: colors.gold,
      borderWidth: 1.5,
    });

    page.drawText('SUMMARY & SPIRITUAL SIGNIFICANCE', {
      x: width / 2 - 140,
      y: height - 90,
      size: 14,
      font: fontBold,
      color: colors.gold,
    });

    const concTitle = 'Transforming Daily Scripture Study & Spiritual Living';
    const concWidth = fontBold.widthOfTextAtSize(concTitle, 24);
    page.drawText(concTitle, {
      x: width / 2 - concWidth / 2,
      y: height - 130,
      size: 24,
      font: fontBold,
      color: colors.white,
    });

    // 4 Highlights in a 2x2 Grid
    const gW = 410;
    const gH = 120;

    // Card 1
    page.drawRectangle({ x: 58, y: 230, width: gW, height: gH, color: rgb(0.25, 0.05, 0.01), borderColor: colors.gold, borderWidth: 1 });
    page.drawText('Complete 315 Shlokas in 10 Prakrans', { x: 74, y: 320, size: 13, font: fontBold, color: colors.gold });
    page.drawText('Original Sanskrit, Gujarati & Roman IAST scripts with word-by-word', { x: 74, y: 298, size: 10, font: fontRegular, color: colors.white });
    page.drawText('Padachheda, Anvaya prose order, and contextual multi-lingual translations.', { x: 74, y: 282, size: 10, font: fontRegular, color: colors.white });

    // Card 2
    page.drawRectangle({ x: 492, y: 230, width: gW, height: gH, color: rgb(0.25, 0.05, 0.01), borderColor: colors.gold, borderWidth: 1 });
    page.drawText('Multi-Track Audio Chanting (Udgaan)', { x: 508, y: 320, size: 13, font: fontBold, color: colors.gold });
    page.drawText('Continuous recitation with auto-advancing verses, customized looping,', { x: 508, y: 298, size: 10, font: fontRegular, color: colors.white });
    page.drawText('and grouped listening by 5, 10, 25, or full chapter segments.', { x: 508, y: 282, size: 10, font: fontRegular, color: colors.white });

    // Card 3
    page.drawRectangle({ x: 58, y: 90, width: gW, height: gH, color: rgb(0.25, 0.05, 0.01), borderColor: colors.gold, borderWidth: 1 });
    page.drawText('Vachnamrut & Swamini Vato Concordance', { x: 74, y: 180, size: 13, font: fontBold, color: colors.gold });
    page.drawText('Deep theological concordance referencing Bhagwan Swaminarayan\'s', { x: 74, y: 158, size: 10, font: fontRegular, color: colors.white });
    page.drawText('Vachnamrut discourses and Gunatitanand Swami\'s divine wisdom.', { x: 74, y: 142, size: 10, font: fontRegular, color: colors.white });

    // Card 4
    page.drawRectangle({ x: 492, y: 90, width: gW, height: gH, color: rgb(0.25, 0.05, 0.01), borderColor: colors.gold, borderWidth: 1 });
    page.drawText('Mukhpath & Offline Study Companion', { x: 508, y: 180, size: 13, font: fontBold, color: colors.gold });
    page.drawText('Personalized memorization tracker, recall flashcards, interactive quizzes,', { x: 508, y: 158, size: 10, font: fontRegular, color: colors.white });
    page.drawText('and offline PWA access for devotees worldwide.', { x: 508, y: 142, size: 10, font: fontRegular, color: colors.white });

    page.drawText('JAI SWAMINARAYAN  |  BAPS SWAMINARAYAN SANSTHA', {
      x: width / 2 - 165,
      y: 48,
      size: 11,
      font: fontBold,
      color: colors.softGold,
    });
  }

  const pdfBytes = await pdfDoc.save();
  const outputPath = path.join(process.cwd(), 'public', 'Satsang_Diksha_App_Presentation.pdf');
  fs.writeFileSync(outputPath, pdfBytes);
  console.log('PDF presentation created successfully at:', outputPath);
}

createPresentationPDF().catch(err => {
  console.error('Error creating presentation PDF:', err);
  process.exit(1);
});
