import PromptCraftClient from "@/components/prompt-craft-client";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 md:p-12 bg-background">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary tracking-tight">
          PromptCraft AI
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Trasforma i tuoi prompt da generici a straordinari.
        </p>
      </header>
      <PromptCraftClient />
    </main>
  );
}
