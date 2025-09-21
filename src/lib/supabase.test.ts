import { jest } from '@jest/globals';
import type * as supabaseModuleType from './supabaseClient';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({})),
}));

describe('Supabase client', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should throw an error if environment variables are missing', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    await expect(import('./supabaseClient')).rejects.toThrow(
      'Supabase URL or Anon Key is not defined'
    );
  });

  it('should create a Supabase client when env variables are defined', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key';

    const supabaseModule: typeof supabaseModuleType = await import(
      './supabaseClient'
    );

    const { createClient } = await import('@supabase/supabase-js');
    const mockedCreateClient = jest.mocked(createClient);

    expect(mockedCreateClient).toHaveBeenCalledWith(
      'https://example.supabase.co',
      'anon-key'
    );

    expect(supabaseModule.supabase).toBeDefined();
  });
});
