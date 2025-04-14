import { Buffer } from 'buffer';
// If you're on React Native, ensure you have a polyfill for atob/Buffer if needed.
// Alternatively, install "jwt-decode" from npm to handle this.

export function decodeJWT(token: string): { exp?: number } {
  try {
    // Split the token into its 3 parts: header, payload, signature
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return {};
    // decode from base64
    const decodedPayload = Buffer.from(payloadBase64, 'base64').toString('utf-8');
    return JSON.parse(decodedPayload);
  } catch (error) {
    // If parsing fails, return an empty object
    return {};
  }
}

/**
 * Determines if the given JWT token is expired.
 * Returns `true` if current time >= token's `exp` claim, or token is invalid.
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded.exp) return true; // No exp field => consider it expired
  const now = Math.floor(Date.now() / 1000); // current time in seconds
  return now >= decoded.exp;
}
