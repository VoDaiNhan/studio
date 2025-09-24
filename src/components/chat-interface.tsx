'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { ThumbsUp, ThumbsDown, Search, Loader2, Bot, Gavel, FileText } from 'lucide-react';
import { getLawSummary, type LawSummaryState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const initialState: LawSummaryState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Searching...
        </>
      ) : (
        <>
          <Search className="mr-2 h-4 w-4" />
          Search
        </>
      )}
    </Button>
  );
}

export function ChatInterface() {
  const { toast } = useToast();
  const [state, formAction] = useFormState(getLawSummary, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { pending } = useFormStatus();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
    if (!pending && state.summary) {
        formRef.current?.reset();
    }
  }, [state, toast, pending]);
  
  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4">
      <Card className="bg-card/90 backdrop-blur-sm shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-3 mb-2">
            <Gavel className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline tracking-tight">
              Luật Giao Thông Bot
            </h1>
          </div>
          <p className="text-muted-foreground">
            Your AI assistant for Vietnamese traffic laws.
          </p>
        </CardHeader>
        <CardContent>
          <form
            ref={formRef}
            action={formAction}
            className="space-y-4"
          >
            <Textarea
              name="query"
              placeholder='e.g., "Đi vào làn khẩn cấp trên cao tốc bị phạt bao nhiêu tiền?"'
              className="min-h-[100px] text-base resize-none"
              required
            />
            <div className="flex justify-end">
              <SubmitButton />
            </div>
          </form>
        </CardContent>
      </Card>

      {pending && (
        <Card className="mt-6 animate-in fade-in duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-muted-foreground">
              <Bot className="w-6 h-6" />
              <span>Thinking...</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
        </Card>
      )}

      {state.summary && !pending && (
        <Card className="mt-6 animate-in fade-in duration-500">
          <CardHeader>
            <p className="text-sm text-muted-foreground">You asked:</p>
            <CardTitle className="text-lg font-normal">"{state.query}"</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="flex items-center gap-2 font-semibold mb-2 text-primary">
                <Bot className="w-5 h-5" />
                Summary
              </h3>
              <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">
                {state.summary}
              </p>
            </div>
            <div>
              <h3 className="flex items-center gap-2 font-semibold mb-2 text-accent">
                <FileText className="w-5 h-5" />
                Source Articles
              </h3>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/50 p-4 rounded-md font-mono">
                {state.sourceArticles}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">Was this helpful?</p>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" aria-label="Helpful">
                <ThumbsUp className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" aria-label="Not helpful">
                <ThumbsDown className="w-4 h-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
