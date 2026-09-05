import json, re

GUJ_DIGITS = {'0':'૦','1':'૧','2':'૨','3':'૩','4':'૪','5':'૫','6':'૬','7':'૭','8':'૮','9':'૯'}
HIN_DIGITS = {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'}

def to_guj(num_str):
    return ''.join(GUJ_DIGITS.get(c, c) for c in str(num_str))

def to_hin(num_str):
    return ''.join(HIN_DIGITS.get(c, c) for c in str(num_str))

PREFIX_MAP = {
    'GI': ('ગઢડા પ્રથમ', 'गढ़डा प्रथम', 'Gadhada I-'),
    'GII': ('ગઢડા મધ્ય', 'गढ़डा मध्य', 'Gadhada II-'),
    'GIII': ('ગઢડા અંત્ય', 'गढ़ડા अन्त्य', 'Gadhada III-'),
    'G-III': ('ગઢડા અંત્ય', 'गढ़ડા अन्त्य', 'Gadhada III-'),
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

def parse_vach(v):
    v = v.strip()
    if '-' in v:
        parts = v.split('-', 1)
        pfx, num = parts[0].strip(), parts[1].strip()
    elif ' ' in v:
        parts = v.split(' ', 1)
        pfx, num = parts[0].strip(), parts[1].strip()
    else:
        pfx, num = v, '1'
    
    # clean num
    num_clean = re.sub(r'[^\d]', '', num)
    if not num_clean:
        num_clean = '1'
    
    if pfx not in PREFIX_MAP:
        # fallback
        return None
    
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
        "correlationNote": f"આ શ્લોકનો ભાવ વચનામૃત {sec_gu}માં શ્રીજી મહારાજે નિરૂપેલા ઉપદેશ સાથે સીધો સંલગ્ન છે.",
        "correlationNoteGu": f"આ શ્લોકનો ભાવ વચનામૃત {sec_gu}માં શ્રીજી મહારાજે નિરૂપેલા ઉપદેશ સાથે સીધો સંલગ્ન છે.",
        "correlationNoteHi": f"इस श्लोક का भाव वचनामृत {sec_hi} में श्रीजी महाराज द्वारा प्रतिपादित उपदेश से सीधे संलग्र है।",
        "correlationNoteEn": f"The teaching of this shloka directly correlates with the divine wisdom revealed in Vachnamrut {sec_en}."
    }

def parse_vato(prakaran_num):
    parts = prakaran_num.split('/')
    prak, num = parts[0].strip(), parts[1].strip()
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
        "correlationNote": f"આ આજ્ઞા સ્વામીની વાતો {sec_gu}માં ગુણાતીતાનંદ સ્વામીએ ઉપદેશેલા આધ્યાત્મિક સિદ્ધાંતનું સમર્થન કરે છે.",
        "correlationNoteGu": f"આ આજ્ઞા સ્વામીની વાતો {sec_gu}માં ગુણાતીતાનંદ સ્વામીએ ઉપદેશેલા આધ્યાત્મિક સિદ્ધાંતનું સમર્થન કરે છે.",
        "correlationNoteHi": f"यह आज्ञा स्वामीनी बातें {sec_hi} में गुणातीतानंद स्वामी द्वारा प्रबोधित आध्यात्मिक सिद्धांत का समर्थन करती है।",
        "correlationNoteEn": f"This instruction affirms the spiritual principle articulated by Gunatitanand Swami in Swamini Vato {sec_en}."
    }

with open('anirdesh_vachanamrut_appendix_g.json', 'r', encoding='utf-8') as f:
    app_g = json.load(f)

unresolved = []
for item in app_g:
    for v in item['vachnamruts']:
        res = parse_vach(v)
        if not res:
            unresolved.append(v)

print(f"Total vach entries checked: {sum(len(item['vachnamruts']) for item in app_g)}, Unresolved: {len(unresolved)}")
if unresolved:
    print("Unresolved examples:", unresolved[:10])
