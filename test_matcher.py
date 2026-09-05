import json, re

with open('anirdesh_vachanamrut_appendix_g.json', 'r', encoding='utf-8') as f:
    app_g = json.load(f)

with open('anirdesh_vato_by_category.json', 'r', encoding='utf-8') as f:
    vato_cats = json.load(f)

print(f"Loaded {len(app_g)} Appendix G topics and {len(vato_cats)} Swamini Vato categories.")
