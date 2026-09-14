# Permanent Project Directives & Data Protection Rules

## 🛡️ CRITICAL DIRECTIVE 1: STRICT DATA PROTECTION & PRESERVATION
1. **Zero Unconsented Data Deletion**:
   - You are **STRICTLY FORBIDDEN** from deleting, truncating, emptying, or overwriting any application data, files, scripture records, shlokas, padachheda (word-by-word breakdowns), anvaya (prose order), translations, cross-scriptural concordance records (Vachnamrut & Swamini Vato), quizzes, or assets without explicit, prior user consent.
   - Never call `delete_file`, `delete_dir`, or destructive commands on project files or datasets.

2. **Mandatory Double-Confirmation Protocol**:
   - Before ANY deletion or removal of data, files, or features:
     - Step 1: You must pause and explicitly ask the user for permission, explaining exactly what would be removed and why.
     - Step 2: You must require the user to confirm a second time before any deletion action can take place.
   - If the user does not explicitly confirm twice, do NOT delete or remove anything.

3. **Checklist Before Every Action**:
   - [ ] Does this operation delete, remove, overwrite, or truncate any data, shlokas, quizzes, or files?
   - [ ] If YES: **STOP IMMEDIATELY**. Do not execute. Ask the user for consent and confirm twice.
   - [ ] If NO: Proceed safely while verifying that all existing datasets and features remain intact.

4. **Preserve User Settings & State**:
   - All user preferences, bookmarks, memorization records, streak data, and local state must always be protected and preserved across all updates.

---

## 🔒 CRITICAL DIRECTIVE 2: SECRETS, API KEYS & ANTI-MISUSE SECURITY
1. **Zero Client-Side Secret Leakage**:
   - Never hardcode, embed, or expose secret API keys, private tokens, admin credentials, database connection strings, or sensitive URLs in any client-side files, JSX/TSX components, HTML tags, or publicly distributed assets.
   - Never prefix secret API keys with `VITE_` (as `VITE_` makes variables publicly accessible in browser inspection and client bundles).
   - All sensitive operations or external API calls requiring secrets must strictly remain server-side behind `/api/*` proxy endpoints.

2. **Environment & Build Hygiene**:
   - Actual secrets belong only in environment variables managed securely by the platform runtime and `.gitignore`.
   - Never log secrets, auth tokens, or private user identifiers to browser console logs, error toasts, or external telemetry.
   - All user input and stored preferences must be sanitized and validated to prevent script injection (XSS) or prototype pollution.

3. **Application Integrity & Misuse Prevention**:
   - Ensure the app cannot be repurposed, hijacked, or manipulated to act as an open proxy or leak system resources.
   - Guard scripture and quiz assets with immutable structures so users always receive authentic, untampered holy scripture texts.
