import React, { useState, useEffect } from 'react';
import * as solanaWeb3 from '@solana/web3.js';
import * as nacl from 'tweetnacl';
import * as bs58 from 'bs58';
import CryptoJS from "crypto-js";
// Define Solana network (use 'mainnet-beta' for production)
const SOLANA_NETWORK = 'mainnet-beta';

// Interface for wallet data
interface Wallet {
  publicKey: string;
  secretKey: string;
}

export function SolanaWallet(){
  const [seed, setSeed] = useState<string>('');          // Seed input
  const [wallet, setWallet] = useState<Wallet | null>(null); // Generated wallet
  const [balance, setBalance] = useState<number | null>(null); // Wallet balance
  const [recipient, setRecipient] = useState<string>(''); // Recipient address
  const [amount, setAmount] = useState<number>(0);       // Transfer amount
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error message

  // Establish connection to Solana network
  const connection = new solanaWeb3.Connection(
  import.meta.env.VITE_SOLANA_RPC_URL,
    'confirmed'
  );

  // Generate wallet from seed
  const generateWallet = () => {
    if (!seed) {
      setError('请输入种子字符串');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Convert seed string to 32-byte Uint8Array using SHA-256
      const seedBuffer =Buffer.from(CryptoJS.SHA256(seed).toString());
      const seedUint8Array = new Uint8Array(seedBuffer);
    //   console.log(seedBuffer,seedUint8Array)
      // Generate keypair from seed
      const keypair = nacl.sign.keyPair.fromSeed(seedUint8Array.slice(0, 32));
      const publicKey = bs58.default.encode(keypair.publicKey);
      const secretKey = bs58.default.encode(keypair.secretKey);
      console.log(secretKey)
      setWallet({ publicKey, secretKey });
    } catch (err) {
        console.error(err)
      setError('生成钱包失败');
    } finally {
      setLoading(false);
    }
  };

  // Fetch wallet balance
  const fetchBalance = async () => {
    if (!wallet) return;
    setLoading(true);
    setError(null);
    try {
      const publicKey = new solanaWeb3.PublicKey(wallet.publicKey);
      const balance = await connection.getBalance(publicKey);
      setBalance(balance / solanaWeb3.LAMPORTS_PER_SOL);
    } catch (err) {
      setError('获取余额失败');
    } finally {
      setLoading(false);
    }
  };

  // Send SOL transaction
  const sendTransaction = async () => {
    if (!wallet || !recipient || amount <= 0) {
      setError('转账信息无效');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const fromPublicKey = new solanaWeb3.PublicKey(wallet.publicKey);
      const toPublicKey = new solanaWeb3.PublicKey(recipient);
      const lamports = amount * solanaWeb3.LAMPORTS_PER_SOL;

      const transaction = new solanaWeb3.Transaction().add(
        solanaWeb3.SystemProgram.transfer({
          fromPubkey: fromPublicKey,
          toPubkey: toPublicKey,
          lamports,
        })
      );

      const keypair = solanaWeb3.Keypair.fromSecretKey(bs58.default.decode(wallet.secretKey));
      await solanaWeb3.sendAndConfirmTransaction(connection, transaction, [keypair]);
      alert('转账成功');
      fetchBalance(); // Refresh balance after transaction
    } catch (err) {
      setError('转账失败');
    } finally {
      setLoading(false);
    }
  };

  // Fetch balance periodically when wallet exists
  useEffect(() => {
    if (wallet) {
      fetchBalance();
      const interval = setInterval(fetchBalance, 10000); // Refresh every 10 seconds
      return () => clearInterval(interval);
    }
  }, [wallet]);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Solana 钱包</h1>
      
      {/* Seed input and wallet generation */}
      <div className="mb-4">
        <label className="block mb-1">种子字符串:</label>
        <input
          type="text"
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="输入种子字符串"
        />
        <button
          onClick={generateWallet}
          disabled={loading}
          className="mt-2 w-full p-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        >
          {loading ? '生成中...' : '生成钱包'}
        </button>
      </div>

      {/* Wallet details */}
      {wallet && (
        <div className="mb-4">
          <p className="mb-2">
            <strong>公钥:</strong> {wallet.publicKey}
          </p>
          <p className="mb-2">
            <strong>余额:</strong>{' '}
            {balance !== null ? `${balance} SOL` : '加载中...'}
          </p>

          {/* Transfer form */}
          <div className="mb-2">
            <label className="block mb-1">接收地址:</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="输入接收地址"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1">金额 (SOL):</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              className="w-full p-2 border rounded"
              placeholder="输入金额"
              min="0"
              step="0.001"
            />
          </div>
          <button
            onClick={sendTransaction}
            disabled={loading}
            className="w-full p-2 bg-green-500 text-white rounded disabled:bg-gray-400"
          >
            {loading ? '转账中...' : '发送转账'}
          </button>
        </div>
      )}

      {/* Error message */}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};