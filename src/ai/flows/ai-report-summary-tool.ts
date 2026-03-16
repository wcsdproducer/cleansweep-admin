'use server';
/**
 * @fileOverview A Genkit flow for generating concise natural language summaries of project activities or user behavior data.
 *
 * - summarizeReport - A function that generates a summary of the provided data.
 * - ReportSummaryInput - The input type for the summarizeReport function.
 * - ReportSummaryOutput - The return type for the summarizeReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReportSummaryInputSchema = z.object({
  reportData: z
    .string()
    .describe(
      'JSON string containing selected project activities or user behavior data points.'
    ),
});
export type ReportSummaryInput = z.infer<typeof ReportSummaryInputSchema>;

const ReportSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise natural language summary of the provided data, highlighting key trends and insights.'
    ),
});
export type ReportSummaryOutput = z.infer<typeof ReportSummaryOutputSchema>;

export async function summarizeReport(
  input: ReportSummaryInput
): Promise<ReportSummaryOutput> {
  return aiReportSummaryToolFlow(input);
}

const summarizeReportPrompt = ai.definePrompt({
  name: 'summarizeReportPrompt',
  input: {schema: ReportSummaryInputSchema},
  output: {schema: ReportSummaryOutputSchema},
  prompt: `You are an AI assistant tasked with generating concise, natural language summaries of administrative data.
Your goal is to identify key trends, important activities, or significant user behaviors from the provided JSON data and present them in an easy-to-understand summary.

Focus on:
- Overall activity levels.
- Most active projects or users.
- Any notable changes or patterns.
- Potential anomalies or areas requiring attention.

The summary should be clear, brief, and insightful.
Please respond with a JSON object containing a single key "summary" whose value is the generated natural language summary.

Here is the data in JSON format:
{{{reportData}}}`,
});

const aiReportSummaryToolFlow = ai.defineFlow(
  {
    name: 'aiReportSummaryToolFlow',
    inputSchema: ReportSummaryInputSchema,
    outputSchema: ReportSummaryOutputSchema,
  },
  async input => {
    const {output} = await summarizeReportPrompt(input);
    return output!;
  }
);
