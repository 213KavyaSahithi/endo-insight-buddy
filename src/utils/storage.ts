import { UserSession, AssessmentHistory } from '@/types/assessment';

const SESSION_KEY = 'endo_user_session';
const HISTORY_KEY = 'endo_assessment_history';

export const getUserSession = (): UserSession | null => {
  const data = localStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : null;
};

export const saveUserSession = (session: UserSession): void => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const clearUserSession = (): void => {
  localStorage.removeItem(SESSION_KEY);
};

export const getAssessmentHistory = (): AssessmentHistory[] => {
  const data = localStorage.getItem(HISTORY_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveAssessment = (assessment: AssessmentHistory): void => {
  const history = getAssessmentHistory();
  history.unshift(assessment);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 20))); // Keep last 20
};

export const clearHistory = (): void => {
  localStorage.removeItem(HISTORY_KEY);
};
