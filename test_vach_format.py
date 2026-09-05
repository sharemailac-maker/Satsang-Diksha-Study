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
}

def format_vach(vach_code):
    # e.g. GI-1, GII-9, Var-11, Sar-1, Pan-6, Loya-7
    m = re.match(r'^([A-Za-z\-]+)-?(\d+)', vach_code)
    if not m:
        return None
    pfx, num = m.group(1), m.group(2)
    if pfx not in PREFIX_MAP:
        return None
    g_pfx, h_pfx, e_pfx = PREFIX_MAP[pfx]
    
    sec_gu = f"{g_pfx} {to_guj(num)}"
    sec_hi = f"{h_pfx} {to_hin(num)}"
    sec_en = f"{e_pfx}{num}"
    
    return {
        "type": "vachnamrut",
        "titleGu": f"વચનામૃત {sec_gu}",
        "titleHi": f"वचनामृत {sec_hi}",
        "titleEn": f"Vachnamrut {sec_en}",
        "section": sec_gu,
        "sectionHi": sec_hi,
        "sectionEn": sec_en,
    }

def format_vato(prakaran_num):
    # e.g. "1/14", "2/23", "5/392"
    m = re.match(r'^(\d+)/(\d+)', prakaran_num)
    if not m:
        return None
    prak, num = m.group(1), m.group(2)
    sec_gu = f"પ્રકરણ {to_guj(prak)}/{to_guj(num)}"
    sec_hi = f"प्रकरण {to_hin(prak)}/{to_hin(num)}"
    sec_en = f"Prakaran {prak}/{num}"
    return {
        "type": "swamini_vato",
        "titleGu": f"સ્વામીની વાતો {sec_gu}",
        "titleHi": f"स्वामीनी बातें {sec_hi}",
        "titleEn": f"Swamini Vato {sec_en}",
        "section": sec_gu,
        "sectionHi": sec_hi,
        "sectionEn": sec_en,
    }

print(format_vach("GI-1"))
print(format_vach("GII-9"))
print(format_vach("Var-11"))
print(format_vato("1/14"))
print(format_vato("2/23"))
