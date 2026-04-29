export interface SustainabilityMetric {
  name: string;
  score: number; // 0 to 100
  description: string;
}

export interface ImprovementSuggestion {
  category: string;
  gap: string;
  suggestion: string;
  priority: 'High' | 'Medium' | 'Low';
  notes?: string; // Additional implementation notes
}

export interface SDGTarget {
  id: string; // e.g. "4.1"
  description: string;
  indicators: SDGIndicator[];
}

export interface SDGIndicator {
  id: string; // e.g. "4.1.1"
  description: string;
  assessment: {
    measuresDirectly: boolean;
    suggestsSolutions: boolean;
    collectsData: boolean;
    contributionScore: number; // 1 to 5
    notes?: string; // Reasoning for indicator assessment
  };
}

export interface SDGAlignment {
  id: number; // 1-17
  label: string; // English name
  name: string; // Arabic name
  percentage: number; // 0-100
  strength: 'High' | 'Medium' | 'Low';
  justification: string;
  targets: SDGTarget[];
}

export interface PillarScore {
  name: string;
  score: number; // 1 to 5
  comment: string;
  notes?: string; // Detailed pillar observations
}

export interface AssessmentMetric {
  name: string;
  score: number;
  benchmark: number;
  description: string;
  notes?: string; // Observation notes
}

export interface SmartRecommendations {
  otherTargets: string[];
  futureIndicators: string[];
  complementarySpecializations: string[];
}

export interface AnalysisResult {
  specialization: string;
  sustainabilityField: string;
  overallScore: number;
  metrics: SustainabilityMetric[];
  sdgs: SDGAlignment[];
  pillars: PillarScore[];
  benchmarks: AssessmentMetric[];
  strengths: string[];
  opportunities: string[];
  suggestions: ImprovementSuggestion[];
  recommendations: SmartRecommendations;
  processLog?: string[]; // Log of analysis actions
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export enum UserTier {
  GUEST = 'GUEST',
  FREE = 'FREE',
  PREMIUM = 'PREMIUM'
}

export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN'
}

export enum AppView {
  MAIN = 'MAIN',
  HISTORY = 'HISTORY',
  STUDENT_INFO = 'STUDENT_INFO',
  THESIS = 'THESIS',
  PORTAL = 'PORTAL',
  ADMIN = 'ADMIN'
}
