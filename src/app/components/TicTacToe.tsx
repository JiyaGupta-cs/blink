// import React, { useState, useEffect } from 'react';
// import { Connection, clusterApiUrl, PublicKey, Transaction } from '@solana/web3.js';

// const TicTacToe: React.FC = () => {
//   const [gameStarted, setGameStarted] = useState(false);
//   const [playerName, setPlayerName] = useState('');
//   const [board, setBoard] = useState(Array(9).fill(null));
//   const [xIsNext, setXIsNext] = useState(true);
//   const [winner, setWinner] = useState<string | null>(null);

//   useEffect(() => {
//     fetchGameState();
//   }, [gameStarted]);

//   const fetchGameState = async () => {
//     const response = await fetch(`/api/actions/mint?gameStarted=${gameStarted}`);
//     const data = await response.json();
//     // Update component state based on the response
//     if (gameStarted) {
//       setBoard(data.links.actions.map((action: any) => action.disabled ? (xIsNext ? 'O' : 'X') : null));
//       setXIsNext(data.label.includes("X's turn"));
//     }
//   };

//   const handleNameSubmit = async () => {
//     if (!playerName) return;

//     const response = await fetch('/api/actions/mint?action=setName', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ fields: { name: playerName } }),
//     });

//     if (response.ok) {
//       setGameStarted(true);
//     } else {
//       console.error('Failed to start game');
//     }
//   };

//   const handleMove = async (position: number) => {
//     if (winner || board[position]) return;

//     const response = await fetch(`/api/actions/mint?action=move&position=${position}`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({}),
//     });

//     if (response.ok) {
//       const data = await response.json();
//       // Here you would handle the Solana transaction
//       // For simplicity, we're just updating the game state
//       fetchGameState();
//     } else {
//       console.error('Failed to make move');
//     }
//   };

//   const renderSquare = (i: number) => (
//     <button className="w-20 h-20 border border-gray-300" onClick={() => handleMove(i)}>
//       {board[i]}
//     </button>
//   );

//   if (!gameStarted) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//         <img src="/img/tictactoe-entry.png" alt="Tic-Tac-Toe Entry" className="mb-4" />
//         <input
//           type="text"
//           value={playerName}
//           onChange={(e) => setPlayerName(e.target.value)}
//           placeholder="Enter your name"
//           className="mb-4 p-2 border rounded"
//         />
//         <button
//           onClick={handleNameSubmit}
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//         >
//           Start Game
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <h1 className="text-4xl font-bold mb-8">Tic-Tac-Toe on Solana</h1>
//       <img src="/img/tictactoe-board.png" alt="Tic-Tac-Toe Board" className="mb-4" />
//       <div className="mb-4">
//         {winner ? `Winner: ${winner}` : `Next player: ${xIsNext ? 'X' : 'O'}`}
//       </div>
//       <div className="grid grid-cols-3 gap-2 mb-4">
//         {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => renderSquare(i))}
//       </div>
//     </div>
//   );
// };

// export default TicTacToe;