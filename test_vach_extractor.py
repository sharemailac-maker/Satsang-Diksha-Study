import json, re

with open('anirdesh_vachanamrut_appendix_g.json', 'r', encoding='utf-8') as f:
    app_g = json.load(f)

with open('anirdesh_vato_by_category.json', 'r', encoding='utf-8') as f:
    vato_cats = json.load(f)

print("Topic sample:")
for t in app_g[:3]:
    print(t['code'], t['topic_gu'], t['topic_en'], t['vachnamruts'][:3])

print("\nVato category sample:")
for k, v in list(vato_cats.items())[:3]:
    print(k, v['vato'][:3])
