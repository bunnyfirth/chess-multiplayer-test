var board,
    game = new Chess();

// Connect to the backend Socket.IO server (update to your actual backend URL)
var socket = io.connect("https://chess-multiplayer-test.onrender.com");  // Change to your actual backend URL

// Listen for game state updates
socket.on('gameState', function(fen) {
  game.load(fen);
  board.position(game.fen());
});

// Set up the chessboard
function initBoard() {
  board = Chessboard('board1', {
    draggable: true,
    dropOffBoard: 'trash',
    sparePieces: true,
    onDrop: handleMove,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare
  });
  
  board.position(game.fen());  // Set initial position
}

// Handle move logic
function handleMove(source, target) {
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q'
  });

  if (move === null) {
    return 'snapback';
  }

  socket.emit('makeMove', move);
  updateGameStatus();
  renderMoveHistory(game.history());
}

// Square highlight functions (basic implementation)
var highlightedSquare = null;

function onMouseoverSquare(square, piece) {
  if (highlightedSquare) {
    board.removeHighlights();
  }
  highlightedSquare = square;
  board.addHighlights([square]);
}

function onMouseoutSquare(square, piece) {
  board.removeHighlights();
  highlightedSquare = null;
}

// Render the move history
function renderMoveHistory(moves) {
  var historyElement = document.getElementById('move-history');
  historyElement.innerHTML = moves.join(' ');
}

// Update game status
function updateGameStatus() {
  var status = '';
  var moveColor = game.turn() === 'w' ? 'White' : 'Black';
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
  updateGameStatus();
  
  document.getElementById('startBtn').addEventListener('click', function() {
    game.reset();
    board.position(game.fen());
    updateGameStatus();
  });

  document.getElementById('clearBtn').addEventListener('click', function() {
    game.clear();
    board.position(game.fen());
    updateGameStatus();
  });
});