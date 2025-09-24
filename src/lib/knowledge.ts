export interface KnowledgeSource {
  id: string;
  type: 'url' | 'manual';
  title: string;
  url?: string;
  content?: string;
  effectiveDate: string; // ISO date string
  status: 'active' | 'learning' | 'error';
}
