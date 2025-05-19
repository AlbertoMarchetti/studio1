// src/components/prompt-craft-client.tsx
"use client";

import type { ImprovePromptOutput } from "@/ai/flows/improve-prompt";
import { improvePrompt } from "@/ai/flows/improve-prompt";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Copy, Loader2, Pencil } from "lucide-react";
import React, { useState, useTransition } from "react";

const initialGreatPromptExample: ImprovePromptOutput = {
  situation: "You are a marketing manager for a sustainable fashion brand.",
  task: "Develop a content strategy for an upcoming Earth Day campaign. The goal is to highlight the brand's commitment to eco-friendly practices and drive sales of a new recycled materials collection.",
  objective: "Increase brand engagement by 20%, drive a 15% uplift in sales for the new collection, and reinforce the brand's image as a leader in sustainable fashion.",
  knowledge: [
    "Incorporate user-generated content by running a contest.",
    "Partner with environmental influencers for wider reach.",
    "Use compelling visuals that tell a story about sustainability.",
    "Clearly communicate the impact of purchasing from the recycled collection.",
    "Offer an early-bird discount or a special bundle for Earth Day."
  ],
  conclusion: "Craft compelling narratives that not only sell products but also educate and inspire your audience to make more conscious choices. The planet (and your brand) will thank you."
};


export default function PromptCraftClient() {
  const [lazyPrompt, setLazyPrompt] = useState("genera 10 post per LinkedIn");
  const [greatPrompt, setGreatPrompt] = useState<ImprovePromptOutput | null>(initialGreatPromptExample);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleImprovePrompt = () => {
    startTransition(async () => {
      try {
        const result = await improvePrompt({ lazyPrompt });
        setGreatPrompt(result);
        toast({
          title: "Prompt Improved!",
          description: "Your super prompt has been generated.",
        });
      } catch (error) {
        console.error("Error improving prompt:", error);
        setGreatPrompt(null); // Clear or keep old prompt? Cleared for now.
        toast({
          title: "Error",
          description: "Could not generate prompt. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: "Copied to clipboard!",
          description: `${type} has been copied.`,
        });
      })
      .catch(err => {
        console.error("Failed to copy:", err);
        toast({
          title: "Error",
          description: `Could not copy ${type}.`,
          variant: "destructive",
        });
      });
  };

  const formatGreatPromptForCopy = (prompt: ImprovePromptOutput | null): string => {
    if (!prompt) return "";
    return `Situation:
${prompt.situation}

Task:
${prompt.task}

Objective:
${prompt.objective}

Knowledge:
${prompt.knowledge.map(item => `- ${item}`).join("\n")}

Conclusion:
${prompt.conclusion}`;
  };

  return (
    <div className="w-full max-w-3xl space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-primary" />
              <CardTitle>Inserisci il prompt da migliorare</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(lazyPrompt, "Lazy prompt")}>
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy Lazy Prompt</span>
            </Button>
          </div>
          <CardDescription>
            Scrivi qui il tuo prompt generico. Lo trasformeremo in un super prompt!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={lazyPrompt}
            onChange={(e) => setLazyPrompt(e.target.value)}
            placeholder="Es: genera 10 post per LinkedIn"
            rows={4}
            className="resize-none"
          />
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button 
          onClick={handleImprovePrompt} 
          disabled={isPending || !lazyPrompt.trim()}
          size="lg"
          className="px-8 py-6 text-lg font-semibold"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Migliorando...
            </>
          ) : (
            "Improve Prompt"
          )}
        </Button>
      </div>

      {(isPending || greatPrompt) && (
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                 {/* <Pencil className="h-5 w-5 text-primary" /> Placeholder if Edit on Great Prompt is needed */}
                <CardTitle>Super Prompt</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                {/* <Button variant="ghost" size="icon" onClick={() => { console.log("Edit Great Prompt (not implemented)")}}>
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit Great Prompt</span>
                </Button> */}
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(formatGreatPromptForCopy(greatPrompt), "Super prompt")}>
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy Super Prompt</span>
                </Button>
              </div>
            </div>
            <CardDescription>
              Ecco il tuo prompt dettagliato e ottimizzato per risultati eccellenti.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isPending && !greatPrompt ? (
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-1/4 animate-pulse"></div>
                <div className="h-8 bg-muted rounded w-full animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-1/4 animate-pulse mt-2"></div>
                <div className="h-8 bg-muted rounded w-full animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-1/4 animate-pulse mt-2"></div>
                <div className="h-12 bg-muted rounded w-full animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-1/4 animate-pulse mt-2"></div>
                <div className="h-8 bg-muted rounded w-full animate-pulse"></div>
              </div>
            ) : greatPrompt && (
              <div className="space-y-4 text-sm">
                <div>
                  <h3 className="font-semibold text-base text-primary mb-1">Situation:</h3>
                  <p className="text-foreground/90 whitespace-pre-wrap">{greatPrompt.situation}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-base text-primary mb-1">Task:</h3>
                  <p className="text-foreground/90 whitespace-pre-wrap">{greatPrompt.task}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-base text-primary mb-1">Objective:</h3>
                  <p className="text-foreground/90 whitespace-pre-wrap">{greatPrompt.objective}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-base text-primary mb-1">Knowledge:</h3>
                  <ul className="list-disc list-inside space-y-1 text-foreground/90 pl-2">
                    {greatPrompt.knowledge.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-base text-primary mb-1">Conclusion:</h3>
                  <p className="text-foreground/90 whitespace-pre-wrap">{greatPrompt.conclusion}</p>
                </div>
              </div>
            )}
          </CardContent>
           {greatPrompt && !isPending && (
            <CardFooter className="flex justify-end">
               <Button variant="outline" size="sm" onClick={() => copyToClipboard(formatGreatPromptForCopy(greatPrompt), "Super prompt")}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Super Prompt
                </Button>
            </CardFooter>
           )}
        </Card>
      )}
    </div>
  );
}
