'use server';
/**
 * @fileOverview A Genkit flow for analyzing municipal tax details and providing insights.
 *
 * - municipalTaxAdvisor - A function that analyzes municipal tax details.
 * - MunicipalTaxAdvisorInput - The input type for the municipalTaxAdvisor function.
 * - MunicipalTaxAdvisorOutput - The return type for the municipalTaxAdvisor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MunicipalTaxAdvisorInputSchema = z.object({
  grossIncome: z.number().describe('The user\u0027s gross income.'),
  taxRate: z.number().describe('The applicable municipal tax rate as a percentage (e.g., 2.5 for 2.5%).'),
  minimumTaxable: z.number().describe('The minimum taxable amount for municipal tax calculations.'),
});
export type MunicipalTaxAdvisorInput = z.infer<typeof MunicipalTaxAdvisorInputSchema>;

const MunicipalTaxAdvisorOutputSchema = z.object({
  analysis: z.string().describe('A comprehensive analysis of the provided municipal tax details, including the calculated tax and its comparison to the minimum taxable amount.'),
  optimizationTips: z.array(z.string()).describe('Actionable tips for potential municipal tax optimization.'),
  flags: z.array(z.string()).describe('Flags for any unusual, potentially problematic, or noteworthy values in the tax details.'),
});
export type MunicipalTaxAdvisorOutput = z.infer<typeof MunicipalTaxAdvisorOutputSchema>;

export async function municipalTaxAdvisor(input: MunicipalTaxAdvisorInput): Promise<MunicipalTaxAdvisorOutput> {
  return municipalTaxAdvisorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'municipalTaxAdvisorPrompt',
  input: { schema: MunicipalTaxAdvisorInputSchema },
  output: { schema: MunicipalTaxAdvisorOutputSchema },
  prompt: `You are an AI-powered municipal tax advisor. Your goal is to analyze a user's municipal tax details and provide actionable insights, optimization tips, and flag any unusual values.

Here are the user's details:
Gross Income: {{{grossIncome}}}
Tax Rate: {{{taxRate}}}%
Minimum Taxable Amount: {{{minimumTaxable}}}

Based on these inputs, perform the following:
1.  **Analysis**: Calculate the potential tax amount (Gross Income * Tax Rate / 100). Compare this calculated amount with the Minimum Taxable Amount. Explain which one applies and why.
2.  **Optimization Tips**: Provide 1-3 actionable tips or strategies the user could consider to potentially optimize their municipal tax burden or ensure compliance. These should be general advice and not financial or legal counsel.
3.  **Flags**: Identify any input values that seem unusual (e.g., extremely high or low rates/incomes compared to common ranges, or if the calculated tax is significantly different from the minimum taxable amount in a way that might be a red flag). List these as bullet points. If no flags are present, state that there are no flags.`,
});

const municipalTaxAdvisorFlow = ai.defineFlow(
  {
    name: 'municipalTaxAdvisorFlow',
    inputSchema: MunicipalTaxAdvisorInputSchema,
    outputSchema: MunicipalTaxAdvisorOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  },
);
