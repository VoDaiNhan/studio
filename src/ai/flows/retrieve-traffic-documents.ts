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

const retrieveTrafficDocumentsFlow = ai.defineFlow(
  {
    name: 'retrieveTrafficDocumentsFlow',
    inputSchema: RetrieveTrafficDocumentsInputSchema,
    outputSchema: RetrieveTrafficDocumentsOutputSchema,
  },
  async (input) => {
    const sources = await getKnowledgeSources();
    const activeSources = sources.filter(s => s.status === 'active');
    
    // This is a simplified RAG implementation.
    // In a real-world scenario, you would:
    // 1. Embed the user's query and the document chunks.
    // 2. Perform a vector similarity search to find the most relevant chunks.
    // 3. Return the content of those relevant chunks.

    // Simple keyword matching in the title for now. Filter out short/common words.
    const queryWords = input.query.toLowerCase().split(/\s+/).filter(w => w.length > 1);
    
    // If there are no meaningful words to search for, return no documents.
    if (queryWords.length === 0) {
        return { documents: [] };
    }

    const documents = activeSources
    .filter(source => {
        const title = source.title?.toLowerCase() || '';
        // Check if any of the query words appear in the title
        return queryWords.some(word => title.includes(word));
    })
    .map(source => {
        let docString = `Document Title: ${source.title}\n`;
        if (source.url) {
            docString += `Source URL: ${source.url}\n`;
        }
        if (source.content) {
            docString += `Content: ${source.content}`;
        }
        return docString;
    });
    
    // If no relevant documents are found, return an empty array.
    if (documents.length === 0) {
        return { documents: [] };
    }

    return { documents };
  }
);
