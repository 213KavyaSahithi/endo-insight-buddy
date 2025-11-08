import { AssessmentHistory } from "@/types/assessment";

export function buildResultExplanation(assessment: AssessmentHistory): string {
  const { riskLevel, probability, confidence, stage, factors, recommendations } = assessment.result;

  const risk = riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1);
  const probPct = Math.round(probability * 100);
  const confPct = Math.round(confidence * 100);

  const topFactors = (factors || []).slice(0, 5)
    .map((f) => {
      const dir = f.impact >= 0 ? "increases" : "decreases";
      return `${f.feature} (${f.value}) — ${dir} risk`;
    })
    .join("; ");

  const recs = (recommendations || []).slice(0, 5).join("; ");

  const lines = [
    "Here’s a quick explanation of your assessment:",
    `- Overall risk: ${risk} (${probPct}%)`,
    `- Model confidence: ${confPct}%`,
    `- Predicted stage: ${stage} (stage reflects extent of disease, not pain severity)`,
    topFactors ? `- Top factors: ${topFactors}` : "",
    recs ? `- Next steps: ${recs}` : "",
    "This is not a diagnosis.",
  ].filter(Boolean);

  return lines.join("\n");
}
