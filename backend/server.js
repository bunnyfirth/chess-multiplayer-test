const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const Chess = require("chess.js").Chess;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Initialize the game
let game = new Chess();

// Serve static files for frontend (Vercel)
app.use(express.static("frontend"));

// Handle socket connections
io.on("connection", (socket) => {
  console.log('A player connected');

  // Send the initial game state (FEN notation)
  socket.emit('gameState', game.fen());

  // Listen for player moves
  socket.on('makeMove', (move) => {
    let result = game.move(move);
    if (result) {
      io.emit('gameState', game.fen()); // Broadcast updated game state
    }
  });

  // Player disconnects
  socket.on('disconnect', () => {
    console.log('A player disconnected');
  });
});

// Start the server
server.listen(process.env.PORT || 10000, () => {
  console.log("Server is running...");
});