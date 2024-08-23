import { setupServer } from 'msw/node';

import { handlers } from './all-handlers';

export const server = setupServer(...handlers);
