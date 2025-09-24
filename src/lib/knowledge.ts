export interface KnowledgeSource {
  id: string;
  type: 'url' | 'manual';
  title: string;
  url?: string;
  content?: string;
  createdAt: string; // ISO date string
  status: 'active' | 'learning' | 'error';
}
