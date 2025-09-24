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
    // 1. Chunk the content of the documents (from URLs or text).
    // 2. Embed the user's query and the document chunks.
    // 3. Perform a vector similarity search to find the most relevant chunks.
    // 4. Return the content of those relevant chunks.
    
    // For now, we'll just return the titles and URLs of all active sources as context.
    // This will at least give the summarization AI some context to work with.
    const documents = activeSources.map(source => {
        let content = `Document Title: ${source.title}\n`;
        if (source.url) {
            content += `Source URL: ${source.url}\n`;
        }
        if (source.content) {
            // Returning the full content can be too large. We'll truncate for this example.
            content += `Content: ${source.content.substring(0, 500)}...`;
        }
        return content;
    });

    if (documents.length === 0) {
        return { documents: ["There are no active knowledge sources available to answer the query."] };
    }

    return { documents };
  }
);
