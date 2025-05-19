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
      prompt: `Dato il seguente prompt generico: "{{lazyPrompt}}", trasformalo in un prompt dettagliato e strutturato con le seguenti sezioni (TUTTO L'OUTPUT DEVE ESSERE IN ITALIANO):\n\nSituazione: Fornisci il contesto o le informazioni di base.\nCompito: Definisci l'azione specifica da intraprendere.\nObiettivo: Indica il risultato o l'obiettivo desiderato.\nConoscenza: Offri un elenco di suggerimenti e consigli pertinenti.\nConclusione: Includi un'osservazione conclusiva o un invito all'azione.\n\nAssicurati che il prompt migliorato sia chiaro, conciso e attuabile, e che TUTTE le sezioni e il loro contenuto siano in italiano.`,
      input: {schema: ImprovePromptInputSchema},
      output: {schema: ImprovePromptOutputSchema},
    });

    const {output} = await prompt(input);
    return output!;
  }
);
