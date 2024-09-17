import {
  ActionPostResponse,
  createPostResponse,
  ActionGetResponse,
  ActionPostRequest,
  createActionHeaders,
  ActionError,
} from "@solana/actions";
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  SystemProgram,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import { loadEnvConfig } from "@next/env";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

// create the standard headers for th is route (including CORS)
const headers = createActionHeaders();

export const GET = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);
    const baseHref = new URL(`/api/actions/mint`, requestUrl.origin).toString();

    const payload: ActionGetResponse = {
      type: "action",
      title: "Micnft - Mint cNFT",
      icon: new URL("/logo.png", requestUrl.origin).toString(),
      description: "Mint cNFT (devnet)",
      label: "Mint",
      links: {
        actions: [
          {
            label: "Mint",
            href: `${baseHref}?name={name}&symbol={symbol}&description={description}&imageURL={imageURL}`,
            parameters: [
              {
                name: "name",
                type: "text",
                label: "Name",
                required: true,
              },
              {
                name: "symbol",
                type: "text",
                label: "Symbol",
                required: true,
              },
              {
                name: "description",
                type: "text",
                label: "Description",
                required: true,
              },
              {
                name: "imageURL",
                type: "text",
                label: "Image URL",
                required: true,
              },
            ],
          },
        ],
      },
    };

    return Response.json(payload, {
      headers,
    });
  } catch (err) {
    console.log(err);
    let actionError: ActionError = { message: "An unknown error occurred" };
    if (typeof err == "string") actionError.message = err;
    return Response.json(actionError, {
      status: 400,
      headers,
    });
  }
};

// DO NOT FORGET TO INCLUDE THE `OPTIONS` HTTP METHOD
// THIS WILL ENSURE CORS WORKS FOR BLINKS
export const OPTIONS = async () => Response.json(null, { headers });

export const POST = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);
    const { name, symbol, description, imageURL } =
      validatedQueryParams(requestUrl);
    const body: ActionPostRequest = await req.json();
    const amount: number = 0.001;
    const toPubkey = new PublicKey(
      "HX1TPzh21wV1SFaENyu2YuAWzLfTL7ADjEtcNNdTCXiW"
    );
    // validate the client provided input
    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      throw 'Invalid "account" provided';
    }

    const connection = new Connection(
      process.env.SOLANA_RPC! || clusterApiUrl("mainnet-beta")
    );

    // ensure the receiving account will be rent exempt
    const minimumBalance = await connection.getMinimumBalanceForRentExemption(
      0 // note: simple accounts that just store native SOL have `0` bytes of data
    );
    if (amount * LAMPORTS_PER_SOL < minimumBalance) {
      throw `account may not be rent exempt: ${toPubkey.toBase58()}`;
    }

    // create an instruction to transfer native SOL from one wallet to another
    const transferSolInstruction = SystemProgram.transfer({
      fromPubkey: account,
      toPubkey: toPubkey,
      lamports: amount * LAMPORTS_PER_SOL,
    });

    // get the latest blockhash amd block height
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    // create a legacy transaction
    const transaction = new Transaction({
      feePayer: account,
      blockhash,
      lastValidBlockHeight,
    }).add(transferSolInstruction);

    const apiKey = process.env.HELIUS_API_KEY;

    const url = `https://mainnet.helius-rpc.com/?api-key=${apiKey}`;

    const mintCompressedNft = async () => {
      let message;
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: "micnft-nft",
            method: "mintCompressedNft",
            params: {
              name: name,
              symbol: symbol,
              owner: account,
              description: description,
              imageUrl: imageURL,
              externalUrl: "https://micnft.ayushagr.me",
              sellerFeeBasisPoints: 1000, // 10%
            },
          }),
        });

        const data = await response.json();

        if (data.result) {
          message = `NFT minted successfully!\nAsset ID: ${data.result.assetId}`;
        } else {
          console.error("Error minting NFT: ", data);
        }
      } catch (error) {
        console.error("Error during minting:", error);
      }
      return message;
    };

    // Call the minting function
    const message = await mintCompressedNft();
    if (!message) {
      throw "Error minting NFT";
    }
    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: message,
      },
    });

    return Response.json(payload, {
      headers,
    });
  } catch (err) {
    console.log(err);
    let actionError: ActionError = { message: "An unknown error occurred" };
    if (typeof err == "string") actionError.message = err;
    return Response.json(actionError, {
      status: 400,
      headers,
    });
  }
};

function validatedQueryParams(requestUrl: URL) {
  let name: string;
  let symbol: string;
  let description: string;
  let imageURL: string;

  if (requestUrl.searchParams.has("name")) {
    name = requestUrl.searchParams.get("name")!;
  } else {
    throw 'Missing required query parameter "name"';
  }

  if (requestUrl.searchParams.has("symbol")) {
    symbol = requestUrl.searchParams.get("symbol")!;
  } else {
    throw 'Missing required query parameter "symbol"';
  }

  if (requestUrl.searchParams.has("description")) {
    description = requestUrl.searchParams.get("description")!;
  } else {
    throw 'Missing required query parameter "description"';
  }

  if (requestUrl.searchParams.has("imageURL")) {
    imageURL = requestUrl.searchParams.get("imageURL")!;
  } else {
    throw 'Missing required query parameter "imageURL"';
  }

  return { name, symbol, description, imageURL };
}
