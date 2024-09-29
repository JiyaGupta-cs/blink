// export const GET = async (req: Request) => {
//     try {
//       const requestUrl = new URL(req.url);
//       const { toPubkey } = validatedQueryParams(requestUrl);
//       const basehref = new URL(
//         `/api/actions/payments?to=${toPubkey.toBase58()}`,
//         requestUrl.origin
//       ).toString();
  
//       const payload = {
//         title: "100xdevs COHORT 3.0",
//         icon: new URL("/logo.png", requestUrl.origin).toString(),
//         description: 
//         "1. Complete Blockchain + Web Development + DevOps - $100\n" +
//         "2. Complete Web3.0 Cohort - $75\n" +
//         "3. Complete Web Development + DevOps Cohort - $75\n\n" +
//         "✨ Important: After making the payment, please send an email to 100xdevs@gmail.com with your transaction signature. We will use that email to grant you access to the course. 📧",
//         links: {
//           actions: [
//             {
//               label: "0.7SOL(100$)",
//               href: `${basehref}&amount=0.7`,
//             },
//             {
//               label: "0.5SOL(75$)",
//               href: `${basehref}&amount=0.5`,
//             },
//             {
//               label: "0.01SOL",
//               href: `${basehref}&amount=0.01`,
//             },
//           ],
//         },
//       };
  
//       return new NextResponse(JSON.stringify(payload), {
//         headers: ACTIONS_CORS_HEADERS,
//       });
//     } catch (err) {
//       console.log(err);
//       let message = "An unknown error occurred";
//       if (typeof err == "string") message = err;
//       return new Response(message, {
//         status: 400,
//         headers: ACTIONS_CORS_HEADERS,
//       });
//     }
//   };




  
  
//   // else {
//   //   // Game board screen
//   //   payload = {
//   //     icon: getBoardImageUrl(url, gameState.board),
//   //     label: gameState.winner 
//   //       ? `Game Over - ${gameState.winner} wins!` 
//   //       : `Tic-Tac-Toe - ${gameState.xIsNext ? 'X' : 'O'}'s turn`,
//   //     description: gameState.winner 
//   //       ? "Game has ended. Start a new game?" 
//   //       : `It's ${gameState.xIsNext ? "X" : "O"}'s turn to move`,
//   //     title: `Solana Tic-Tac-Toe - ${gameState.player}'s Game`,
//   //     links: {
//   //       actions: gameState.winner
//   //         ? [
//   //             {
//   //               href: "/api/actions/mint?action=reset",
//   //               label: "New Game",
//   //             },
//   //           ]
//   //         : gameState.board.map((value, index) => ({
//   //             href: `/api/actions/mint?action=move&position=${index}`,
//   //             label: `${value || (index + 1)}`,
//   //             disabled: value !== null,
//   //           })),
//   //     },
//   //   };
//   // }

//   // export async function OPTIONS(req: Request) {
// //   return new Response(null, {
// //     headers: ACTIONS_CORS_HEADERS,
// //   });
// // }
