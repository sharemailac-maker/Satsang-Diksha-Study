# -*- coding: utf-8 -*-
import json
import re

# Canonical normalizer
GU_DIGITS = {'૦':'0','૧':'1','૨':'2','૩':'3','૪':'4','૫':'5','૬':'6','૭':'7','૮':'8','૯':'9'}
HI_DIGITS = {'०':'0','१':'1','२':'2','३':'3','४':'4','५':'5','६':'6','७':'7','८':'8','९':'9'}

def to_ascii_digits(s):
    res = ''
    for c in s:
        if c in GU_DIGITS: res += GU_DIGITS[c]
        elif c in HI_DIGITS: res += HI_DIGITS[c]
        else: res += c
    return res

def normalize_vach_code(sec):
    if not sec: return ''
    s = to_ascii_digits(sec).strip()
    s = s.replace('ગઢડા પ્રથમ', 'GI-').replace('ગઢડા મધ્ય', 'GII-').replace('ગઢડા અંત્ય', 'GIII-')
    s = s.replace('ગ.પ્ર.', 'GI-').replace('ગ. પ્ર.', 'GI-').replace('ગ.મ.', 'GII-').replace('ગ. મ.', 'GII-').replace('ગ.અં.', 'GIII-').replace('ગ. અં.', 'GIII-')
    s = s.replace('गढ़डा प्रथम', 'GI-').replace('गढ़डा मध्य', 'GII-').replace('गढ़डा अन्त्य', 'GIII-')
    s = s.replace('Gadhada I-', 'GI-').replace('Gadhada I ', 'GI-').replace('Gadhada 1-', 'GI-')
    s = s.replace('Gadhada II-', 'GII-').replace('Gadhada II ', 'GII-').replace('Gadhada 2-', 'GII-')
    s = s.replace('Gadhada III-', 'GIII-').replace('Gadhada III ', 'GIII-').replace('Gadhada 3-', 'GIII-')
    s = s.replace('સારંગપુર', 'Sar-').replace('સારંગ.', 'Sar-').replace('सारंगपुर', 'Sar-').replace('Sarangpur', 'Sar-')
    s = s.replace('કારિયાણી', 'Kar-').replace('કારિ.', 'Kar-').replace('कारियाणी', 'Kar-').replace('Kariyani', 'Kar-')
    s = s.replace('લોયા', 'Loya-').replace('લો.', 'Loya-').replace('लोया', 'Loya-').replace('Loya', 'Loya-')
    s = s.replace('પંચાળા', 'Pan-').replace('पंचाल', 'Pan-').replace('Panchala', 'Pan-')
    s = s.replace('વરતાલ', 'Var-').replace('વર.', 'Var-').replace('वड़ताल', 'Var-').replace('Vartal', 'Var-')
    s = s.replace('અમદાવાદ', 'Amd-').replace('અમદા.', 'Amd-').replace('અમ.', 'Amd-').replace('अहमदाबाद', 'Amd-').replace('Ahmedabad', 'Amd-')
    s = s.replace('જેતલપુર', 'Jetalpur-').replace('જેત.', 'Jetalpur-').replace('जेत्तलपुर', 'Jetalpur-').replace('Jetalpur', 'Jetalpur-')
    s = s.replace('અશ્લાલી', 'Ashlali-1').replace('असलाली', 'Ashlali-1').replace('Aslali', 'Ashlali-1')
    m = re.search(r'([A-Za-z]+)-?\s*(\d+)', s)
    if m:
        return f"{m.group(1)}-{m.group(2)}"
    return ''

print("Normalizer compiled")
