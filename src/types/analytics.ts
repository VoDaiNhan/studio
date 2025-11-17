/**
 * Analytics Types
 * Type definitions for analytics data structures
 */

export interface AnalyticsData {
  totalQueries: number;
  totalUsers: number;
  avgResponseTime: number;
  topTopics: TopicData[];
  queriesOverTime: TimeSeriesData[];
  userActivity: UserActivityData[];
}

export interface TopicData {
  topic: string;
  count: number;
}

export interface TimeSeriesData {
  date: string;
  count: number;
}

export interface UserActivityData {
  name: string;
  queries: number;
}

export interface AdminAnalytics extends AnalyticsData {
  successRate: number;
  queriesOverTime: ExtendedTimeSeriesData[];
  userEngagement: EngagementData[];
  responseQuality: QualityData[];
  peakHours: PeakHourData[];
  topQuestions: QuestionData[];
}

export interface ExtendedTimeSeriesData extends TimeSeriesData {
  verified: number;
}

export interface EngagementData {
  date: string;
  activeUsers: number;
}

export interface QualityData {
  category: string;
  count: number;
}

export interface PeakHourData {
  hour: string;
  queries: number;
}

export interface QuestionData {
  question: string;
  count: number;
  avgRating: number;
}

export interface RealtimeMetric {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ComparisonData {
  metric: string;
  current: number;
  previous: number;
  unit: string;
}

export interface ExportOptions {
  format: 'csv' | 'json' | 'pdf';
  dateRange?: {
    start: Date;
    end: Date;
  };
  includeCharts?: boolean;
}

export interface AnalyticsFilter {
  timeRange: '7d' | '30d' | '90d' | 'custom';
  topics?: string[];
  users?: string[];
  startDate?: Date;
  endDate?: Date;
}

export interface InsightData {
  type: 'trend' | 'strength' | 'warning' | 'recommendation';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
}

export interface PerformanceMetrics {
  accuracy: number;
  responseTime: number;
  completionRate: number;
  satisfactionScore: number;
}

export interface ConversationData {
  id: string;
  userQuery: string;
  botSummary?: string;
  sourceArticles?: string;
  timestamp: Date;
  isVerified: boolean;
  rating?: number;
}

export type ChartType = 'line' | 'bar' | 'pie' | 'area';

export interface ChartConfig {
  type: ChartType;
  data: any[];
  xKey: string;
  yKey: string;
  colors?: string[];
  showLegend?: boolean;
  showGrid?: boolean;
}
