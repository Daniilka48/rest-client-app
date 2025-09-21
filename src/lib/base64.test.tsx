import { encodeBase64Unicode, decodeBase64Unicode } from './base64';

describe('Base64 Unicode functions', () => {
  it('should encode and decode ASCII strings correctly', () => {
    const str = 'Hello, world!';
    const encoded = encodeBase64Unicode(str);
    const decoded = decodeBase64Unicode(encoded);

    expect(decoded).toBe(str);
  });

  it('should encode and decode Unicode strings correctly', () => {
    const str = 'Привет, мир!';
    const encoded = encodeBase64Unicode(str);
    const decoded = decodeBase64Unicode(encoded);

    expect(decoded).toBe(str);
  });

  it('should return empty string for invalid base64 in decode', () => {
    const originalBufferFrom: typeof Buffer.from = Buffer.from;

    Buffer.from = (() => {
      throw new Error('mock error');
    }) as typeof Buffer.from;

    const invalidB64 = '!!!not-base64!!!';
    const decoded = decodeBase64Unicode(invalidB64);

    expect(decoded).toBe('');

    Buffer.from = originalBufferFrom;
  });

  it('should handle empty string', () => {
    expect(encodeBase64Unicode('')).toBe('');
    expect(decodeBase64Unicode('')).toBe('');
  });
});
