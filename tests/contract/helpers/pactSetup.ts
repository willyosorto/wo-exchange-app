import { Pact } from '@pact-foundation/pact';
import path from 'path';

export const createPact = (): Pact => {
  return new Pact({
    consumer: 'wo-exchange-app',
    provider: 'exchange-rate-api',
    port: 8991,
    log: path.resolve(process.cwd(), 'tests/contract/logs', 'pact.log'),
    dir: path.resolve(process.cwd(), 'tests/contract/pacts'),
    logLevel: 'info',
    spec: 2,
  });
};
