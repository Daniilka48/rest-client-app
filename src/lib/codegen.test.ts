import * as codegen from 'postman-code-generators';
import { generateCodeSnippets } from './codegen';

jest.mock('postman-code-generators', () => ({
  convert: jest.fn(),
}));

describe('generateCodeSnippets', () => {
  const mockedConvert = codegen.convert as jest.Mock;

  beforeEach(() => {
    mockedConvert.mockReset();
    mockedConvert.mockImplementation(
      (_lang, _variant, _req, _options, callback) => {
        callback(null, `${_lang}-${_variant}-snippet`);
      }
    );
  });

  it('should return error if URL is missing', async () => {
    const result = await generateCodeSnippets('', 'GET', []);
    expect(result).toEqual({
      error: 'Not enough details to generate code (URL is missing)',
    });
  });

  it('should generate code snippets for all languages', async () => {
    const result = await generateCodeSnippets(
      'https://example.com',
      'POST',
      [{ key: 'Content-Type', value: 'application/json' }],
      '{"name":"test"}'
    );

    expect(Object.keys(result)).toEqual([
      'curl-bash',
      'javascript-fetch',
      'javascript-xhr',
      'nodejs-request',
      'python-requests',
      'java-okhttp',
      'csharp-restsharp',
      'go-native',
    ]);

    for (const key in result) {
      expect(result[key]).toBe(`${key}-snippet`);
    }
  });

  it('should handle codegen errors gracefully', async () => {
    mockedConvert.mockImplementation((_lang, _variant, _req, _options, cb) => {
      cb('Some error', null);
    });

    const result = await generateCodeSnippets('https://example.com', 'GET', []);
    expect(Object.values(result).every((v) => v.startsWith('Error:'))).toBe(
      true
    );
  });
});
