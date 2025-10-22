'use server';

/**
 * @fileOverview Summarizes relevant legal articles and clauses related to a user query.
 *
 * - summarizeRelevantLaws - A function that summarizes relevant legal information.
 * - SummarizeRelevantLawsInput - The input type for the summarizeRelevantLaws function.
 * - SummarizeRelevantLawsOutput - The return type for the summarizeRelevantLaws function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeRelevantLawsInputSchema = z.object({
  query: z.string().describe('The user query related to traffic laws in Vietnamese.'),
  relevantLaws: z.string().describe('The relevant articles and clauses from the traffic law database in Vietnamese. This may be empty or contain base64 encoded content.'),
});
export type SummarizeRelevantLawsInput = z.infer<typeof SummarizeRelevantLawsInputSchema>;

const SummarizeRelevantLawsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the relevant legal information in Vietnamese. If no relevant laws are provided, state that you could not find an answer.'),
  sourceArticles: z.string().describe('The source articles and clauses used to compose the summary in Vietnamese. If no sources were used, this should be an empty string.'),
});
export type SummarizeRelevantLawsOutput = z.infer<typeof SummarizeRelevantLawsOutputSchema>;

export async function summarizeRelevantLaws(input: SummarizeRelevantLawsInput): Promise<SummarizeRelevantLawsOutput> {
  return summarizeRelevantLawsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeRelevantLawsPrompt',
  input: {schema: SummarizeRelevantLawsInputSchema},
  output: {schema: SummarizeRelevantLawsOutputSchema},
  prompt: `Bạn là một chuyên gia pháp lý chuyên về luật giao thông. Nhiệm vụ của bạn là tóm tắt các điều khoản và điều luật pháp lý sau đây một cách ngắn gọn, dễ hiểu và xác định các điều khoản, điều luật gốc được sử dụng để soạn tóm tắt. Nếu nội dung được cung cấp ở dạng base64, hãy xử lý nó dưới dạng tệp. Luôn trả lời bằng tiếng Việt.

Nếu không có luật liên quan nào được cung cấp (trường relevantLaws trống hoặc chỉ chứa thông báo không có nội dung), hãy trả lời rằng bạn không thể tìm thấy thông tin cho câu hỏi đó và đề nghị người dùng thử một câu hỏi khác chi tiết hơn.

Câu hỏi của người dùng: {{{query}}}
Luật liên quan: {{{relevantLaws}}}
`,
});

const summarizeRelevantLawsFlow = ai.defineFlow(
  {
    name: 'summarizeRelevantLawsFlow',
    inputSchema: SummarizeRelevantLawsInputSchema,
    outputSchema: SummarizeRelevantLawsOutputSchema,
  },
  async input => {
    // Handle the case where no relevant laws are found
    if (!input.relevantLaws || input.relevantLaws.trim() === '') {
        return {
            summary: "Xin lỗi, tôi không thể tìm thấy thông tin nào liên quan đến câu hỏi của bạn. Vui lòng thử một câu hỏi khác chi tiết hơn.",
            sourceArticles: ""
        };
    }

    const {output} = await prompt(input);
    return output!;
  }
);
