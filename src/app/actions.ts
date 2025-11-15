'use server';

import { z } from 'zod';
import { interpretTrafficQuery } from '@/ai/flows/interpret-traffic-query';
import { retrieveTrafficDocuments } from '@/ai/flows/retrieve-traffic-documents';
import { summarizeRelevantLaws } from '@/ai/flows/summarize-relevant-laws';


export interface LawSummaryState {
  summary?: string;
  sourceArticles?: string;
  query?: string;
  error?: string;
  userId?: string;
}

const QuerySchema = z.object({
  query: z.string().min(1, 'Please enter a question.'),
  userId: z.string(), // userId is now required
});

export async function getLawSummary(
  prevState: LawSummaryState,
  formData: FormData
): Promise<LawSummaryState> {
  const validatedFields = QuerySchema.safeParse({
    query: formData.get('query'),
    userId: formData.get('userId'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.query?.[0] || validatedFields.error.flatten().fieldErrors.userId?.[0],
    };
  }
  
  const { query, userId } = validatedFields.data;

  try {
    const { interpretedQuery } = await interpretTrafficQuery({ query });
    const { documents } = await retrieveTrafficDocuments({ query: interpretedQuery });
    const { summary, sourceArticles } = await summarizeRelevantLaws({
      query,
      relevantLaws: documents.join('\n\n'),
    });

    return { summary, sourceArticles, query, userId };
  } catch (e) {
    console.error(e);
    return {
      error: 'An error occurred while processing your request. Please try again.',
      query,
      userId,
    };
  }
}
