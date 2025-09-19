export function encodeBase64Unicode(str: string) {
  try {
    return Buffer.from(encodeURIComponent(str)).toString('base64');
  } catch {
    return btoa(unescape(encodeURIComponent(str)));
  }
}

export function decodeBase64Unicode(b64: string) {
  try {
    const decoded = Buffer.from(b64, 'base64').toString('utf8');
    return decodeURIComponent(decoded);
  } catch {
    try {
      return decodeURIComponent(escape(atob(b64)));
    } catch {
      return '';
    }
  }
}
