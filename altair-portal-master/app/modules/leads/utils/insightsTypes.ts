/**
 * @file /app/modules/leads/utils/insightsTypes.ts
 * @purpose Type definitions for the leads insights algorithm.
 */

export interface DynamicInsights {
  totalCount: number;
  totalPipelineValue: number;
  averageLeadValue: number;
  topLeadSource: string;
  stageStats: {
    feedbackReq: { count: number; percentage: number };
    inProgress: { count: number; percentage: number };
    contacted: { count: number; percentage: number };
    noAnswer: { count: number; percentage: number };
    newCold: { count: number; percentage: number };
  };
  highValueAlert: {
    name: string;
    value: number;
    stage: string;
    desc: string;
  } | null;
  conversionAlert: {
    name: string;
    percentage: number;
    desc: string;
  } | null;
  docAlert: {
    name: string;
    desc: string;
    actionTag: string;
  } | null;
}
