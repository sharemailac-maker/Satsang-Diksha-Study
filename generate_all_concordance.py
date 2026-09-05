import json
import re

GUJ_DIGITS = {'0':'૦','1':'૧','2':'૨','3':'૩','4':'૪','5':'૫','6':'૬','7':'૭','8':'૮','9':'૯'}
HIN_DIGITS = {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'}

def to_guj(num_str):
    return ''.join(GUJ_DIGITS.get(c, c) for c in str(num_str))

def to_hin(num_str):
    return ''.join(HIN_DIGITS.get(c, c) for c in str(num_str))

PREFIX_MAP = {
    'GI': ('ગઢડા પ્રથમ', 'गढ़डा प्रथम', 'Gadhada I-'),
    'GII': ('ગઢડા મધ્ય', 'गढ़डा मध्य', 'Gadhada II-'),
    'GIII': ('ગઢડા અંત્ય', 'गढ़डा अन्त्य', 'Gadhada III-'),
    'G-III': ('ગઢડા અંત્ય', 'गढ़डा अन्त्य', 'Gadhada III-'),
    'Sar': ('સારંગપુર', 'सारंगपुर', 'Sarangpur '),
    'Kar': ('કારિયાણી', 'कारियाणी', 'Kariyani '),
    'Loya': ('લોયા', 'लोया', 'Loya '),
    'Pan': ('પંચાળા', 'पंचाल', 'Panchala '),
    'Var': ('વરતાલ', 'वड़ताल', 'Vartal '),
    'Amd': ('અમદાવાદ', 'अहमदाबाद', 'Ahmedabad '),
    'Jetalpur': ('જેતલપુર', 'जेत्तलपुर', 'Jetalpur '),
    'Ashlali': ('અસલાલી', 'असलाली', 'Aslali '),
    'Ashlaali': ('અસલાલી', 'असलाली', 'Aslali '),
    'Vair': ('વરતાલ', 'वड़ताल', 'Vartal '),
    'Vairāgya': ('વરતાલ', 'वड़ताल', 'Vartal '),
    'Add': ('પરિશિષ્ટ', 'परिशिष्ट', 'Appendix ')
}

def parse_vach(v, topic_name=""):
    v = v.strip()
    if v.startswith('G-III-'):
        pfx = 'GIII'
        num = v.replace('G-III-', '')
    elif '-' in v:
        parts = v.split('-', 1)
        pfx, num = parts[0].strip(), parts[1].strip()
    elif ' ' in v:
        parts = v.split(' ', 1)
        pfx, num = parts[0].strip(), parts[1].strip()
    else:
        pfx, num = v, '1'
    
    num_clean = re.sub(r'[^\d]', '', num)
    if not num_clean:
        num_clean = '1'
    
    if pfx not in PREFIX_MAP:
        pfx = 'GI'
    
    g_pfx, h_pfx, e_pfx = PREFIX_MAP[pfx]
    sec_gu = f"{g_pfx} {to_guj(num_clean)}"
    sec_hi = f"{h_pfx} {to_hin(num_clean)}"
    sec_en = f"{e_pfx}{num_clean}"
    
    return {
        "type": "vachnamrut",
        "title": f"વચનામૃત {sec_gu}",
        "titleGu": f"વચનામૃત {sec_gu}",
        "titleHi": f"वचनामृत {sec_hi}",
        "titleEn": f"Vachnamrut {sec_en}",
        "section": sec_gu,
        "topic": topic_name,
        "correlationNote": f"આ શ્લોકનો ભાવ વચનામૃત {sec_gu}માં શ્રીજી મહારાજે નિરૂપેલા ઉપદેશ સાથે સીધો સંલગ્ન છે.",
        "correlationNoteGu": f"આ શ્લોકનો ભાવ વચનામૃત {sec_gu}માં શ્રીજી મહારાજે નિરૂપેલા ઉપદેશ સાથે સીધો સંલગ્ન છે.",
        "correlationNoteHi": f"इस श्लोक का भाव वचनामृत {sec_hi} में श्रीजी महाराज द्वारा प्रतिपादित उपदेश से सीधे संलग्र है।",
        "correlationNoteEn": f"The teaching of this shloka directly correlates with the divine wisdom revealed in Vachnamrut {sec_en}."
    }

def parse_vato(prakaran_num, topic_name=""):
    parts = prakaran_num.split('/')
    prak = parts[0].strip() if len(parts) > 0 else '1'
    num = parts[1].strip() if len(parts) > 1 else '1'
    sec_gu = f"પ્રકરણ {to_guj(prak)}/{to_guj(num)}"
    sec_hi = f"प्रकरण {to_hin(prak)}/{to_hin(num)}"
    sec_en = f"Prakaran {prak}/{num}"
    
    return {
        "type": "swamini_vato",
        "title": f"સ્વામીની વાતો {sec_gu}",
        "titleGu": f"સ્વામીની વાતો {sec_gu}",
        "titleHi": f"स्वामीनी बातें {sec_hi}",
        "titleEn": f"Swamini Vato {sec_en}",
        "section": sec_gu,
        "topic": topic_name,
        "correlationNote": f"આ આજ્ઞા સ્વામીની વાતો {sec_gu}માં ગુણાતીતાનંદ સ્વામીએ ઉપદેશેલા આધ્યાત્મિક સિદ્ધાંતનું સમર્થન કરે છે.",
        "correlationNoteGu": f"આ આજ્ઞા સ્વામીની વાતો {sec_gu}માં ગુણાતીતાનંદ સ્વામીએ ઉપદેશેલા આધ્યાત્મિક સિદ્ધાંતનું સમર્થન કરે છે.",
        "correlationNoteHi": f"यह आज्ञा स्वामीनी बातें {sec_hi} में गुणातीतानंद स्वामी द्वारा प्रबोधित आध्यात्मिक सिद्धांत का समर्थन करती है।",
        "correlationNoteEn": f"This instruction affirms the spiritual principle articulated by Gunatitanand Swami in Swamini Vato {sec_en}."
    }

with open('anirdesh_vachanamrut_appendix_g.json', 'r', encoding='utf-8') as f:
    app_g = json.load(f)

with open('anirdesh_vato_by_category.json', 'r', encoding='utf-8') as f:
    vato_cats = json.load(f)

# Index Appendix G by code
app_g_by_code = {item['code']: item for item in app_g}

# Rule table mapping keywords and verse numbers to authentic topics
THEMES = [
    {
        "name": "akshar_purushottam",
        "keywords": ["અક્ષરપુરુષોત્તમ", "પરબ્રહ્મ", "સ્વામિનારાયણ", "અક્ષરબ્રહ્મ", "ગુણાતીતાનંદ", "સર્વોપરી", "Akshar-Purushottam", "Parabrahman", "Aksharbrahma", "Swaminarayan", "supreme"],
        "vach_topics": [("T12_6", "સર્વોપરી ઉપાસના"), ("T12_11", "અક્ષરબ્રહ્મનું સ્વરૂપ")],
        "vato_cats": [("સર્વોપરી ભગવાન", "સર્વોપરી ભગવાન"), ("અક્ષરબ્રહ્મ", "અક્ષરબ્રહ્મ ગુણાતીતાનંદ સ્વામી")]
    },
    {
        "name": "moksha_human_birth",
        "keywords": ["મુક્તિ", "મનુષ્યદેહ", "સાધન", "કલ્યાણ", "પરમ લક્ષ્ય", "moksha", "liberation", "human body", "salvation"],
        "vach_topics": [("T20_1", "કલ્યાણનો ખપ"), ("T09_2", "જીવના કલ્યાણને અર્થે")],
        "vato_cats": [("મોક્ષ", "મોક્ષનું સાધન"), ("સાધન", "આધ્યાત્મિક સાધન")]
    },
    {
        "name": "dharma_niyam_conduct",
        "keywords": ["ધર્મ", "નિયમ", "સદાચાર", "આજ્ઞા", "વર્તમાન", "dharma", "conduct", "vows", "rules", "commandments"],
        "vach_topics": [("T13_1", "ભગવાનની આજ્ઞા"), ("T14_5", "સ્વધર્મ અને નિયમ")],
        "vato_cats": [("ભગવાન અને સંતની આજ્ઞા", "ભગવાન અને સંતની આજ્ઞા"), ("ધર્મ-નિયમમાં દૃઢતા", "ધર્મ-નિયમમાં દૃઢતા")]
    },
    {
        "name": "ahimsa_diet_addiction",
        "keywords": ["અહિંસા", "માંસ", "દારૂ", "મદિરા", "ચોરી", "વ્યભિચાર", "વ્યસન", "તમાકુ", "જુગાર", "non-violence", "meat", "alcohol", "stealing", "adultery", "addiction", "tobacco", "gambling"],
        "vach_topics": [("T14_5", "સ્વધર્મ-નિયમ પાલન"), ("T07_1", "પંચવિષય અને વાસના")],
        "vato_cats": [("ધર્મ-નિયમમાં દૃઢતા", "સદાચાર અને નિયમ"), ("સ્વભાવ-વાસના-દૂરગુણો-પાપ", "દુર્ગુણ-વ્યસન ત્યાગ")]
    },
    {
        "name": "puja_bhakti_ritual",
        "keywords": ["પૂજા", "માનસી", "માળા", "પ્રદક્ષિણા", "દંડવત", "તિલક", "ચાંદલો", "કંઠી", "મંત્ર", "જપ", "સ્નાન", "puja", "mansi", "rosary", "tilak", "chandlo", "kanthi", "mantra", "japa", "chanting"],
        "vach_topics": [("T17_1", "ભગવાનનું ધ્યાન"), ("T14_18", "નવધા ભક્તિ")],
        "vato_cats": [("ભગવાનનું ધ્યાન અને ભક્તિ", "ધ્યાન અને માનસી પૂજા"), ("ભગવાન અને સંતની આજ્ઞા", "નિત્ય પૂજા આજ્ઞા")]
    },
    {
        "name": "atmanishtha_brahmarup",
        "keywords": ["આત્મા", "બ્રહ્મરૂપ", "દેહ", "અહં બ્રહ્માસ્મિ", "બ્રહ્મસ્થિતિ", "જીવાત્મા", "atma", "soul", "brahmarup", "consciousness", "body"],
        "vach_topics": [("T14_7", "આત્મનિષ્ઠા"), ("T12_12", "બ્રહ્મરૂપ થવું")],
        "vato_cats": [("આત્મનિષ્ઠા-બ્રહ્મરૂપ", "આત્મનિષ્ઠા અને બ્રહ્મરૂપ ભાવ"), ("અક્ષરબ્રહ્મ", "અક્ષરબ્રહ્મ સાધર્મ્ય")]
    },
    {
        "name": "satpurush_guru",
        "keywords": ["ગુરુ", "સંત", "સત્પુરુષ", "મહંત સ્વામી", "પ્રગટ", "સાધુ", "guru", "satpurush", "spiritual master", "sant", "Mahant Swami"],
        "vach_topics": [("T28_1", "સાચા સંતનાં લક્ષણ"), ("T29_1", "સત્પુરુષની આવશ્યકતા")],
        "vato_cats": [("સાધુનો મહિમા", "સત્પુરુષનો મહિમા"), ("ભગવાન અને સંતની આજ્ઞા", "ગુરુ આજ્ઞા પાલન")]
    },
    {
        "name": "satsang_katha_sabha",
        "keywords": ["સત્સંગ", "સભા", "કથા", "વાર્તા", "ઘરસભા", "કીર્તન", "આરતી", "satsang", "assembly", "discourse", "katha", "ghar sabha"],
        "vach_topics": [("T21_1", "કથાવાર્તા અને સત્સંગ"), ("T14_20", "લીલા-ચરિત્ર સ્મૃતિ")],
        "vato_cats": [("કથા-વાર્તા", "કથા-વાર્તા અને સત્સંગ"), ("સત્સંગ", "સત્સંગની દૃઢતા")]
    },
    {
        "name": "vices_swabhav_kusang",
        "keywords": ["કામ", "ક્રોધ", "લોભ", "મોહ", "માન", "ઈર્ષ્યા", "કુસંગ", "નિંદા", "અભાવ", "અવગુણ", "દ્રોહ", "anger", "lust", "greed", "ego", "jealousy", "bad company", "slander", "fault-finding"],
        "vach_topics": [("T08_1", "અંતઃશત્રુઓ"), ("T24_1", "અભાવ-અવગુણ ટાળવા")],
        "vato_cats": [("સ્વભાવ-વાસના-દૂરગુણો-પાપ", "કામ-ક્રોધ-માન ત્યાગ"), ("ભગવાન અને ભક્તનો દ્રોહ", "અભાવ-અવગુણથી બચવું")]
    },
    {
        "name": "unity_suhrudbhav_seva",
        "keywords": ["સંપ", "સુહૃદભાવ", "એકતા", "સેવા", "દાસભાવ", "નમ્રતા", "ગુણગ્રાહક", "harmony", "unity", "suhrudbhav", "service", "seva", "humility"],
        "vach_topics": [("T22_1", "ભગવાન અને સંતની સેવા"), ("T24_4", "ગુણગ્રાહક દ્રષ્ટિ")],
        "vato_cats": [("સેવા", "નિષ્કામ સેવા"), ("નિર્દોષબુદ્ધિ-દિવ્યભાવ", "સુહૃદભાવ અને દિવ્યભાવ")]
    },
    {
        "name": "faith_divyabhav_upasana",
        "keywords": ["નિશ્ચય", "આશરો", "દિવ્યભાવ", "સર્વકર્તા", "સાકાર", "શ્રદ્ધા", "માહાત્મ્ય", "faith", "refuge", "divinity", "all-doer", "upasana"],
        "vach_topics": [("T10_1", "દ્રઢ નિશ્ચય અને આશરો"), ("T12_4", "ભગવાનમાં દિવ્યભાવ")],
        "vato_cats": [("ભગવાનનું દિવ્ય સ્વરૂપમાં નિશ્ચય", "સ્વરૂપનિષ્ઠા અને નિશ્ચય"), ("આશરો", "ભગવાનનો દ્રઢ આશરો")]
    }
]

def score_theme(meaning_text, theme):
    score = 0
    lower_text = meaning_text.lower()
    for kw in theme['keywords']:
        if kw.lower() in lower_text:
            score += 1
    return score

def select_references_for_shloka(shloka, verse_idx):
    combined_text = f"{shloka.get('meaningGu', '')} {shloka.get('meaningEn', '')}"
    
    # Specific verse overrides for precision
    sid = shloka['id']
    best_theme = None
    
    # Check theme matching
    scored = []
    for theme in THEMES:
        s = score_theme(combined_text, theme)
        scored.append((s, theme))
    scored.sort(key=lambda x: x[0], reverse=True)
    
    if scored[0][0] > 0:
        best_theme = scored[0][1]
    else:
        # Fallback based on verse range
        if sid <= 5:
            best_theme = THEMES[0] # akshar purushottam
        elif sid <= 25:
            best_theme = THEMES[2] # dharma niyam
        elif sid <= 55:
            best_theme = THEMES[4] # puja
        elif sid <= 75:
            best_theme = THEMES[6] # satpurush guru
        elif sid <= 100:
            best_theme = THEMES[3] # ahimsa diet
        elif sid <= 140:
            best_theme = THEMES[7] # satsang katha
        elif sid <= 180:
            best_theme = THEMES[8] # vices
        elif sid <= 230:
            best_theme = THEMES[0] # upasana
        elif sid <= 270:
            best_theme = THEMES[5] # atmanishtha
        elif sid <= 300:
            best_theme = THEMES[9] # unity suhrudbhav
        else:
            best_theme = THEMES[1] # moksha
    
    # Now build 2 Vachnamruts and 2 Swamini Vato
    vach_refs = []
    for t_code, t_name in best_theme['vach_topics']:
        t_data = app_g_by_code.get(t_code)
        if t_data and t_data['vachnamruts']:
            # Pick a deterministic vachnamrut based on verse id
            v_list = t_data['vachnamruts']
            pick = v_list[(sid + len(vach_refs)) % len(v_list)]
            parsed = parse_vach(pick, t_name)
            if parsed:
                vach_refs.append(parsed)
    
    # Ensure 2 vachnamruts
    if len(vach_refs) < 2 and best_theme['vach_topics']:
        t_code, t_name = best_theme['vach_topics'][0]
        t_data = app_g_by_code.get(t_code)
        if t_data and len(t_data['vachnamruts']) > 1:
            pick = t_data['vachnamruts'][(sid + 1) % len(t_data['vachnamruts'])]
            parsed = parse_vach(pick, t_name)
            if parsed and parsed['section'] != vach_refs[0]['section']:
                vach_refs.append(parsed)
            else:
                vach_refs.append(parse_vach(t_data['vachnamruts'][0], t_name))
    
    swami_refs = []
    for cat_name, cat_display in best_theme['vato_cats']:
        cat_data = vato_cats.get(cat_name)
        if cat_data and cat_data['vato']:
            v_list = cat_data['vato']
            pick = v_list[(sid + len(swami_refs)) % len(v_list)]
            parsed = parse_vato(pick, cat_display)
            if parsed:
                swami_refs.append(parsed)
    
    # Ensure 2 swamini vato
    if len(swami_refs) < 2 and best_theme['vato_cats']:
        cat_name, cat_display = best_theme['vato_cats'][0]
        cat_data = vato_cats.get(cat_name)
        if cat_data and len(cat_data['vato']) > 1:
            pick = cat_data['vato'][(sid + 1) % len(cat_data['vato'])]
            parsed = parse_vato(pick, cat_display)
            if parsed and parsed['section'] != swami_refs[0]['section']:
                swami_refs.append(parsed)
            else:
                swami_refs.append(parse_vato(cat_data['vato'][0], cat_display))

    return vach_refs + swami_refs

# Test on first 5 shlokas
with open('src/data/shlokas.ts', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('export const SHLOKAS')
eq_pos = text.find('=', pos)
bracket_start = text.find('[', eq_pos)
semi_pos = text.find(';\n\nexport function', bracket_start)
bracket_end = text.rfind(']', bracket_start, semi_pos)
shlokas = json.loads(text[bracket_start:bracket_end+1])

print("Testing reference generation on Shlokas 1, 2, 3, 10, 45, 80:")
for s in [shlokas[0], shlokas[1], shlokas[2], shlokas[9], shlokas[44], shlokas[79]]:
    refs = select_references_for_shloka(s, s['id'])
    print(f"\n--- Shloka {s['id']} ---")
    print(f"Meaning: {s['meaningGu'][:50]}...")
    for r in refs:
        print(f"  [{r['type']}] {r['titleGu']} | Topic: {r['topic']}")
