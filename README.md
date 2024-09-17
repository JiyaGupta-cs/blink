# Micnft

This project demonstrates how to mint cNFTs (compressed NFTs) on the Solana blockchain using blinks. It is built using [Next.js](https://nextjs.org) and leverages the `@solana/actions` and `@solana/web3.js` libraries to interact with the Solana blockchain.

## What is it?

The main use of this project is to provide a simple and efficient way to mint compressed NFTs on the Solana blockchain. This can be useful for developers building decentralized applications (dApps) on the Solana blockchain, as well as for users who want to create and manage their own NFTs.

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Endpoints

### Mint cNFT

**Endpoint:** `/api/actions/mint`

**Method:** GET

**Query Parameters:**

- `name`: The name of the NFT.
- `symbol`: The symbol of the NFT.
- `description`: The description of the NFT.
- `imageURL`: The URL of the image to use for the NFT.

### Mint cNFT (Devnet)

**Endpoint:** `/api/actions/mint-dev`

**Method:** GET

**Query Parameters:**

- `name`: The name of the NFT.
- `symbol`: The symbol of the NFT.
- `description`: The description of the NFT.
- `imageURL`: The URL of the image to use for the NFT.

## Environment Variables

Make sure to set up your environment variables in a `.env` file. Example:

```properties
HELIUS_API_KEY=your-api-key-here
```
