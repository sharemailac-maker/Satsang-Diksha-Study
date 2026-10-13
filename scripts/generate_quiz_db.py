import json, re, random

# Seed random for consistent, reproducible questions
random.seed(42)

with open('src/data/shlokas.ts', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('export const SHLOKAS')
eq_pos = text.find('=', pos)
bracket_start = text.find('[', eq_pos)
bracket_end = text.find('];\n\n// Enrich', bracket_start)

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

def make_completion_question(target_id, pool, q_num_str):
    target = shlokas[target_id]
    other_shlokas = [s for s in pool if s['id'] != target_id]
    if len(other_shlokas) < 3:
        other_shlokas = [s for sid, s in shlokas.items() if sid != target_id]
    distractors = random.sample(other_shlokas, 3)

    correct_dev = target['d2']
    correct_gu = target['g2']

    options_dev = [correct_dev] + [d['d2'] for d in distractors]
    options_gu = [correct_gu] + [d['g2'] for d in distractors]

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

    return {
        'id': f"q_{q_num_str}",
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
    }

def make_reverse_completion_question(target_id, pool, q_num_str):
    target = shlokas[target_id]
    other_shlokas = [s for s in pool if s['id'] != target_id]
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

    return {
        'id': f"q_{q_num_str}",
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
    }

def make_meaning_to_verse_question(target_id, pool, q_num_str):
    target = shlokas[target_id]
    other_shlokas = [s for s in pool if s['id'] != target_id]
    if len(other_shlokas) < 3:
        other_shlokas = [s for sid, s in shlokas.items() if sid != target_id]
    distractors = random.sample(other_shlokas, 3)

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

    return {
        'id': f"q_{q_num_str}",
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
    }

def make_couplet_identification_question(target_id, pool, q_num_str):
    target = shlokas[target_id]
    other_shlokas = [s for s in pool if s['id'] != target_id]
    if len(other_shlokas) < 3:
        other_shlokas = [s for sid, s in shlokas.items() if sid != target_id]
    distractors = random.sample(other_shlokas, 3)

    correct_dev = target['d1'] + " " + target['d2']
    correct_gu = target['g1'] + " " + target['g2']

    options_dev = [correct_dev] + [d['d1'] + " " + d['d2'] for d in distractors]
    options_gu = [correct_gu] + [d['g1'] + " " + d['g2'] for d in distractors]

    indices = [0, 1, 2, 3]
    random.shuffle(indices)
    shuffled_dev = [options_dev[i] for i in indices]
    shuffled_gu = [options_gu[i] for i in indices]
    correct_idx = indices.index(0)

    title_gu = target['titleGu'] or f"શ્લોક {target_id}"
    title_hi = target['titleHi'] or f"श्लोक {target_id}"
    title_en = target['titleEn'] or f"Shloka {target_id}"

    q_gu = f"સત્સંગ દીક્ષા શ્લોક {target_id} («{title_gu}») નો પવિત્ર સંસ્કૃત શ્લોક કયો છે?"
    q_hi = f"सत्संग दीक्षा श्लोक {target_id} («{title_hi}») का पवित्र संस्कृत श्लोक कौन सा है?"
    q_en = f"Which sacred Sanskrit verse corresponds to Shloka {target_id} («{title_en}»)?"

    exp_gu = f"શ્લોક {target_id} નો સાચો સંસ્કૃત શ્લોક «{target['g1']} {target['g2']}» છે.\nઅર્થ: {target['mgu']}"
    exp_hi = f"श्लोक {target_id} का सही संस्कृत श्लोक «{target['d1']} {target['d2']}» है।\nअर्थ: {target['mhi']}"
    exp_en = f"The correct Sanskrit verse of Shloka {target_id} is «{target['d1']} {target['d2']}».\nMeaning: {target['men']}"

    return {
        'id': f"q_{q_num_str}",
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
    }

# Build 26 standard sets (Verses 1..12, 13..24, ..., 301..315)
test_sets = []
for set_idx in range(26):
    start_id = set_idx * 12 + 1
    end_id = (set_idx + 1) * 12 if set_idx < 25 else 315
    verse_ids = list(range(start_id, end_id + 1))
    
    first_shloka = shlokas[start_id]
    
    title_gu = f"ટેસ્ટ {set_idx + 1}: શ્લોક {start_id} થી {end_id}"
    title_hi = f"टेस्ट {set_idx + 1}: श्लोक {start_id} से {end_id}"
    title_en = f"Test {set_idx + 1}: Verses {start_id} to {end_id}"
    
    ch_gu = first_shloka['chapterGu']
    ch_hi = first_shloka['chapterHi']
    ch_en = first_shloka['chapterEn']
    
    questions = []
    set_shlokas = [shlokas[sid] for sid in verse_ids]
    
    # 1. Completion: All verses in the set (up to 12 questions)
    for q_i, target_id in enumerate(verse_ids):
        questions.append(make_completion_question(target_id, set_shlokas, f"{set_idx + 1}_{len(questions) + 1}"))
    
    # 2. Reverse Completion: 8 verses spread across the set
    rev_count = min(8, len(verse_ids))
    rev_indices = [int(i * (len(verse_ids) - 1) / (rev_count - 1)) if rev_count > 1 else 0 for i in range(rev_count)]
    for r_idx in rev_indices:
        target_id = verse_ids[r_idx]
        questions.append(make_reverse_completion_question(target_id, set_shlokas, f"{set_idx + 1}_{len(questions) + 1}"))
    
    # 3. Meaning to Verse: 8 verses spread across the set
    mean_count = min(8, len(verse_ids))
    mean_indices = [int(i * (len(verse_ids) - 1) / (mean_count - 1)) if mean_count > 1 else 0 for i in range(mean_count)]
    for m_idx in mean_indices:
        target_id = verse_ids[m_idx]
        questions.append(make_meaning_to_verse_question(target_id, set_shlokas, f"{set_idx + 1}_{len(questions) + 1}"))
    
    # 4. Couplet Identification: 4 key verses
    ident_count = min(4, len(verse_ids))
    ident_indices = [int(i * (len(verse_ids) - 1) / (ident_count - 1)) if ident_count > 1 else 0 for i in range(ident_count)]
    for i_idx in ident_indices:
        target_id = verse_ids[i_idx]
        questions.append(make_couplet_identification_question(target_id, set_shlokas, f"{set_idx + 1}_{len(questions) + 1}"))
    
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
        'questionsCount': len(questions),
        'questions': questions
    })

