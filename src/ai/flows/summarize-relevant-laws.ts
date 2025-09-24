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
  relevantLaws: z.string().describe('The relevant articles and clauses from the traffic law database in Vietnamese.'),
});
export type SummarizeRelevantLawsInput = z.infer<typeof SummarizeRelevantLawsInputSchema>;

const SummarizeRelevantLawsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the relevant legal information in Vietnamese.'),
  sourceArticles: z.string().describe('The source articles and clauses used to compose the summary in Vietnamese.'),
});
export type SummarizeRelevantLawsOutput = z.infer<typeof SummarizeRelevantLawsOutputSchema>;

export async function summarizeRelevantLaws(input: SummarizeRelevantLawsInput): Promise<SummarizeRelevantLawsOutput> {
  return summarizeRelevantLawsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeRelevantLawsPrompt',
  input: {schema: SummarizeRelevantLawsInputSchema},
  output: {schema: SummarizeRelevantLawsOutputSchema},
  prompt: `Bạn là một chuyên gia pháp lý chuyên về luật giao thông. Nhiệm vụ của bạn là tóm tắt các điều khoản và điều luật pháp lý sau đây một cách ngắn gọn, dễ hiểu và xác định các điều khoản, điều luật gốc được sử dụng để soạn tóm tắt. Luôn trả lời bằng tiếng Việt.\n\nCâu hỏi của người dùng: {{{query}}}\nLuật liên quan: {{{relevantLaws}}}\n\nTóm tắt: \
Nguồn bài viết: `,
});

const summarizeRelevantLawsFlow = ai.defineFlow(
  {
    name: 'summarizeRelevantLawsFlow',
    inputSchema: SummarizeRelevantLawsInputSchema,
    outputSchema: SummarizeRelevantLawsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
