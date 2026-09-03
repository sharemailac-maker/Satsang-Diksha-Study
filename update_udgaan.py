import re

with open('src/components/UdgaanView.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace UDGAAN_SECTIONS definition
sections_old = '''const UDGAAN_SECTIONS: UdgaanSection[] = [
  {
    id: 1,
    titleGu: 'ઉદ્ગાન ૧ (Udgaan 1)',
    titleHi: 'उद्गान १ (श्लोक १–५०)',
    titleEn: 'Udgaan 1 (Verses 1–50)',
    titleDeva: 'उद्गानम् १ (श्लोकाः १–५०)',
    range: [1, 50],
    descriptionGu: 'મંગલાચરણ, શાસ્ત્ર પ્રયોજન, નિત્ય પ્રાતઃપૂજા વિધિ અને આહ્નિક નિયમ',
    descriptionHi: 'मंगलाचरण, शास्त्र प्रयोजन, नित्य प्रातःपूजा विधि एवं आह्निक नियम',
    descriptionEn: 'Invocation, purpose of scripture, morning puja ritual, and daily practices'
  },
  {
    id: 2,
    titleGu: 'ઉદ્ગાન ૨ (Udgaan 2)',
    titleEn: 'Udgaan 2 (Verses 51–115)',
    titleDeva: 'उद्गानम् २ (श्लोकाः ५૧–૧૧૫)',
    range: [51, 115],
    descriptionGu: 'તિલક-ચાંદલો, કંઠી ધારણ, આહાર શુદ્ધિ, ઉપવાસ અને સદાચાર નિયમો',
    descriptionEn: 'Tilak-chandlo, kanthi, dietary purity, fasting, and moral conduct'
  },
  {
    id: 3,
    titleGu: 'ઉદ્ગાન ૩ (Udgaan 3)',
    titleEn: 'Udgaan 3 (Verses 116–158)',
    titleDeva: 'उद्गानम् ३ (श्લોકાः ११६–૧૫૮)',
    range: [116, 158],
    descriptionGu: 'નિર્વ્યસની જીવન, અહિંસા, સત્સંગ સભા અને ઘરસભા મર્યાદા',
    descriptionEn: 'Addiction-free living, non-violence, satsang assembly, and home assembly'
  },
  {
    id: 4,
    titleGu: 'ઉદ્ગાન ૪ (Udgaan 4)',
    titleEn: 'Udgaan 4 (Verses 159–208)',
    titleDeva: 'उद्गानम् ४ (श्लोकाः १५૯–૨૦૮)',
    range: [159, 208],
    descriptionGu: 'પારિવારિક સંવાદિતા, માતા-પિતા ભક્તિ, સંપ અને વ્યવહાર શુદ્ધિ',
    descriptionEn: 'Family harmony, devotion to parents, unity, and social integrity'
  },
  {
    id: 5,
    titleGu: 'ઉદ્ગાન ૫ (Udgaan 5)',
    titleEn: 'Udgaan 5 (Verses 209–257)',
    titleDeva: 'उद्गानम् ५ (श्लोકાः २०९–२૫૭)',
    range: [209, 257],
    descriptionGu: 'અંતઃશત્રુ વિજય, નિર્દોષબુદ્ધિ, મહિમા ચિંતન અને દિવ્યભાવ સાધના',
    descriptionEn: 'Overcoming inner enemies, seeing virtues, divine glory, and spiritual vision'
  },
  {
    id: 6,
    titleGu: 'ઉદ્ગાન ૬ (Udgaan 6)',
    titleEn: 'Udgaan 6 (Verses 258–315)',
    titleDeva: 'उद्गानम् ६ (श्લોકાઃ २५૮–૩૧૫)',
    range: [258, 315],
    descriptionGu: 'અક્ષરપુરુષોત્તમ દાર્શનિક સિદ્ધાંત, ગુરુભક્તિ, આશીર્વાદ અને ફલશ્રુતિ',
    descriptionEn: 'Akshar-Purushottam philosophy, devotion to Guru, blessings, and fruits'
  }
];'''

# Let's find UDGAAN_SECTIONS using regex
pattern = r'const UDGAAN_SECTIONS: UdgaanSection\[\] = \[.*?\];'
match = re.search(pattern, content, re.DOTALL)
if match:
    print('Found UDGAAN_SECTIONS match!')
else:
    print('UDGAAN_SECTIONS pattern not matched')
