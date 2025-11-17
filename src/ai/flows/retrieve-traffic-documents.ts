'use server';

/**
 * @fileOverview A flow to retrieve relevant traffic law documents based on a user query.
 *
 * - retrieveTrafficDocuments - A function that retrieves relevant traffic law documents.
 * - RetrieveTrafficDocumentsInput - The input type for the retrieveTrafficDocuments function.
 * - RetrieveTrafficDocumentsOutput - The return type for the retrieveTrafficDocuments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getKnowledgeSources } from '@/app/actions/knowledge';

const RetrieveTrafficDocumentsInputSchema = z.object({
  query: z.string().describe('The user query about traffic laws.'),
});
export type RetrieveTrafficDocumentsInput = z.infer<
  typeof RetrieveTrafficDocumentsInputSchema
>;

const RetrieveTrafficDocumentsOutputSchema = z.object({
  documents: z
    .array(z.string())
    .describe(
      'A list of relevant traffic law documents as strings of text.'
    ),
});
export type RetrieveTrafficDocumentsOutput = z.infer<
  typeof RetrieveTrafficDocumentsOutputSchema
>;

export async function retrieveTrafficDocuments(
  input: RetrieveTrafficDocumentsInput
): Promise<RetrieveTrafficDocumentsOutput> {
  return retrieveTrafficDocumentsFlow(input);
}

// OPTIMIZATION: Cache knowledge sources to avoid repeated file reads
let cachedSources: { data: any[], timestamp: number } | null = null;
const CACHE_TTL = 60000; // 1 minute cache

const retrieveTrafficDocumentsFlow = ai.defineFlow(
  {
    name: 'retrieveTrafficDocumentsFlow',
    inputSchema: RetrieveTrafficDocumentsInputSchema,
    outputSchema: RetrieveTrafficDocumentsOutputSchema,
  },
  async (input) => {
    // OPTIMIZATION 1: Use cached sources if available
    const now = Date.now();
    let sources;
    
    if (cachedSources && (now - cachedSources.timestamp) < CACHE_TTL) {
      sources = cachedSources.data;
    } else {
      sources = await getKnowledgeSources();
      cachedSources = { data: sources, timestamp: now };
    }
    
    const activeSources = sources.filter(s => s.status === 'active');
    
    // OPTIMIZATION 2: Enhanced keyword extraction with Vietnamese stopwords
    const stopwords = ['là', 'của', 'và', 'có', 'được', 'trong', 'cho', 'về', 'với', 'khi', 'để'];
    const queryWords = input.query
      .toLowerCase()
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopwords.includes(w));
    
    if (queryWords.length === 0) {
        return { documents: [] };
    }

    // OPTIMIZATION 3: Score-based ranking for better relevance
    const scoredDocs = activeSources
      .map(source => {
        const title = source.title?.toLowerCase() || '';
        const content = source.content?.toLowerCase() || '';
        
        let score = 0;
        queryWords.forEach(word => {
          // Title matches are more important
          if (title.includes(word)) score += 3;
          // Content matches
          if (content.includes(word)) score += 1;
        });
        
        return { source, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // OPTIMIZATION 4: Limit to top 5 documents

    const documents = scoredDocs.map(({ source }) => {
      let docString = `Tiêu đề: ${source.title}\n`;
      if (source.url) {
        docString += `Nguồn: ${source.url}\n`;
      }
      if (source.content) {
        // OPTIMIZATION 5: Truncate very long content
        const maxLength = 2000;
        const content = source.content.length > maxLength 
          ? source.content.substring(0, maxLength) + '...'
          : source.content;
        docString += `Nội dung: ${content}`;
      }
      return docString;
    });
    
    return { documents };
  }
);
