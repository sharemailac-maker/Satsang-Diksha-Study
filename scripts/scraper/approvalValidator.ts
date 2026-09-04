/**
 * Approval & Validation System
 * Allows manual review and approval of suggested cross-references
 * Generates a user-friendly template for verification
 */

import * as fs from 'fs';
import * as path from 'path';

interface SimilarityMatch {
  type: 'vachnamrut' | 'swamini_vato';
  ref: string;
  subject_or_category: string;
  text_snippet: string;
  similarity_score: number;
  matched_keywords: string[];
}

interface CrossReferenceResult {
  diksha_id: number;
  diksha_title_gu: string;
  diksha_meaning_snippet: string;
  suggested_matches: SimilarityMatch[];
}

interface ApprovalTemplate {
  diksha_id: number;
  diksha_title_gu: string;
  diksha_meaning_snippet: string;
  suggestions: {
    rank: number;
    type: string;
    ref: string;
    subject_or_category: string;
    similarity_score: number;
    matched_keywords: string[];
    your_approval: boolean; // USER MARKS TRUE/FALSE
    your_notes: string;     // USER ADDS NOTES IF NEEDED
  }[];
}

/**
 * Generate approval template CSV for user review
 */
function generateApprovalTemplate(
  suggestions: CrossReferenceResult[],
  outputPath: string
): void {
  console.log('📋 Generating approval template for user review...\n');

  const templates: ApprovalTemplate[] = suggestions.map(result => ({
    diksha_id: result.diksha_id,
    diksha_title_gu: result.diksha_title_gu,
    diksha_meaning_snippet: result.diksha_meaning_snippet,
    suggestions: result.suggested_matches.map((match, idx) => ({
      rank: idx + 1,
      type: match.type === 'vachnamrut' ? 'વચનામૃત' : 'સ્વામીની વાતો',
      ref: match.ref,
      subject_or_category: match.subject_or_category,
      similarity_score: parseFloat((match.similarity_score * 100).toFixed(1)),
      matched_keywords: match.matched_keywords,
      your_approval: false, // DEFAULT FALSE - USER TO UPDATE
      your_notes: ''        // USER TO UPDATE WITH NOTES
    }))
  }));

  // Save as JSON for easier user manipulation
  fs.writeFileSync(outputPath, JSON.stringify(templates, null, 2), 'utf8');
  console.log(`✅ Approval template saved: ${outputPath}`);
  console.log(`\n📝 INSTRUCTIONS FOR YOU:`);
  console.log(`1. Open: ${path.basename(outputPath)}`);
  console.log(`2. For each suggestion, set "your_approval" to true/false`);
  console.log(`3. Add notes in "your_notes" if you want to explain your decision`);
  console.log(`4. Save the file with same name`);
  console.log(`5. Run: npm run process-approvals\n`);
}

/**
 * Process user approvals and generate final cross-references
 */
function processApprovals(
  templatePath: string,
  outputPath: string
): { total: number; approved: number; rejected: number } {
  console.log('\n✔️ Processing your approvals...\n');

  if (!fs.existsSync(templatePath)) {
    console.warn('⚠️ Approval template not found. Using auto-approval of top matches...');
    return { total: 0, approved: 0, rejected: 0 };
  }

  const templates: ApprovalTemplate[] = JSON.parse(
    fs.readFileSync(templatePath, 'utf8')
  );

  const finalReferences: any[] = [];
  let approvedCount = 0;
  let rejectedCount = 0;

  for (const template of templates) {
    const approved = template.suggestions.filter(s => s.your_approval);

    if (approved.length > 0) {
      finalReferences.push({
        diksha_id: template.diksha_id,
        diksha_title_gu: template.diksha_title_gu,
        approved_references: approved.map(a => ({
          type: a.type === 'વચનામૃત' ? 'vachnamrut' : 'swamini_vato',
          ref: a.ref,
          subject_or_category_gu: a.subject_or_category,
          similarity_score: a.similarity_score / 100, // Convert back to decimal
          matched_keywords: a.matched_keywords,
          user_notes: a.your_notes || '',
          approved_date: new Date().toISOString().split('T')[0]
        }))
      });

      approvedCount += approved.length;
    }

    rejectedCount += template.suggestions.length - approved.length;
  }

  // Save final approved references
  fs.writeFileSync(outputPath, JSON.stringify(finalReferences, null, 2), 'utf8');

  console.log(`✅ Processing complete!`);
  console.log(`📊 Statistics:`);
  console.log(`   Total suggestions: ${templates.reduce((sum, t) => sum + t.suggestions.length, 0)}`);
  console.log(`   Approved: ${approvedCount}`);
  console.log(`   Rejected: ${rejectedCount}`);
  console.log(`   Verses with approvals: ${finalReferences.length}`);
  console.log(`\n✅ Final references saved: ${outputPath}\n`);

  return {
    total: templates.reduce((sum, t) => sum + t.suggestions.length, 0),
    approved: approvedCount,
    rejected: rejectedCount
  };
}

/**
 * Main execution
 */
async function run() {
  const dataDir = path.join(process.cwd(), 'data', 'scraped');
  const suggestionsPath = path.join(dataDir, 'cross_references_suggested.json');
  const approvalTemplatePath = path.join(dataDir, 'approval_template.json');
  const finalReferencesPath = path.join(dataDir, 'cross_references_final_approved.json');

  // Check if we're processing approvals or generating template
  const args = process.argv.slice(2);
  const mode = args[0] || 'generate';

  if (mode === 'generate' || mode === '--generate') {
    console.log('🔍 Generating Approval Template...\n');

    if (!fs.existsSync(suggestionsPath)) {
      console.error('❌ Suggestions file not found. Please run semantic matcher first.');
      process.exit(1);
    }

    const suggestions: CrossReferenceResult[] = JSON.parse(
      fs.readFileSync(suggestionsPath, 'utf8')
    );

    generateApprovalTemplate(suggestions, approvalTemplatePath);
  } else if (mode === 'process' || mode === '--process') {
    console.log('🔍 Processing Approvals...\n');

    if (!fs.existsSync(approvalTemplatePath)) {
      console.error('❌ Approval template not found. Please run with --generate first.');
      process.exit(1);
    }

    processApprovals(approvalTemplatePath, finalReferencesPath);
  } else {
    console.log('Usage:');
    console.log('  npm run approval -- --generate    (Generate template for manual review)');
    console.log('  npm run approval -- --process     (Process your approvals)\n');
  }
}

run();
