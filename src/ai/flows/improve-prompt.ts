// src/ai/flows/improve-prompt.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for improving a user-provided prompt using an AI model.
 *
 * - improvePrompt - The main function to improve a prompt.
 * - ImprovePromptInput - The input type for the improvePrompt function, representing the lazy prompt.
 * - ImprovePromptOutput - The output type for the improvePrompt function, representing the improved prompt.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImprovePromptInputSchema = z.object({
  lazyPrompt: z.string().describe('The initial, under-elaborated prompt provided by the user.'),
});
export type ImprovePromptInput = z.infer<typeof ImprovePromptInputSchema>;

const ImprovePromptOutputSchema = z.object({
  situation: z.string().describe('The context or background for the prompt.'),
  task: z.string().describe('The specific action to be taken.'),
  objective: z.string().describe('The desired outcome or goal.'),
  knowledge: z.array(z.string()).describe('A list of tips and advice.'),
  conclusion: z.string().describe('A concluding remark or call to action.'),
});
export type ImprovePromptOutput = z.infer<typeof ImprovePromptOutputSchema>;

export async function improvePrompt(input: ImprovePromptInput): Promise<ImprovePromptOutput> {
  return improvePromptFlow(input);
}

const improvePromptFlow = ai.defineFlow(
  {
    name: 'improvePromptFlow',
    inputSchema: ImprovePromptInputSchema,
    outputSchema: ImprovePromptOutputSchema,
  },
  async input => {
    const prompt = ai.definePrompt({
      name: 'improvePromptPrompt',
      prompt: `Given the following lazy prompt: "{{lazyPrompt}}", transform it into a detailed and structured prompt with the following sections:\n\nSituation: Provide context or background information.\nTask: Define the specific action to be taken.\nObjective: State the desired outcome or goal.\nKnowledge: Offer a list of relevant tips and advice.\nConclusion: Include a concluding remark or call to action.\n\nEnsure the improved prompt is clear, concise, and actionable.`,
      input: {schema: ImprovePromptInputSchema},
      output: {schema: ImprovePromptOutputSchema},
    });

    const {output} = await prompt(input);
    return output!;
  }
);