# Add 6 Comprehensive Revision and Thematic Sets (Sets 27 to 32)
comp_configs = [
    {
        'id': 27,
        'start': 1,
        'end': 50,
        'titleGu': "ટેસ્ટ 27: શ્લોક 1 થી 50 સઘન રિવિઝન",
        'titleHi': "टेस्ट 27: श्लोक 1 से 50 गहन पुनरावलोकन",
        'titleEn': "Test 27: Verses 1 to 50 Comprehensive Revision",
        'chapterGu': "પ્રસ્તાવના, સાધના અને આચાર સિદ્ધાંતો",
        'chapterHi': "प्रस्तावना, साधना एवं आचार सिद्धांत",
        'chapterEn': "Foundations, Diksha & Self-Discipline",
        'count': 30
    },
    {
        'id': 28,
        'start': 51,
        'end': 100,
        'titleGu': "ટેસ્ટ 28: શ્લોક 51 થી 100 પૂજા-ભક્તિ કસોટી",
        'titleHi': "टेस्ट 28: श्लोक 51 से 100 पूजा-भक्ति परीक्षा",
        'titleEn': "Test 28: Verses 51 to 100 Worship & Devotion Test",
        'chapterGu': "નિત્યપૂજા વિધિ, માનસીપૂજા અને અર્ચન ભક્તિ",
        'chapterHi': "नित्यपूजा विधि, मानसीपूजा एवं अर्चन भक्ति",
        'chapterEn': "Daily Nityapuja & Devotional Practices",
        'count': 30
    },
    {
        'id': 29,
        'start': 101,
        'end': 180,
        'titleGu': "ટેસ્ટ 29: શ્લોક 101 થી 180 સત્સંગ સદાચાર કસોટી",
        'titleHi': "टेस्ट 29: श्लोक 101 से 180 सत्संग सदाचार परीक्षा",
        'titleEn': "Test 29: Verses 101 to 180 Satsang Conduct & Vows",
        'chapterGu': "સત્સંગ નિયમો, પંચ વર્તમાન, સદાચાર અને નિષેધ",
        'chapterHi': "सत्संग नियम, पंच वर्तमान, सदाचार एवं निषेध",
        'chapterEn': "Moral Conduct, Vows & Prohibitions",
        'count': 30
    },
    {
        'id': 30,
        'start': 181,
        'end': 250,
        'titleGu': "ટેસ્ટ 30: શ્લોક 181 થી 250 આશ્રમ ધર્મ કસોટી",
        'titleHi': "टेस्ट 30: श्लोक 181 से 250 आश्रम धर्म परीक्षा",
        'titleEn': "Test 30: Verses 181 to 250 Ashrama Duties Test",
        'chapterGu': "આશ્રમ ધર્મ, ગૃહસ્થ-ત્યાગી મર્યાદા અને સામાજિક વિવેક",
        'chapterHi': "आश्रम धर्म, गृहस्थ-त्यागी मर्यादा एवं सामाजिक विवेक",
        'chapterEn': "Ashrama Duties, Householder & Sadhu Codes",
        'count': 30
    },
    {
        'id': 31,
        'start': 251,
        'end': 315,
        'titleGu': "ટેસ્ટ 31: શ્લોક 251 થી 315 ઉપાસના-ગુરુ કસોટી",
        'titleHi': "टेस्ट 31: श्लोक 251 से 315 उपासना-गुरु परीक्षा",
        'titleEn': "Test 31: Verses 251 to 315 Upasana & Guru Mahima",
        'chapterGu': "અક્ષરપુરુષોત્તમ ઉપાસના, પ્રગટ ગુરુ ભક્તિ અને ફલશ્રુતિ",
        'chapterHi': "अक्षरपुरुषोत्तम उपासना, प्रगट गुरु भक्ति एवं फलश्रुति",
        'chapterEn': "Akshar-Purushottam Upasana & Guru Bhakti",
        'count': 30
    },
    {
        'id': 32,
        'start': 1,
        'end': 315,
        'titleGu': "ટેસ્ટ 32: સંપૂર્ણ સત્સંગ દીક્ષા મહા-સ્વાધ્યાય મોક કસોટી",
        'titleHi': "टेस्ट 32: सम्पूर्ण सत्संग दीक्षा महा-स्वाध्याय मॉक परीक्षा",
        'titleEn': "Test 32: Complete Satsang Diksha Grand Mock Exam",
        'chapterGu': "સર્વગ્રાહી અધ્યયન (શ્લોક 1 થી 315 સંપૂર્ણ કસોટી)",
        'chapterHi': "सर्वग्राही अध्ययन (श्लोक 1 से 315 सम्पूर्ण परीक्षा)",
        'chapterEn': "Comprehensive Scripture Mastery (Verses 1-315)",
        'count': 50
    }
]

