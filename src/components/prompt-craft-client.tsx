// src/components/prompt-craft-client.tsx
"use client";

import type { ImprovePromptOutput } from "@/ai/flows/improve-prompt";
import { improvePrompt } from "@/ai/flows/improve-prompt";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Copy, Loader2, Pencil, RefreshCcw } from "lucide-react";
import React, { useState, useTransition } from "react";

export default function PromptCraftClient() {
  const [lazyPrompt, setLazyPrompt] = useState("");
  const [greatPrompt, setGreatPrompt] = useState<ImprovePromptOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleImprovePrompt = () => {
    startTransition(async () => {
      try {
        const result = await improvePrompt({ lazyPrompt });
        setGreatPrompt(result);
        toast({
          title: "Prompt Migliorato!",
          description: "Il tuo super prompt è stato generato.",
        });
      } catch (error) {
        console.error("Error improving prompt:", error);
        setGreatPrompt(null); 
        toast({
          title: "Errore",
          description: "Impossibile generare il prompt. Riprova.",
          variant: "destructive",
        });
      }
    });
  };

  const handleNewPrompt = () => {
    setLazyPrompt("");
    setGreatPrompt(null);
  };

  const copyToClipboard = (text: string, promptName: "Prompt generico" | "Super prompt") => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: "Copiato negli appunti!",
          description: `Il ${promptName} è stato copiato.`,
        });
      })
      .catch(err => {
        console.error("Failed to copy:", err);
        toast({
          title: "Errore",
          description: `Impossibile copiare il ${promptName}.`,
          variant: "destructive",
        });
      });
  };

  const formatGreatPromptForCopy = (prompt: ImprovePromptOutput | null): string => {
    if (!prompt) return "";
    return `Situazione:
${prompt.situation}

Compito:
${prompt.task}

Obiettivo:
${prompt.objective}

Conoscenza:
${prompt.knowledge.map(item => `- ${item}`).join("\n")}

Conclusione:
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
            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(lazyPrompt, "Prompt generico")} disabled={!lazyPrompt.trim()}>
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copia Prompt Generico</span>
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
            placeholder="Es: crea una campagna social per un nuovo prodotto eco-sostenibile"
            rows={4}
            className="resize-none"
          />
        </CardContent>
      </Card>

      <div className="flex justify-center space-x-4">
        <Button
          onClick={handleNewPrompt}
          variant="outline"
          size="lg"
          className="px-8 py-6 text-lg font-semibold"
        >
          <RefreshCcw className="mr-2 h-5 w-5" />
          Nuovo Prompt
        </Button>
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
            "Migliora Prompt"
          )}
        </Button>
      </div>

      {(isPending || greatPrompt) && (
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                <CardTitle>Super Prompt</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(formatGreatPromptForCopy(greatPrompt), "Super prompt")} disabled={!greatPrompt}>
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copia Super Prompt</span>
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
                  <h3 className="font-semibold text-base text-primary mb-1">Situazione:</h3>
                  <p className="text-foreground/90 whitespace-pre-wrap">{greatPrompt.situation}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-base text-primary mb-1">Compito:</h3>
                  <p className="text-foreground/90 whitespace-pre-wrap">{greatPrompt.task}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-base text-primary mb-1">Obiettivo:</h3>
                  <p className="text-foreground/90 whitespace-pre-wrap">{greatPrompt.objective}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-base text-primary mb-1">Conoscenza:</h3>
                  <ul className="list-disc list-inside space-y-1 text-foreground/90 pl-2">
                    {greatPrompt.knowledge.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-base text-primary mb-1">Conclusione:</h3>
                  <p className="text-foreground/90 whitespace-pre-wrap">{greatPrompt.conclusion}</p>
                </div>
              </div>
            )}
          </CardContent>
           {greatPrompt && !isPending && (
            <CardFooter className="flex justify-end">
               <Button variant="outline" size="sm" onClick={() => copyToClipboard(formatGreatPromptForCopy(greatPrompt), "Super prompt")}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copia Super Prompt
                </Button>
            </CardFooter>
           )}
        </Card>
      )}
    </div>
  );
}
