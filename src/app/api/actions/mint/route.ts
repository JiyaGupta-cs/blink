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
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

// Set the donation recipient address here
const DONATION_ADDRESS: PublicKey = new PublicKey("EHfocbgMwpUnTR9RixBNdFJRUmPiNvMYLHk3F9ikFBjc");

const headers = createActionHeaders();

export const GET = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);
    const baseHref = new URL(`/api/actions/donate`, requestUrl.origin).toString();

    const payload: ActionGetResponse = {
      type: "action",
      title: "Donate SOL",
      icon: new URL("/donate-icon.png", requestUrl.origin).toString(),
      description: "Donate SOL to support our project",
      links: {
        actions: [
          {
            label: "Donate",
            href: `${baseHref}?amount={amount}`,
            parameters: [
              {
                name: "amount",
                label: "Enter the amount of SOL to donate",
                required: true,
              },
            ],
            type: "transaction"
          },
        ],
      },
    };

    return Response.json(payload, { headers });
  } catch (err) {
    console.error(err);
    let actionError: ActionError = { message: "An unknown error occurred" };
    if (typeof err == "string") actionError.message = err;
    return Response.json(actionError, { status: 400, headers });
  }
};

export const OPTIONS = async () => Response.json(null, { headers });

export const POST = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);
    const amount = parseFloat(requestUrl.searchParams.get("amount") || "0");
    if (isNaN(amount) || amount <= 0) throw "Invalid donation amount";

    const body: ActionPostRequest = await req.json();

    let donorAccount: PublicKey;
    try {
      donorAccount = new PublicKey(body.account);
    } catch (err) {
      throw 'Invalid donor account provided';
    }

    const connection = new Connection(process.env.SOLANA_RPC! || clusterApiUrl("mainnet-beta"));

    const transferInstruction = SystemProgram.transfer({
      fromPubkey: donorAccount,
      toPubkey: DONATION_ADDRESS,
      lamports: amount * LAMPORTS_PER_SOL,
    });

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

    const transaction = new Transaction({
      feePayer: donorAccount,
      blockhash,
      lastValidBlockHeight,
    }).add(transferInstruction);

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        type: "transaction",
        transaction,
        message: `Donate ${amount} SOL to support our project`,
      },
    });

    return Response.json(payload, { headers });
  } catch (err) {
    console.error(err);
    let actionError: ActionError = { message: "An unknown error occurred" };
    if (typeof err == "string") actionError.message = err;
    return Response.json(actionError, { status: 400, headers });
  }
};