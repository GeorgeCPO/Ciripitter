import { describe, it, expect } from 'vitest';
import { buildApp } from '../src/app';

describe('GET /', () => {
  it('returns hello world', async () => {
    const app = buildApp({ logger: false });

    const response = await app.inject({
      method: 'GET',
      url: '/',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ message: 'Hello World' });
  });
});
