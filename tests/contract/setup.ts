// Setup file for Pact tests
import { beforeAll, afterAll, expect } from '@jest/globals';

// Make expect globally available
(global as any).expect = expect;

// Global setup for all Pact tests
beforeAll(() => {
  console.log('Setting up Pact test environment...');
});

afterAll(() => {
  console.log('Pact tests completed');
});
