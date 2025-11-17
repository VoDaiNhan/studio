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
    // OPTIMIZATION 1: Run interpret and retrieve in parallel
    const [{ interpretedQuery }, { documents }] = await Promise.all([
      interpretTrafficQuery({ query }),
      retrieveTrafficDocuments({ query }) // Use original query directly for faster retrieval
    ]);

    // OPTIMIZATION 2: Early return if no documents found
    if (documents.length === 0) {
      return {
        summary: 'Xin lỗi, tôi không tìm thấy thông tin liên quan đến câu hỏi của bạn. Vui lòng thử đặt câu hỏi cụ thể hơn hoặc sử dụng từ khóa khác.',
        sourceArticles: '',
        query,
        userId
      };
    }

    // OPTIMIZATION 3: Limit documents to top 3 most relevant for faster processing
    const topDocuments = documents.slice(0, 3);

    const { summary, sourceArticles } = await summarizeRelevantLaws({
      query,
      relevantLaws: topDocuments.join('\n\n'),
    });

    return { summary, sourceArticles, query, userId };
  } catch (e) {
    console.error(e);
    return {
      error: 'Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng thử lại.',
      query,
      userId,
    };
  }
}
