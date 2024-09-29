import {
  ActionGetResponse,
  ACTIONS_CORS_HEADERS,
  ActionPostRequest,
  createPostResponse,
  ActionPostResponse,
} from "@solana/actions";
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

// Game state
let gameState = {
  player: "",
  board: Array(9).fill(null),
  xIsNext: true,
  winner: null,
};

function calculateWinner(squares: (string | null)[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function getBoardImageUrl(url: URL, board: (string | null)[]) {
  // Generate a unique identifier for the current board state
  const boardState = board.map(cell => cell || '-').join('');
  return new URL(`/img/tictactoe-${boardState}.png`, url.origin).toString();
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const gameStarted = gameState.player !== "";

  let payload: ActionGetResponse;

  if (!gameStarted) {
    // Initial screen for name entry
    payload = {
      icon: new URL("/img/tictactoe-entry.png", url.origin).toString(),
      label: "Enter Your Name",
      description: "Enter your name to start playing Tic-Tac-Toe on Solana",
      title: "Solana Tic-Tac-Toe - Player Entry",
      links: {
        actions: [
          {
            href: "/api/actions/mint?action=setName",
            label: `Start Game ${gameStarted}`,
            parameters: [
              {
                name: "name",
                label: "Your Name",
              },
            ],
          },
        ],
      },
    };
  } else {
    // Game board screen
    payload = {
      icon: getBoardImageUrl(url, gameState.board),
      label: gameState.winner 
        ? `Game Over - ${gameState.winner} wins!` 
        : `Tic-Tac-Toe - ${gameState.xIsNext ? 'X' : 'O'}'s turn`,
      description: gameState.winner 
        ? "Game has ended. Start a new game?" 
        : `It's ${gameState.xIsNext ? "X" : "O"}'s turn to move`,
      title: `Solana Tic-Tac-Toe - ${gameState.player}'s Game`,
      links: {
        actions: gameState.winner
          ? [
              {
                href: "/api/actions/mint?action=reset",
                label: "New Game",
              },
            ]
          : gameState.board.map((value, index) => ({
              href: `/api/actions/mint?action=move&position=${index}`,
              label: `${value || (index + 1)}`,
              disabled: value !== null,
            })),
      },
    };
  }

  return Response.json(payload, {
    headers: ACTIONS_CORS_HEADERS,
  });
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const body: ActionPostRequest = await req.json();
    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      throw "Invalid 'account' provided. It's not a real pubkey";
    }
    
    const action = url.searchParams.get("action");
    
    if (action === "setName") {
      const name = body.fields?.name;
      if (!name) throw "Name is required";
      gameState.player = name;
      gameState.board = Array(9).fill(null);
      gameState.xIsNext = true;
      gameState.winner = null;
      
    } else if (action === "move") {
      if (gameState.winner) throw "Game is already over";
      const position = url.searchParams.get("position");
      if (!position || isNaN(parseInt(position)) || parseInt(position) < 0 || parseInt(position) > 8) {
        throw "Invalid 'position' input";
      }
      const pos = parseInt(position);
      if (gameState.board[pos] !== null) {
        throw "Invalid move: position already occupied";
      }
      gameState.board[pos] = gameState.xIsNext ? "X" : "O";
      gameState.winner = calculateWinner(gameState.board);
      if (!gameState.winner) {
        gameState.xIsNext = !gameState.xIsNext;
      }
    } else if (action === "reset") {
      gameState.board = Array(9).fill(null);
      gameState.xIsNext = true;
      gameState.winner = null;
    } else {
      throw "Invalid action";
    }

    const connection = new Connection(clusterApiUrl("devnet"));
    const TO_PUBKEY = new PublicKey(
      "9FK3BZiGatVrDwVZoMZsJQW24ETAmmzBAGPnJp9jSdtu"
    );
    
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: account,
        lamports: 0.01 * LAMPORTS_PER_SOL, // Small amount for demo
        toPubkey: TO_PUBKEY,
      })
    );
    transaction.feePayer = account;
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;
    
    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: action === "setName" 
          ? `Welcome, ${gameState.player}! Game started.` 
          : action === "move" 
          ? `Move made at position ${url.searchParams.get("position")}`
          : "New game started",
      },
    });
    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return Response.json(
      {
        message,
      },
      {
        headers: ACTIONS_CORS_HEADERS,
      }
    );
  }
}

export async function OPTIONS(req: Request) {
  return new Response(null, {
    headers: ACTIONS_CORS_HEADERS,
  });
}