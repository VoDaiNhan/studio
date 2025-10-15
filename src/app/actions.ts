'use server';

import { z } from 'zod';
import { interpretTrafficQuery } from '@/ai/flows/interpret-traffic-query';
import { retrieveTrafficDocuments } from '@/ai/flows/retrieve-traffic-documents';
import { summarizeRelevantLaws } from '@/ai/flows/summarize-relevant-laws';
import { initializeFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface LawSummaryState {
  summary?: string;
  sourceArticles?: string;
  query?: string;
  error?: string;
}

const QuerySchema = z.object({
  query: z.string().min(1, 'Please enter a question.'),
});

export async function getLawSummary(
  prevState: LawSummaryState,
  formData: FormData
): Promise<LawSummaryState> {
  const validatedFields = QuerySchema.safeParse({
    query: formData.get('query'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.query?.[0],
    };
  }
  
  const query = validatedFields.data.query;

  try {
    const { interpretedQuery } = await interpretTrafficQuery({ query });
    const { documents } = await retrieveTrafficDocuments({ query: interpretedQuery });
    const { summary, sourceArticles } = await summarizeRelevantLaws({
      query,
      relevantLaws: documents.join('\n\n'),
    });

    // Save to Firestore
    try {
        const { firestore } = initializeFirebase();
        const conversationsCol = collection(firestore, 'conversations');
        await addDoc(conversationsCol, {
            userQuery: query,
            botSummary: summary,
            sourceArticles: sourceArticles,
            timestamp: serverTimestamp(),
            isVerified: false,
        });
    } catch (dbError) {
        console.error("Firestore save error:", dbError);
        // We can decide if we want to bubble this error up to the UI
        // For now, we'll just log it and the user will still see the answer
    }


    return { summary, sourceArticles, query };
  } catch (e) {
    console.error(e);
    return {
      error: 'An error occurred while processing your request. Please try again.',
      query,
    };
  }
}
