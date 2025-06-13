const readlineSync = require('readline-sync');

const debug = process.argv.includes('--debug');

const boardFourByFour = generateRandomBoard(4, 4, [
  { type: "large", id: 1, count: 1 }, // Large ship
  { type: "small", id: 2, count: 1 },  // Small ships
]);

const boardFiveByFive = generateRandomBoard(5, 5, [
  { type: "large", id: 1, count: 1 }, // Large ship
  { type: "small", id: 2, count: 2 }, // Two small ships
]);

const boardSixBySix = generateRandomBoard(6, 6, [
  { type: "large", id: 1, count: 2 }, // Two large ships
  { type: "small", id: 2, count: 2 }, // Two small ships
]);


function printBoard(board) {
  // Render the board in a table format
  const renderMap = {
    large: "🔵",
    small: "🟠",
    empty: "❗",
    hidden: "-"
  };
  // If debug mode, show hits
  const rowLabels = "ABCDEF";
  const table = {};
  // Create the header row
  for (let row = 0; row < board.length; row++) {
    table[rowLabels[row]] = board[row].map(cell =>
      (debug || cell.hit) ? renderMap[cell.type] : renderMap.hidden
    );
  }
  console.table(table);
}

function generateRandomBoard(rows, columns, ships) {
  // Start with an empty board
  const board = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => ({ type: "empty", hit: false }))
  );
  // Ship lengths
  const shipLengths = { large: 3, small: 2 };
  // Helper to check if a ship fits
  function fits(r, c, len, horiz) {
    for (let i = 0; i < len; i++) {
      const rr = r + (horiz ? 0 : i);
      const cc = c + (horiz ? i : 0);
      if (
        rr >= rows ||
        cc >= columns ||
        board[rr][cc].type !== "empty"
      ) return false;
    }
    return true;
  }
  // Place each ship
  ships.forEach(ship => {
    for (let n = 0; n < ship.count; n++) {
      let placed = false;
      while (!placed) {
        const horiz = Math.random() < 0.5;
        const maxR = horiz ? rows : rows - shipLengths[ship.type] + 1;
        const maxC = horiz ? columns - shipLengths[ship.type] + 1 : columns;
        const r = Math.floor(Math.random() * maxR);
        const c = Math.floor(Math.random() * maxC);
        if (fits(r, c, shipLengths[ship.type], horiz)) {
          for (let i = 0; i < shipLengths[ship.type]; i++) {
            const rr = r + (horiz ? 0 : i);
            const cc = c + (horiz ? i : 0);
            board[rr][cc] = { type: ship.type, id: ship.id, hit: false };
          }
          placed = true;
        }
      }
    }
  });
  return board;
}

// printBoard(boardFourByFour, true);
// printBoard(boardFiveByFive, true);
// printBoard(boardSixBySix, true);

function showGreetingMenu() {
  console.log("Welcome to Battleship 🚢");
  console.log("Choose a board size:");
  console.log("\n1. 4x4 Board \n2. 5x5 Board \n3. 6x6 Board\n0. Exit\n");
  // Prompt the user for a board size until a valid input is given
  let size;
  // Use readline-sync to get input
  while (true) {
    const input = readlineSync.question("Enter Board Size (4, 5, 6, 0): ");
    if (input === "4" || input === "5" || input === "6") {
      size = parseInt(input, 10);
      break;
    } else if (input === "0") {
      console.log("Goodbye!");
      process.exit();
    } else {
      console.log("Invalid input. Please enter 4, 5, or 6.");
    }
  }
  return size;
}

function startGame() {
  // Start the game by showing the greeting menu and printing the selected board
  const selectedBoardSize = showGreetingMenu();
  console.clear(); // Clear the console for a fresh view
  console.log(`You selected a ${selectedBoardSize}x${selectedBoardSize} board.`);
  // Print the board based on the selected size
  if (selectedBoardSize === 4) {
    board = boardFourByFour;
  } else if (selectedBoardSize === 5) {
    board = boardFiveByFive;
  } else if (selectedBoardSize === 6) {
    board = boardSixBySix;
  }
  printBoard(board, debug);
  const rowLabels = "ABCDEF";
  // Initialize the game loop
  // Allow the user to guess until all ships are sunk or they exit
  while (true) {
    const guess = readlineSync.question(
      `Enter your guess (e.g., A1, B2, C3) or type 'exit' to quit: `
    ).toUpperCase();
    console.clear(); // Clear the console for a fresh view
    // Check if the user wants to exit
    if (guess === "EXIT") {
      console.log("Thanks for playing! Goodbye!");
      break;
    }
    const row = rowLabels.indexOf(guess[0]);
    const col = parseInt(guess[1], 10) - 1;
    // Validate the guess
    if (
      row < 0 ||
      row >= selectedBoardSize ||
      isNaN(col) ||
      col < 0 ||
      col >= selectedBoardSize
    ) {
      printBoard(board, debug);
      console.log("Invalid guess. Please enter a valid coordinate (e.g., A1, B2, C3).");
      continue;
    }
    // Check if the guessed cell has already been hit
    if (board[row][col].hit) {
      printBoard(board, debug);
      console.log("You already guessed that spot. Try again.");
      continue;
    } else {
      board[row][col].hit = true; // This works for both ship and empty cells
    }
    printBoard(board, debug);
    // Check if all ships are sunk
    const allShipsSunk = board.flat().filter(cell => cell.type === "large" || cell.type === "small").every(cell => cell.hit);
    if (allShipsSunk) {
      console.log(`
        ========
        __   _______ _   _   _    _ _____ _   _
        \\ \\ / /  _  | | | | | |  | |_   _| \\ | |
         \\ V /| | | | | | | | |  | | | | |  \\| |
          \\ / | | | | | | | | |/\\| | | | | . ' |
          | | \\ \\_/ / |_| | \\  /\\  /_| |_| |\\  |
          \\_/  \\___/ \\___/   \\/  \\/ \\___/\\_| \\_/
        ========`
      );
      break;
    }
  }
}

startGame();