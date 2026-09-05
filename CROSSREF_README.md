# 📚 Satsang Diksha Cross-Reference Generator

## Overview
This system automatically generates cross-references between:
- **Satsang Diksha** (315 verses with Gujarati meanings)
- **Vachnamrut** (by subject/topic)
- **Swami ni Vato** (by category and prakaran/vat number)

Using **Gujarati semantic matching**, it finds similar meanings across all three scriptures.

---

## 🚀 Quick Start

### Step 1: Run the Generator
```bash
npm run crossref:generate
```

This will:
1. Analyze all 315 Satsang Diksha verses
2. Find matching Vachnamrut references
3. Find matching Swami ni Vato references
4. Generate `data/cross_references.json`

### Step 2: Check Results
Open: `data/cross_references.json`

Each entry shows:
```json
{
  "diksha_id": 1,
  "vachnamrut_references": [
    {
      "type": "vachnamrut",
      "ref": "ગઢડા પ્રથમ ૧",
      "subject_gu": "વિષય",
      "similarity_score": 0.85
    }
  ],
  "swamini_vato_references": [
    {
      "type": "swamini_vato",
      "ref": "૧/૧",
      "category_gu": "કેટેગરી",
      "similarity_score": 0.80
    }
  ]
}
```

### Step 3: Use in Your App

In `src/components/CrossScriptureView.tsx`:

```typescript
import crossReferences from '../../data/cross_references.json';

function displayCrossReferences(shlokaId: number) {
  const refs = crossReferences.find(r => r.diksha_id === shlokaId);
  
  if (!refs) return null;
  
  return (
    <div>
      <h3>વચનામૃત</h3>
      {refs.vachnamrut_references.map(r => (
        <div key={r.ref}>
          <p>{r.ref} - {r.subject_gu}</p>
          <p>Similarity: {(r.similarity_score * 100).toFixed(0)}%</p>
        </div>
      ))}
      
      <h3>સ્વામીની વાતો</h3>
      {refs.swamini_vato_references.map(r => (
        <div key={r.ref}>
          <p>{r.ref} - {r.category_gu}</p>
          <p>Similarity: {(r.similarity_score * 100).toFixed(0)}%</p>
        </div>
      ))}
    </div>
  );
}
```

### Step 4: Edit & Remove Incorrect Matches
- Open `data/cross_references.json` in VS Code
- Remove entries you don't want
- Save and reload your app

---

## 📊 Similarity Scores

- **0.8 - 1.0**: Strong match ✅
- **0.6 - 0.8**: Good match ✅
- **0.4 - 0.6**: Weak match ⚠️
- **< 0.4**: Filtered out ❌

---

## 🔧 Commands

```bash
# Generate cross-references
npm run crossref:generate

# Run only once per update
npm run crossref:generate
```

---

## ✅ Done!

You now have:
- ✓ Cross-reference data in `data/cross_references.json`
- ✓ Ready to use in your app
- ✓ Can manually edit/remove entries
- ✓ No complex validation - just results
