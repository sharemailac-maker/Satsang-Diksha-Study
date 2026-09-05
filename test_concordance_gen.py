import json, re

with open('anirdesh_vachanamrut_appendix_g.json', 'r', encoding='utf-8') as f:
    app_g = json.load(f)

with open('anirdesh_vato_by_category.json', 'r', encoding='utf-8') as f:
    vato_cats = json.load(f)

with open('src/data/shlokas.ts', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('export const SHLOKAS')
eq_pos = text.find('=', pos)
bracket_start = text.find('[', eq_pos)
semi_pos = text.find(';\n\nexport function', bracket_start)
bracket_end = text.rfind(']', bracket_start, semi_pos)
shlokas = json.loads(text[bracket_start:bracket_end+1])

print(f"Loaded {len(shlokas)} shlokas.")