for cfg in comp_configs:
    start_id = cfg['start']
    end_id = cfg['end']
    total_q = cfg['count']
    verse_ids = list(range(start_id, end_id + 1))
    comp_pool = [shlokas[sid] for sid in verse_ids]
    
    questions = []
    
    # Spread evenly across the range
    step = len(verse_ids) / total_q
    selected_targets = [verse_ids[min(len(verse_ids) - 1, int(i * step))] for i in range(total_q)]
    
    for i, target_id in enumerate(selected_targets):
        mod = i % 3
        q_id_str = f"{cfg['id']}_{i + 1}"
        if mod == 0:
            questions.append(make_completion_question(target_id, comp_pool, q_id_str))
        elif mod == 1:
            questions.append(make_reverse_completion_question(target_id, comp_pool, q_id_str))
        else:
            questions.append(make_meaning_to_verse_question(target_id, comp_pool, q_id_str))
            
    test_sets.append({
        'id': cfg['id'],
        'startShloka': start_id,
        'endShloka': end_id,
        'titleGu': cfg['titleGu'],
        'titleHi': cfg['titleHi'],
        'titleEn': cfg['titleEn'],
        'chapterGu': cfg['chapterGu'],
        'chapterHi': cfg['chapterHi'],
        'chapterEn': cfg['chapterEn'],
        'questionsCount': len(questions),
        'questions': questions
    })

total_questions_all = sum(len(t['questions']) for t in test_sets)
print(f"Generated {len(test_sets)} test sets with {total_questions_all} questions total.")

# Write to src/data/quizDatabase.ts
header_ts = f"""// Autogenerated {len(test_sets)} Swadhyay Quiz Test Sets ({total_questions_all} questions total)
// Covering all 315 Shlokas with ascending blocks, topic revisions, and comprehensive mock examination
import {{ QuizTestSet, QuizQuestion, SanskritScript }} from '../types';

export const QUIZ_TEST_SETS: QuizTestSet[] = """

footer_ts = """;

/**
 * Returns all test sets (both section blocks and comprehensive mock exams)
 */
export function getAllQuizTestSets(): QuizTestSet[] {
  return QUIZ_TEST_SETS;
}

/**
 * Returns a specific test set by ID
 */
export function getQuizTestSetById(id: number): QuizTestSet | undefined {
  return QUIZ_TEST_SETS.find(s => s.id === id);
}

/**
 * Returns the questions for the Daily Swadhyay Test
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
