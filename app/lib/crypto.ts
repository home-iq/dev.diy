const encoder = new TextEncoder();
const decoder = new TextDecoder();
const IV_LENGTH = 16;

function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
  return btoa(binString);
}

function base64ToBuffer(base64: string): Uint8Array {
  const binString = atob(base64);
  return Uint8Array.from(binString, (char) => char.charCodeAt(0));
}

async function getKey(keyString: string): Promise<CryptoKey> {
  // Create a consistent key by hashing the string
  const keyData = await crypto.subtle.digest(
    'SHA-256',
    encoder.encode(keyString)
  );
  
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-CBC' },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encrypt(key: string, data: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const cryptoKey = await getKey(key);

  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-CBC',
      iv,
    },
    cryptoKey,
    encoder.encode(data)
  );

  // Combine IV and encrypted data
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(new Uint8Array(encrypted), 0);
  combined.set(iv, encrypted.byteLength);

  return bufferToBase64(combined);
}

export async function decrypt(key: string, encryptedData: string): Promise<string> {
  const combined = base64ToBuffer(encryptedData);
  
  // Split IV and data
  const iv = combined.slice(-IV_LENGTH);
  const data = combined.slice(0, -IV_LENGTH);

  const cryptoKey = await getKey(key);

  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-CBC',
      iv,
    },
    cryptoKey,
    data
  );

  return decoder.decode(decrypted);
}
