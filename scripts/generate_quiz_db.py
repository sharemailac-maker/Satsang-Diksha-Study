import json, re, random

# Seed random for consistent, reproducible questions
random.seed(42)

with open('src/data/shlokas.ts', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('export const SHLOKAS')
eq_pos = text.find('=', pos)
bracket_start = text.find('[', eq_pos)
semi_pos = text.find(';\n\nexport function', bracket_start)
bracket_end = text.rfind(']', bracket_start, semi_pos)

raw_shlokas = json.loads(text[bracket_start:bracket_end+1])

def clean_danda_number(s):
    return re.sub(r'॥[\s\d\u0966-\u096f\u0ae6-\u0aef]*॥\s*$', '॥', s).strip()

def split_couplet(s):
    lines = [l.strip() for l in s.split('\n') if l.strip()]
    if len(lines) == 3 and ('विधः' in lines[0] or 'વિધઃ' in lines[0]):
        lines = lines[1:]
    if len(lines) >= 2:
        return lines[0], lines[1]
    return lines[0], lines[0]

shlokas = {}
for s in raw_shlokas:
    sid = s['id']
    d1, d2 = split_couplet(s['sanskritDevanagari'])
    g1, g2 = split_couplet(s['sanskritGujarati'])
    shlokas[sid] = {
        'id': sid,
        'chapterGu': s.get('chapterGu', '').strip(),
        'chapterHi': s.get('chapterHi', '').strip(),
        'chapterEn': s.get('chapterEn', '').strip(),
        'titleGu': s.get('titleGu', '').strip(),
        'titleHi': s.get('titleHi', '').strip(),
        'titleEn': s.get('titleEn', '').strip(),
        'sdev': s['sanskritDevanagari'].strip(),
        'sgu': s['sanskritGujarati'].strip(),
        'd1': d1,
        'd2': clean_danda_number(d2),
        'g1': g1,
        'g2': clean_danda_number(g2),
        'mgu': s.get('meaningGu', '').strip(),
        'mhi': s.get('meaningHi', '').strip(),
        'men': s.get('meaningEn', '').strip()
    }

# Build 26 sets (Verses 1..12, 13..24, ..., 301..315)
test_sets = []
for set_idx in range(26):
    start_id = set_idx * 12 + 1
    end_id = (set_idx + 1) * 12 if set_idx < 25 else 315
    verse_ids = list(range(start_id, end_id + 1))
    
    first_shloka = shlokas[start_id]
    last_shloka = shlokas[end_id]
    
    # Title
    title_gu = f"ટેસ્ટ {set_idx + 1}: શ્લોક {start_id} થી {end_id}"
    title_hi = f"टेस्ट {set_idx + 1}: श्लोक {start_id} से {end_id}"
    title_en = f"Test {set_idx + 1}: Verses {start_id} to {end_id}"
    
    ch_gu = first_shloka['chapterGu']
    ch_hi = first_shloka['chapterHi']
    ch_en = first_shloka['chapterEn']
    
    questions = []
    
    # Pool of shlokas for this set
    set_shlokas = [shlokas[sid] for sid in verse_ids]
    
    # We need 20 questions:
    # 1. 10 completion questions (Line 1 -> Choose Line 2)
    # 2. 5 reverse completion questions (Line 2 -> Choose Line 1)
    # 3. 5 meaning to verse questions (Meaning -> Choose Sanskrit Verse)
    
    # Question 1 to 10: Complete Line 2
    comp_ids = verse_ids[:10] if len(verse_ids) >= 10 else (verse_ids * 2)[:10]
    for q_i, target_id in enumerate(comp_ids):
        target = shlokas[target_id]
        
        # Distractors: other line 2 from this set
        other_shlokas = [s for s in set_shlokas if s['id'] != target_id]
        if len(other_shlokas) < 3:
            other_shlokas = [s for sid, s in shlokas.items() if sid != target_id]
        distractors = random.sample(other_shlokas, 3)
        
        # Correct answer
        correct_dev = target['d2']
        correct_gu = target['g2']
        
        options_dev = [correct_dev] + [d['d2'] for d in distractors]
        options_gu = [correct_gu] + [d['g2'] for d in distractors]
        
        # Shuffle together
        indices = [0, 1, 2, 3]
        random.shuffle(indices)
        shuffled_dev = [options_dev[i] for i in indices]
        shuffled_gu = [options_gu[i] for i in indices]
        correct_idx = indices.index(0)
        
        q_gu = f"શ્લોક પૂર્ણ કરો (શ્લોક {target_id}): «{target['g1']}» પછી કઈ સંસ્કૃત પંક્તિ આવે છે?"
        q_hi = f"श्लोक पूर्ण कीजिए (श्लोक {target_id}): «{target['d1']}» के बाद कौन सी संस्कृत पंक्ति आती है?"
        q_en = f"Complete the verse (Shloka {target_id}): Which Sanskrit line follows «{target['d1']}»?"
        
        exp_gu = f"શ્લોક {target_id} નો સાચો ઉત્તરાર્ધ «{target['g2']}» છે.\nઅર્થ: {target['mgu']}"
        exp_hi = f"श्लोक {target_id} का सही उत्तरार्ध «{target['d2']}» है।\nअर्थ: {target['mhi']}"
        exp_en = f"The correct second line of Shloka {target_id} is «{target['d2']}».\nMeaning: {target['men']}"
        
        questions.append({
            'id': f"q_{set_idx + 1}_{q_i + 1}",
            'shlokaId': target_id,
            'type': 'completion',
            'verseExcerptDevanagari': target['d1'],
            'verseExcerptGujarati': target['g1'],
            'meaningGu': target['mgu'],
            'meaningHi': target['mhi'],
            'meaningEn': target['men'],
            'questionGu': q_gu,
            'questionHi': q_hi,
            'questionEn': q_en,
            'optionsDevanagari': shuffled_dev,
            'optionsGujarati': shuffled_gu,
            'correctIndex': correct_idx,
            'explanationGu': exp_gu,
            'explanationHi': exp_hi,
            'explanationEn': exp_en,
            'fullSanskritDevanagari': target['sdev'],
            'fullSanskritGujarati': target['sgu']
        })
    
    # Question 11 to 15: Reverse completion (Line 2 -> Find Line 1)
    rev_candidates = [verse_ids[i] for i in [0, 2, 4, 6, 8 if len(verse_ids) > 8 else 1]]
    for q_i, target_id in enumerate(rev_candidates[:5]):
        target = shlokas[target_id]
        
        other_shlokas = [s for s in set_shlokas if s['id'] != target_id]
        if len(other_shlokas) < 3:
            other_shlokas = [s for sid, s in shlokas.items() if sid != target_id]
        distractors = random.sample(other_shlokas, 3)
        
        correct_dev = target['d1']
        correct_gu = target['g1']
        
        options_dev = [correct_dev] + [d['d1'] for d in distractors]
        options_gu = [correct_gu] + [d['g1'] for d in distractors]
        
        indices = [0, 1, 2, 3]
        random.shuffle(indices)
        shuffled_dev = [options_dev[i] for i in indices]
        shuffled_gu = [options_gu[i] for i in indices]
        correct_idx = indices.index(0)
        
        q_gu = f"આ ઉત્તરાર્ધ પહેલાંનો સંસ્કૃત પૂર્વાર્ધ કયો છે? (શ્લોક {target_id})\n«{target['g2']}»"
        q_hi = f"इस उत्तरार्ध से पूर्व कौन सा संस्कृत पूर्वार्ध आता है? (श्लोक {target_id})\n«{target['d2']}»"
        q_en = f"Which Sanskrit opening line precedes this verse? (Shloka {target_id})\n«{target['d2']}»"
        
        exp_gu = f"શ્લોક {target_id} નો સાચો પૂર્વાર્ધ «{target['g1']}» છે.\nઅર્થ: {target['mgu']}"
        exp_hi = f"श्लोक {target_id} का सही पूर्वार्ध «{target['d1']}» है।\nअर्थ: {target['mhi']}"
        exp_en = f"The correct opening line of Shloka {target_id} is «{target['d1']}».\nMeaning: {target['men']}"
        
        questions.append({
            'id': f"q_{set_idx + 1}_{10 + q_i + 1}",
            'shlokaId': target_id,
            'type': 'reverse_completion',
            'verseExcerptDevanagari': target['d2'],
            'verseExcerptGujarati': target['g2'],
            'meaningGu': target['mgu'],
            'meaningHi': target['mhi'],
            'meaningEn': target['men'],
            'questionGu': q_gu,
            'questionHi': q_hi,
            'questionEn': q_en,
            'optionsDevanagari': shuffled_dev,
            'optionsGujarati': shuffled_gu,
            'correctIndex': correct_idx,
            'explanationGu': exp_gu,
            'explanationHi': exp_hi,
            'explanationEn': exp_en,
            'fullSanskritDevanagari': target['sdev'],
            'fullSanskritGujarati': target['sgu']
        })
    
    # Question 16 to 20: Meaning to Sanskrit Verse
    meaning_candidates = [verse_ids[i] for i in [1, 3, 5, 7, len(verse_ids) - 1]]
    for q_i, target_id in enumerate(meaning_candidates[:5]):
        target = shlokas[target_id]
        
        other_shlokas = [s for s in set_shlokas if s['id'] != target_id]
        if len(other_shlokas) < 3:
            other_shlokas = [s for sid, s in shlokas.items() if sid != target_id]
        distractors = random.sample(other_shlokas, 3)
        
        # For meaning questions, present the authentic Sanskrit shloka (both lines joined)
        correct_dev = target['d1'] + " " + target['d2']
        correct_gu = target['g1'] + " " + target['g2']
        
        options_dev = [correct_dev] + [d['d1'] + " " + d['d2'] for d in distractors]
        options_gu = [correct_gu] + [d['g1'] + " " + d['g2'] for d in distractors]
        
        indices = [0, 1, 2, 3]
        random.shuffle(indices)
        shuffled_dev = [options_dev[i] for i in indices]
        shuffled_gu = [options_gu[i] for i in indices]
        correct_idx = indices.index(0)
        
        q_gu = f"આ અર્થ દર્શાવતો સત્સંગ દીક્ષાનો સંસ્કૃત શ્લોક કયો છે?\n«{target['mgu']}»"
        q_hi = f"इस अर्थ को प्रकट करने वाला सत्संग दीक्षा का संस्कृत श्लोक कौन सा है?\n«{target['mhi']}»"
        q_en = f"Which Sanskrit verse conveys this divine teaching?\n«{target['men']}»"
        
        exp_gu = f"આ પવિત્ર ઉપદેશ શ્લોક {target_id} માં આવે છે: «{target['g1']} {target['g2']}»\nઅર્થ: {target['mgu']}"
        exp_hi = f"यह पवित्र उपदेश श्लोक {target_id} में आता है: «{target['d1']} {target['d2']}»\nअर्थ: {target['mhi']}"
        exp_en = f"This divine teaching is expressed in Shloka {target_id}: «{target['d1']} {target['d2']}»\nMeaning: {target['men']}"
        
        questions.append({
            'id': f"q_{set_idx + 1}_{15 + q_i + 1}",
            'shlokaId': target_id,
            'type': 'meaning_to_verse',
            'verseExcerptDevanagari': target['d1'] + " " + target['d2'],
            'verseExcerptGujarati': target['g1'] + " " + target['g2'],
            'meaningGu': target['mgu'],
            'meaningHi': target['mhi'],
            'meaningEn': target['men'],
            'questionGu': q_gu,
            'questionHi': q_hi,
            'questionEn': q_en,
            'optionsDevanagari': shuffled_dev,
            'optionsGujarati': shuffled_gu,
            'correctIndex': correct_idx,
            'explanationGu': exp_gu,
            'explanationHi': exp_hi,
            'explanationEn': exp_en,
            'fullSanskritDevanagari': target['sdev'],
            'fullSanskritGujarati': target['sgu']
        })
    
    test_sets.append({
        'id': set_idx + 1,
        'startShloka': start_id,
        'endShloka': end_id,
        'titleGu': title_gu,
        'titleHi': title_hi,
        'titleEn': title_en,
        'chapterGu': ch_gu,
        'chapterHi': ch_hi,
        'chapterEn': ch_en,
        'questionsCount': 20,
        'questions': questions
    })

print(f"Generated {len(test_sets)} test sets with {sum(len(t['questions']) for t in test_sets)} questions total.")

# Write to src/data/quizDatabase.ts
header_ts = """// Autogenerated 26 Swadhyay Quiz Test Sets (20 questions per set = 520 questions)
// Covering all 315 Shlokas in ascending 10-12 verse blocks with offline support
import { QuizTestSet, QuizQuestion, SanskritScript } from '../types';

export const QUIZ_TEST_SETS: QuizTestSet[] = """

footer_ts = """;

/**
 * Returns all 26 ascending test sets
 */
export function getAllQuizTestSets(): QuizTestSet[] {
  return QUIZ_TEST_SETS;
}

/**
 * Returns a specific test set by ID (1 to 26)
 */
export function getQuizTestSetById(id: number): QuizTestSet | undefined {
  return QUIZ_TEST_SETS.find(s => s.id === id);
}

/**
 * Returns the 20 questions for the Daily Swadhyay Test
 * Deterministically selects today's set based on day of year
 */
export function getDailySwadhyayTest(dateKey?: string): QuizTestSet {
  const now = dateKey ? new Date(dateKey) : new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const setIndex = dayOfYear % QUIZ_TEST_SETS.length;
  return QUIZ_TEST_SETS[setIndex];
}

/**
 * Get localized prompt for a quiz question with Sanskrit verse excerpt in user's preferred script
 */
export function getQuestionPrompt(q: QuizQuestion, lang: string, script: SanskritScript = 'devanagari'): string {
  const isDev = script === 'devanagari';
  const excerpt = isDev 
    ? (q.verseExcerptDevanagari || '') 
    : (q.verseExcerptGujarati || q.verseExcerptDevanagari || '');

  if (q.type === 'completion') {
    if (lang === 'hindi' || lang === 'marathi') {
      return `श्लोक पूर्ण कीजिए (श्लोक ${q.shlokaId}):\\n«${excerpt}» के बाद कौन सी संस्कृत पंक्ति आती है?`;
    }
    if (lang === 'english') {
      return `Complete the verse (Shloka ${q.shlokaId}):\\nWhich Sanskrit line follows «${excerpt}»?`;
    }
    return `શ્લોક પૂર્ણ કરો (શ્લોક ${q.shlokaId}):\\n«${excerpt}» પછી કઈ સંસ્કૃત પંક્તિ આવે છે?`;
  }

  if (q.type === 'reverse_completion') {
    if (lang === 'hindi' || lang === 'marathi') {
      return `इस उत्तरार्ध से पूर्व कौन सा संस्कृत पूर्वार्ध आता है? (श्लोक ${q.shlokaId})\\n«${excerpt}»`;
    }
    if (lang === 'english') {
      return `Which Sanskrit opening line precedes this verse? (Shloka ${q.shlokaId})\\n«${excerpt}»`;
    }
    return `આ ઉત્તરાર્ધ પહેલાંનો સંસ્કૃત પૂર્વાર્ધ કયો છે? (શ્લોક ${q.shlokaId})\\n«${excerpt}»`;
  }

  if (q.type === 'meaning_to_verse') {
    let meaning = q.meaningGu || '';
    if (lang === 'hindi' || lang === 'marathi') meaning = q.meaningHi || q.meaningGu || '';
    else if (lang === 'english') meaning = q.meaningEn || q.meaningGu || '';

    if (lang === 'hindi' || lang === 'marathi') {
      return `इस अर्थ को प्रकट करने वाला सत्संग दीक्षा का संस्कृत श्लोक कौन सा है?\\n«${meaning}»`;
    }
    if (lang === 'english') {
      return `Which Sanskrit verse conveys this divine teaching?\\n«${meaning}»`;
    }
    return `આ અર્થ દર્શાવતો સત્સંગ દીક્ષાનો સંસ્કૃત શ્લોક કયો છે?\\n«${meaning}»`;
  }

  if (lang === 'hindi') return q.questionHi || '';
  if (lang === 'english') return q.questionEn || '';
  return q.questionGu || '';
}

/**
 * Get Sanskrit answer options based on user's preferred Sanskrit script
 */
export function getQuestionOptions(q: QuizQuestion, script: SanskritScript = 'devanagari'): string[] {
  if (script === 'devanagari') {
    return q.optionsDevanagari || [];
  }
  return q.optionsGujarati || q.optionsDevanagari || [];
}

/**
 * Get localized explanation for a quiz question
 */
export function getQuestionExplanation(q: QuizQuestion, lang: string, script: SanskritScript = 'devanagari'): string {
  const isDev = script === 'devanagari';
  const verseLine = isDev 
    ? (q.verseExcerptDevanagari || '') 
    : (q.verseExcerptGujarati || q.verseExcerptDevanagari || '');

  if (lang === 'hindi' || lang === 'marathi') {
    const meaning = q.meaningHi || '';
    if (q.type === 'completion') {
      return `श्लोक ${q.shlokaId} का सही उत्तरार्ध: «${verseLine}»\\nअर्थ: ${meaning}`;
    } else if (q.type === 'reverse_completion') {
      return `श्लोक ${q.shlokaId} का सही पूर्वार्ध: «${verseLine}»\\nअर्थ: ${meaning}`;
    } else {
      return `यह पवित्र उपदेश श्लोक ${q.shlokaId} में आता है: «${verseLine}»\\nअर्थ: ${meaning}`;
    }
  }

  if (lang === 'english') {
    const meaning = q.meaningEn || '';
    if (q.type === 'completion') {
      return `The correct second line of Shloka ${q.shlokaId} is: «${verseLine}»\\nMeaning: ${meaning}`;
    } else if (q.type === 'reverse_completion') {
      return `The correct opening line of Shloka ${q.shlokaId} is: «${verseLine}»\\nMeaning: ${meaning}`;
    } else {
      return `This divine teaching is expressed in Shloka ${q.shlokaId}: «${verseLine}»\\nMeaning: ${meaning}`;
    }
  }

  // Gujarati default
  const meaning = q.meaningGu || '';
  if (q.type === 'completion') {
    return `શ્લોક ${q.shlokaId} નો સાચો ઉત્તરાર્ધ: «${verseLine}»\\nઅર્થ: ${meaning}`;
  } else if (q.type === 'reverse_completion') {
    return `શ્લોક ${q.shlokaId} નો સાચો પૂર્વાર્ધ: «${verseLine}»\\nઅર્થ: ${meaning}`;
  } else {
    return `આ પવિત્ર ઉપદેશ શ્લોક ${q.shlokaId} માં આવે છે: «${verseLine}»\\nઅર્થ: ${meaning}`;
  }
}
"""

with open('src/data/quizDatabase.ts', 'w', encoding='utf-8') as f:
    f.write(header_ts + json.dumps(test_sets, ensure_ascii=False, indent=2) + footer_ts)

print("Successfully written to src/data/quizDatabase.ts!")
