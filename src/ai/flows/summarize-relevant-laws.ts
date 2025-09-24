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
  query: z.string().describe('The user query related to traffic laws.'),
  relevantLaws: z.string().describe('The relevant articles and clauses from the traffic law database.'),
});
export type SummarizeRelevantLawsInput = z.infer<typeof SummarizeRelevantLawsInputSchema>;

const SummarizeRelevantLawsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the relevant legal information.'),
  sourceArticles: z.string().describe('The source articles and clauses used to compose the summary.'),
});
export type SummarizeRelevantLawsOutput = z.infer<typeof SummarizeRelevantLawsOutputSchema>;

export async function summarizeRelevantLaws(input: SummarizeRelevantLawsInput): Promise<SummarizeRelevantLawsOutput> {
  return summarizeRelevantLawsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeRelevantLawsPrompt',
  input: {schema: SummarizeRelevantLawsInputSchema},
  output: {schema: SummarizeRelevantLawsOutputSchema},
  prompt: `You are a legal expert specializing in traffic laws. Your task is to summarize the following legal articles and clauses in a concise and easy-to-understand manner, and to identify the source articles and clauses used to compose the summary.\n\nUser Query: {{{query}}}\nRelevant Laws: {{{relevantLaws}}}\n\nSummary: \
Source Articles: `,
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
