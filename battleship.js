const boardFourByFour = generateRandomBoard(4, 4, [
  { type: "large", id: 1, count: 1 }, // Large ship
  { type: "small", id: 2, count: 2 },  // Two small ships
]);

const boardFiveByFive = generateRandomBoard(5, 5, [
  { type: "large", id: 1, count: 1 }, // Large ship
  { type: "small", id: 2, count: 2 }, // Two small ships
]);

const boardSixBySix = generateRandomBoard(6, 6, [
  { type: "large", id: 1, count: 1 }, // Large ship
  { type: "small", id: 2, count: 3 }, // Three small ships
]);


function printBoard(board, debug = false) {
  const renderMap = {
    large: "🔵",
    small: "🟠",
    empty: "❗",
    hidden: "-"
  };
  const rowLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const table = {};
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

printBoard(boardSixBySix, true);