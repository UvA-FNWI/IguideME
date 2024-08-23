'use client';

import { useEffect } from 'react';

import { useToast } from '@/components/ui/use-toast';

interface UseActionStatusProps {
  description: {
    success: string;
    error: string;
  };
  status: string;
}

export function useActionStatus({ description, status }: UseActionStatusProps): void {
  const { toast } = useToast();

  useEffect(() => {
    if (status === 'success') {
      toast({
        description: description.success,
        variant: 'success',
      });
    } else if (status === 'error') {
      toast({
        // TODO: Make the action button actually do something
        // action: <ToastAction altText='Try again'>Try again</ToastAction>,
        description: description.error,
        variant: 'destructive',
      });
    }
  }, [description, status, toast]);
}
