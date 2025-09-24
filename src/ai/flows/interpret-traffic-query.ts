'use server';

/**
 * @fileOverview Interprets user queries related to traffic laws and extracts relevant information.
 *
 * - interpretTrafficQuery - A function that takes a user query and returns the interpreted query.
 * - InterpretTrafficQueryInput - The input type for the interpretTrafficQuery function.
 * - InterpretTrafficQueryOutput - The return type for the interpretTrafficQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterpretTrafficQueryInputSchema = z.object({
  query: z.string().describe('The user query related to traffic laws in Vietnamese.'),
});
export type InterpretTrafficQueryInput = z.infer<typeof InterpretTrafficQueryInputSchema>;

const InterpretTrafficQueryOutputSchema = z.object({
  interpretedQuery: z.string().describe('The interpreted user query in Vietnamese.'),
});
export type InterpretTrafficQueryOutput = z.infer<typeof InterpretTrafficQueryOutputSchema>;

export async function interpretTrafficQuery(input: InterpretTrafficQueryInput): Promise<InterpretTrafficQueryOutput> {
  return interpretTrafficQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interpretTrafficQueryPrompt',
  input: {schema: InterpretTrafficQueryInputSchema},
  output: {schema: InterpretTrafficQueryOutputSchema},
  prompt: `Bạn là một trợ lý hữu ích chuyên diễn giải các câu hỏi của người dùng liên quan đến luật giao thông bằng tiếng Việt.

  Người dùng sẽ cung cấp một câu hỏi, và bạn nên diễn giải câu hỏi đó để trích xuất ý định của người dùng. Trả lời bằng tiếng Việt.

  Câu hỏi của người dùng: {{{query}}}`,
});

const interpretTrafficQueryFlow = ai.defineFlow(
  {
    name: 'interpretTrafficQueryFlow',
    inputSchema: InterpretTrafficQueryInputSchema,
    outputSchema: InterpretTrafficQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
