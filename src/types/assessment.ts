export interface AssessmentData {
  age: number;
  bmi: number;
  cycleLength: number;
  ageOfMenarche: number;
  dysmenorrheaScore: number;
  pelvicPainScore: number;
  dyspareuniaScore: number;
  dscheziaScore: number;
  urinarySymptomsScore: number;
  familyHistory: boolean;
  infertilityStatus: boolean;
  ca125Level: number;
  crpLevel: number;
  mentalHealthScore: number;
}

export interface PredictionResult {
  riskLevel: 'low' | 'medium' | 'high';
  probability: number;
  confidence: number;
  stage: number;
  factors: FeatureContribution[];
  recommendations: string[];
}

export interface FeatureContribution {
  feature: string;
  impact: number;
  value: string | number;
}

export interface UserSession {
  id: string;
  email?: string;
  assessments: AssessmentHistory[];
}

export interface AssessmentHistory {
  id: string;
  date: string;
  data: AssessmentData;
  result: PredictionResult;
}
