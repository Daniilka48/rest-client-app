import * as codegen from 'postman-code-generators';
import { Request } from 'postman-collection';

type HeaderItem = { key: string; value: string };

export async function generateCodeSnippets(
  url: string,
  method: string,
  headers: HeaderItem[],
  body?: string
) {
  if (!url) {
    return { error: 'Not enough details to generate code (URL is missing)' };
  }

  const request = new Request({
    url,
    method,
    header: headers.map((h) => ({ key: h.key, value: h.value })),
    body: body ? { mode: 'raw', raw: body } : undefined,
  });

  const languages = [
    { lang: 'curl', variant: 'bash' },
    { lang: 'javascript', variant: 'fetch' },
    { lang: 'javascript', variant: 'xhr' },
    { lang: 'nodejs', variant: 'request' },
    { lang: 'python', variant: 'requests' },
    { lang: 'java', variant: 'okhttp' },
    { lang: 'csharp', variant: 'restsharp' },
    { lang: 'go', variant: 'native' },
  ];

  const results: Record<string, string> = {};

  for (const { lang, variant } of languages) {
    await new Promise<void>((resolve) => {
      codegen.convert(
        lang,
        variant,
        request,
        {},
        (error: unknown, snippet: unknown) => {
          if (error) {
            results[`${lang}-${variant}`] = `Error: ${String(error)}`;
          } else {
            results[`${lang}-${variant}`] = String(snippet);
          }
          resolve();
        }
      );
    });
  }

  return results;
}
