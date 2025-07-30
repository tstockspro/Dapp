import { Keypair } from '@solana/web3.js';
import { Buffer } from 'buffer';
import * as bs58 from 'bs58';
import { getKp, setKp } from './storage';
const restoreSolanaWallet = (seed: string) =>{
  const seedBuffer = Buffer.from(seed);
  const seedBytes = seedBuffer.length >= 32 
    ? seedBuffer.slice(0, 32) 
    : Buffer.concat([seedBuffer, Buffer.alloc(32 - seedBuffer.length)]);
  const keypair = Keypair.fromSeed(seedBytes);
  return {
    keypair,
    publicKey: keypair.publicKey.toBase58(),
    secretKey: bs58.default.encode(keypair.secretKey)
  };
}

function randomBytes(length: number): Uint8Array {
  if (length <= 0) {
    throw new Error("Length must be a positive number");
  }

  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return array;
}

const localInit = () =>{
    let seed = getKp();
    if(seed)
    {
        const kp = restoreSolanaWallet(seed);
        if(kp)
        {
            return kp
        }
    }
    seed = randomBytes(64).toString();
    setKp(seed)
    return restoreSolanaWallet(seed);
}

const importInit = (seed: string) =>{
    setKp(seed)
    return restoreSolanaWallet(seed);
}


async function encrypt(pwd: string, secretKey: string): Promise<string> {
  try {
    const pwdBuffer = new TextEncoder().encode(pwd);
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      pwdBuffer,
      'PBKDF2',
      false,
      ['deriveKey']
    );
    const derivedKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new TextEncoder().encode('solana-encrypt'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );
    const secretKeyBytes = bs58.default.decode(secretKey);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      derivedKey,
      secretKeyBytes
    );
    const combined = new Uint8Array([...iv, ...new Uint8Array(encrypted)]);
    return bs58.default.encode(combined);
  } catch (error) {
    throw new Error(`Encryption failed: ${error}`);
  }
}
async function decrypt(pwd: string, ciphertext: string): Promise<Keypair | false> {
  try {
    const combined = bs58.default.decode(ciphertext);
    const iv = combined.slice(0, 12);
    const encryptedData = combined.slice(12);
    const pwdBuffer = new TextEncoder().encode(pwd);
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      pwdBuffer,
      'PBKDF2',
      false,
      ['deriveKey']
    );
    const derivedKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new TextEncoder().encode('solana-encrypt'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      derivedKey,
      encryptedData
    );
    const secretKey = new Uint8Array(decrypted);
    return Keypair.fromSecretKey(secretKey);
  } catch (error) {
    console.error(`Decryption or Keypair recovery failed: ${error}`);
    return false;
  }
}

export {
    restoreSolanaWallet,
    localInit,
    importInit,
    encrypt,
    decrypt
}