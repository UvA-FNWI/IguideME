import type { Synchronization } from '@/types/sync';

export const MOCK_SYNCHRONIZATIONS: Synchronization[] = [
  {
    start_timestamp: 1684499453123,
    end_timestamp: 1684499553123,
    invoked: 'IGUIDEME SYSTEM',
    status: 'COMPLETE',
  },
  {
    start_timestamp: 1684459453123,
    end_timestamp: 1684459653123,
    invoked: 'IGUIDEME SYSTEM',
    status: 'COMPLETE',
  },
  {
    start_timestamp: 1684359453213,
    end_timestamp: null,
    invoked: 'Demo Account',
    status: 'INCOMPLETE',
  },
];
