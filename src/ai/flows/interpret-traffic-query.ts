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
  query: z.string().describe('The user query related to traffic laws.'),
});
export type InterpretTrafficQueryInput = z.infer<typeof InterpretTrafficQueryInputSchema>;

const InterpretTrafficQueryOutputSchema = z.object({
  interpretedQuery: z.string().describe('The interpreted user query.'),
});
export type InterpretTrafficQueryOutput = z.infer<typeof InterpretTrafficQueryOutputSchema>;

export async function interpretTrafficQuery(input: InterpretTrafficQueryInput): Promise<InterpretTrafficQueryOutput> {
  return interpretTrafficQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interpretTrafficQueryPrompt',
  input: {schema: InterpretTrafficQueryInputSchema},
  output: {schema: InterpretTrafficQueryOutputSchema},
  prompt: `You are a helpful assistant that interprets user queries related to traffic laws.

  The user will provide a query, and you should interpret the query to extract the intent of the user.

  User Query: {{{query}}}`,
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
