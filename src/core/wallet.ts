import { Keypair,Connection, PublicKey } from '@solana/web3.js';
import * as bs58 from 'bs58';
import { getKp, setKp } from './storage';
import { Buffer } from 'buffer';
import { getAccount, getAssociatedTokenAddress } from '@solana/spl-token';
import config from './config';
import { mockStocks } from '@/data/mockData';
import { api_token_price } from './api';
const connection = new Connection( (import.meta as any).env.VITE_RPC, 'confirmed');

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

async function getTokenPrice(token:string) {
  const ret = {
    "usdPrice": 0,
    "blockId": 0,
    "decimals": 8,
    "priceChange24h": 0
  }
  const r = await api_token_price(token);
  // console.log(r);
  if(r && r[token])
  {
    return r[token];
  }
  return ret;
}
async function getSolBalance(address: string): Promise<number> {
  const publicKey = new PublicKey(address);
  const lamports = await connection.getBalance(publicKey);
  return lamports / 1e9;
}

async function getSplBalance(mint:string ,address: string,decimals:number): Promise<number> {
  const owner = new PublicKey(address);
  const tokenMint = new PublicKey(mint)
  const ata = await getAssociatedTokenAddress(tokenMint, owner);
  try {
    const accountInfo = await getAccount(connection, ata);
    return Number(accountInfo.amount) / Math.pow(10,decimals);
  } catch (err) {
    return 0; 
  }
}
async function initBalanace(address: string) {
  console.log("now try get balance ", address);
  if (!address) {
    return false;
  }

  // 第一步：并发获取USDT余额
  const usdtPromise = getSplBalance(config.tokens.usdt, address, 1e6);

  // 第二步：并发获取所有mockStocks的价格和余额
  const stockPromises = mockStocks.map(async (e) => {
    const [price, bal] = await Promise.all([
      getTokenPrice(e.address),
      getSplBalance(e.address, address, 1e8)
    ]);
    return { e, price, bal };
  });

  // 等待USDT余额
  const usdt = await usdtPromise;

  let ret = [];
  const u = {
    asset: 'USDT',
    balance: usdt,
    usdValue: usdt,
    locked: 0
  };
  ret.push(u);

  const prices = [];

  // 等待所有mockStock的价格和余额
  const stockResults = await Promise.all(stockPromises);

  for (const { e, price, bal } of stockResults) {
    if (price) {
      prices.push({
        symbol: e.symbol,
        price: price.usdPrice,
        change24h: price.priceChange24h * price.usdPrice,
        changePercent24h: price.priceChange24h,
        volume24h: 0,
        marketCap: 0,
      });
    }

    let tmp = {
      asset: e.symbol,
      balance: bal,
      usdValue: bal * price.usdPrice,
      locked: 0,
    };
    ret.push(tmp);
  }

  return {
    price: prices,
    balance: ret
  };
}

export {
    restoreSolanaWallet,
    localInit,
    importInit,
    encrypt,
    decrypt,
    getSolBalance,
    getSplBalance,
    initBalanace,
    getTokenPrice
}