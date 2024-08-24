'use client';

import { type ReactElement, type ReactNode, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { setup } from '@/api/setup';
import { getSelf } from '@/api/users';
import { GlobalStoreProvider } from '@/stores/global-store/use-global-store';

export function DbProvider({ children }: Readonly<{ children: ReactNode }>): ReactElement {
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  useEffect(() => {
    async function initialize(): Promise<void> {
      await setup();
      setIsSetupComplete(true);
    }

    void initialize();
  }, []);

  const { data: self, error, isLoading } = useQuery({ queryKey: ['self'], queryFn: getSelf, enabled: isSetupComplete });

  if (isLoading || !isSetupComplete) {
    return <div>Loading...</div>;
  }

  if (error ?? !self) {
    return <div>Error loading user data</div>;
  }

  return <GlobalStoreProvider self={self}>{children}</GlobalStoreProvider>;
}
