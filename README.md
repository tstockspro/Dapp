# Tstocks Dapp 💎

This repo is to build a onchain RWA stock trading protocol . Allows anyone to trade [stocks token](https://xstocks.com/products) here without KYC. 

## Support Asserts

| Name | Contract | Information |
|------|----------|------|
| Tsla | XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB | https://assets.backed.fi/products/tesla-xstock |
| NVIDIA | Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh | https://assets.backed.fi/products/novo-nordisk-xstock |
| Alphabet | XsCPL9dNWBMvFtTmwcCA5v3xWPSMEBCszbQdiLLq6aN | https://assets.backed.fi/products/accenture-xstock |
| Meta | Xsa62P5mvPszXL1krVUnU5ar38bBSVcWAB6fmPCo5Zu | https://assets.backed.fi/products/meta-xstock |
| Apple | XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp | https://assets.backed.fi/products/apple-xstock |
| Amazon | Xs3eBt7uRfJX8QUs4suhyU8p2M6DoUDrJyWBa8LLZsg | https://assets.backed.fi/products/amazon-xstock |

## Functions

- **MPC & Local-self-generate Wallet**
  - MPC wallet
    - Web3auth 
      - Google Login
      - Apple Login
      - Email Login
    - Self-generate wallet
      - Local-storage solution
      - Telegram-cloudstorage solution
    - Connect wallet | Signature generate wallet
      - EVM
      - Phantom
      - Tonconnect
  - Private-key import/export
  - HD-wallet path generate

- **Deposite system | Bridge aggrator**
  - Solana deposite 
    - Address QR Display
  - Other chains | Bridge 
    - FF.IO
    - Exolix
    
- **Spot trading**
  - Gasless transaction
    - [User] Swap transaction (USDT/USDC)
    - [User] Send fee in USDT
    - [Payer] Gas less transaction (payer)
  - PNL analyze
  - Asserts controller : BUY|SELL

- **Leverage make long trading**
  - Staking
    - [Staker] Send 100 USDT to vault
  - Withdraw
    - [Staker] Withdraw 100.1 USDT
  - Make Long
    - [User]Send 10 USDT to sender transaction 
    - [Sender] Swap transaction (90 + 10USDT) for stock
    - [Sender] Hold stock
  - Liquidtion or Close
    - [Sender] Sell all stock coin . Send fee to vault . take back 90 USDT
    - [Sender] Send all others to user 

- **Leverage make short trading**
  - Staking
    - [Staker] Send 100$ xTesla to vault
  - Withdraw
    - [Staker] Withdraw 100.1$ xTesla
  - Make Short
    - [Staker]Send 100 stock coin to Holder
    - [User] Send 10 USDT to Holder
    - [Holder] Sell 90$[0.9] stock coin and hold with User
  - Liquidtion or Close
    - [Holder] Buy [0.9] stocks with USDT
    - [Holder] Send fee to vault
    - [Holder] Send remain USDT to user