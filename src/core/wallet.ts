import React, { useState, useEffect } from 'react';
import * as solanaWeb3 from '@solana/web3.js';
import * as nacl from 'tweetnacl';
import * as bs58 from 'bs58';
import CryptoJS from "crypto-js";
import { getKeypair, setKeypair } from './storage';

console.log("env",import.meta.env.VITE_SOLANA_RPC_URL)
const connection = new solanaWeb3.Connection(
import.meta.env.VITE_SOLANA_RPC_URL,
'confirmed'
);

// Generate wallet from seed
const generateWallet = (seed:any) => {
try {
    // Convert seed string to 32-byte Uint8Array using SHA-256
    const seedBuffer =Buffer.from(CryptoJS.SHA256(seed).toString());
    const seedUint8Array = new Uint8Array(seedBuffer);
//   console.log(seedBuffer,seedUint8Array)
    // Generate keypair from seed
    const keypair = nacl.sign.keyPair.fromSeed(seedUint8Array.slice(0, 32));
    const publicKey = bs58.default.encode(keypair.publicKey);
    const secretKey = bs58.default.encode(keypair.secretKey);
    return secretKey;
} catch (err) {
    console.error(err)
    return false;
}
};

// Fetch wallet balance
const fetchBalance = async (address:string) => {
    try {
        const publicKey = new solanaWeb3.PublicKey(address);
        const balance = await connection.getBalance(publicKey);
        return balance / solanaWeb3.LAMPORTS_PER_SOL;
    } catch (err) {
        return 0;
    }
};

const getWallet = () =>
{
    const sk = getKeypair();
    if(sk && sk.length>0)
    {
        try{
            return solanaWeb3.Keypair.fromSecretKey(
                bs58.default.decode(sk)
            )
        }catch(e)
        {
            console.error(e)
        }
    }
    return false;
} 

const newWallet = (seed:any) =>
{
    const sk =generateWallet(seed);
    if (sk)
    {
        setKeypair(sk);
    }
    return sk
}

const releaseWallet = () =>
{
    setKeypair("");
}


export{
    generateWallet,
    fetchBalance,
    newWallet,
    getWallet,
    releaseWallet
}