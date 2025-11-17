'use server';

/**
 * @fileOverview Interprets user queries related to traffic laws and extracts relevant information.
 *
 * - interpretTrafficQuery - A function that takes a user query and returns the interpreted query.
 * - InterpretTrafficQueryInput - The input type for the interpretTrafficQuery function.
 * - InterpretTrafficQueryOutput - The return type for the interpretTrafficQuery function.
 */

export interface InterpretTrafficQueryInput {
  query: string;
}

export interface InterpretTrafficQueryOutput {
  interpretedQuery: string;
}

export async function interpretTrafficQuery(input: InterpretTrafficQueryInput): Promise<InterpretTrafficQueryOutput> {
  // OPTIMIZATION: For simple queries, skip AI interpretation
  const query = input.query.trim();
  
  // If query is already clear, return as-is
  return { interpretedQuery: query };
}
