import { AssessmentData, PredictionResult, FeatureContribution } from '@/types/assessment';

// Simulated ML model - calculates risk based on clinical guidelines
export const predictEndometriosisRisk = (data: AssessmentData): PredictionResult => {
  const factors: FeatureContribution[] = [];
  let riskScore = 0;

  // Age factor (peak risk 25-35)
  if (data.age >= 25 && data.age <= 35) {
    riskScore += 15;
    factors.push({ feature: 'Age', impact: 15, value: data.age });
  }

  // Pain scores (major indicators)
  const painScore = data.dysmenorrheaScore + data.pelvicPainScore + data.dyspareuniaScore;
  if (painScore > 15) {
    riskScore += 30;
    factors.push({ feature: 'Pain Symptoms', impact: 30, value: `High (${painScore}/30)` });
  } else if (painScore > 8) {
    riskScore += 15;
    factors.push({ feature: 'Pain Symptoms', impact: 15, value: `Moderate (${painScore}/30)` });
  }

  // Digestive/Urinary symptoms
  const otherSymptoms = data.dscheziaScore + data.urinarySymptomsScore;
  if (otherSymptoms > 10) {
    riskScore += 20;
    factors.push({ feature: 'Digestive/Urinary', impact: 20, value: `High (${otherSymptoms}/20)` });
  }

  // Family history (strong indicator)
  if (data.familyHistory) {
    riskScore += 20;
    factors.push({ feature: 'Family History', impact: 20, value: 'Yes' });
  }

  // CA-125 levels (elevated in endometriosis)
  if (data.ca125Level > 35) {
    riskScore += 25;
    factors.push({ feature: 'CA-125 Level', impact: 25, value: `${data.ca125Level.toFixed(1)} U/mL` });
  }

  // Infertility
  if (data.infertilityStatus) {
    riskScore += 15;
    factors.push({ feature: 'Infertility', impact: 15, value: 'Yes' });
  }

  // CRP (inflammation marker)
  if (data.crpLevel > 10) {
    riskScore += 10;
    factors.push({ feature: 'CRP Level', impact: 10, value: `${data.crpLevel.toFixed(1)} mg/L` });
  }

  // Mental health (often affected)
  if (data.mentalHealthScore > 6) {
    riskScore += 5;
    factors.push({ feature: 'Mental Health Impact', impact: 5, value: data.mentalHealthScore });
  }

  // Calculate probability and stage
  const probability = Math.min(riskScore / 100, 0.95);
  const confidence = 0.75 + (factors.length * 0.03);
  
  let riskLevel: 'low' | 'medium' | 'high';
  let stage = 0;
  
  if (probability < 0.3) {
    riskLevel = 'low';
    stage = 0;
  } else if (probability < 0.6) {
    riskLevel = 'medium';
    stage = riskScore > 50 ? 2 : 1;
  } else {
    riskLevel = 'high';
    stage = riskScore > 80 ? 4 : 3;
  }

  const recommendations = generateRecommendations(riskLevel, factors);

  return {
    riskLevel,
    probability,
    confidence: Math.min(confidence, 0.95),
    stage,
    factors: factors.sort((a, b) => b.impact - a.impact).slice(0, 8),
    recommendations
  };
};

const generateRecommendations = (
  riskLevel: 'low' | 'medium' | 'high',
  factors: FeatureContribution[]
): string[] => {
  const recommendations: string[] = [];

  if (riskLevel === 'high') {
    recommendations.push('Consult a gynecologist or endometriosis specialist immediately');
    recommendations.push('Consider comprehensive diagnostic imaging (ultrasound/MRI)');
    recommendations.push('Discuss treatment options including hormonal therapy or surgery');
  } else if (riskLevel === 'medium') {
    recommendations.push('Schedule an appointment with your gynecologist');
    recommendations.push('Keep a symptom diary to track patterns');
    recommendations.push('Consider pelvic ultrasound for initial assessment');
  } else {
    recommendations.push('Continue monitoring symptoms and overall health');
    recommendations.push('Maintain regular gynecological check-ups');
  }

  // Specific recommendations based on factors
  const hasPain = factors.some(f => f.feature === 'Pain Symptoms');
  if (hasPain) {
    recommendations.push('Discuss pain management strategies with your doctor');
  }

  const hasCA125 = factors.some(f => f.feature === 'CA-125 Level');
  if (hasCA125) {
    recommendations.push('Request detailed blood work analysis');
  }

  const hasInfertility = factors.some(f => f.feature === 'Infertility');
  if (hasInfertility) {
    recommendations.push('Consider fertility consultation if planning pregnancy');
  }

  return recommendations;
};
