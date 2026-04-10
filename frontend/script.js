var board,
    game = new Chess();

// Connect to the backend Socket.IO server
var socket = io.connect("https://chess-multiplayer-test.onrender.com/");  // Change to your actual backend URL

// Listen for game state updates (i.e., when someone makes a move)
socket.on('gameState', function(fen) {
  game.load(fen);  // Load the new game state (FEN notation)
  board.position(game.fen());  // Update the board
});

// Set up the chessboard
function initBoard() {
  board = Chessboard('board1', {
    draggable: true,
    dropOffBoard: 'trash',
    sparePieces: true,
    onDrop: handleMove,
    onMouseoutSquare: squareHighlight,
    onMouseoverSquare: squareHighlight
  });
  
  board.start();
}

// Handle move logic
function handleMove(source, target) {
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // Always promote to a queen for simplicity
  });

  if (move === null) {
    return 'snapback';
  }

  // Send the move to the server
  socket.emit('makeMove', move);

  renderMoveHistory(game.history());
  renderBoardStatus();
}

// Render the move history
function renderMoveHistory(moves) {
  var historyElement = document.getElementById('move-history').empty();
  historyElement.empty();
  historyElement.append(moves.join(' '));
}

// Update game status (checkmate, stalemate, etc)
function renderBoardStatus() {
  var status = '';
  var moveColor = 'White';
  if (game.inCheckmate()) {
    status = moveColor + ' is in checkmate!';
  } else if (game.inStalemate()) {
    status = moveColor + ' is in stalemate!';
  } else if (game.inDraw()) {
    status = 'Game over, draw!';
  } else if (game.inCheck()) {
    status = moveColor + ' is in check!';
  } else {
    status = moveColor + ' to move';
  }

  document.getElementById('gameStatus').innerHTML = status;
}

// Initialize everything
document.addEventListener("DOMContentLoaded", function() {
  initBoard();
  document.getElementById('startBtn').addEventListener('click', function() {
    game.reset();
    renderBoard();
    renderBoardStatus();
  });

  document.getElementById('clearBtn').addEventListener('click', function() {
    game.clear();
    renderBoard();
    renderBoardStatus();
  });
});