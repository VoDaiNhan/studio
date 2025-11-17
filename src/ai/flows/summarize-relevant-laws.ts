'use server';

/**
 * @fileOverview Summarizes relevant legal articles and clauses related to a user query.
 *
 * - summarizeRelevantLaws - A function that summarizes relevant legal information.
 * - SummarizeRelevantLawsInput - The input type for the summarizeRelevantLaws function.
 * - SummarizeRelevantLawsOutput - The return type for the summarizeRelevantLaws function.
 */

import { generateStructuredOutput } from '@/ai/openai';

export interface SummarizeRelevantLawsInput {
  query: string;
  relevantLaws: string;
}

export interface SummarizeRelevantLawsOutput {
  summary: string;
  sourceArticles: string;
}

const outputSchema = {
  type: 'object',
  properties: {
    summary: {
      type: 'string',
      description: 'A concise summary of the relevant legal information in Vietnamese'
    },
    sourceArticles: {
      type: 'string',
      description: 'The source articles and clauses used'
    }
  },
  required: ['summary', 'sourceArticles']
};

export async function summarizeRelevantLaws(input: SummarizeRelevantLawsInput): Promise<SummarizeRelevantLawsOutput> {
  const promptText = `Bạn là trợ lý AI chuyên về luật pháp Việt Nam. Trả lời ngắn gọn, chính xác.

Nếu không có luật liên quan: Nói rằng không tìm thấy thông tin và đề nghị người dùng hỏi cụ thể hơn.

Nếu có luật liên quan: Tóm tắt ngắn gọn (2-3 đoạn) và nêu nguồn.

Trả lời bằng tiếng Việt, văn bản thuần, không dùng Markdown.

Câu hỏi: ${input.query}
Luật: ${input.relevantLaws}
`;

  const systemInstruction = 'Bạn là trợ lý AI chuyên về luật pháp Việt Nam. Trả lời chính xác, ngắn gọn bằng tiếng Việt.';

  try {
    const result = await generateStructuredOutput<SummarizeRelevantLawsOutput>(
      promptText,
      outputSchema,
      systemInstruction
    );
    return result;
  } catch (error) {
    console.error('Error in summarizeRelevantLaws:', error);
    return {
      summary: 'Xin lỗi, đã có lỗi xảy ra khi xử lý yêu cầu của bạn. Vui lòng thử lại.',
      sourceArticles: ''
    };
  }
}
