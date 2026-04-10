const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const Chess = require("chess.js").Chess;

const app = express();
const server = http.createServer(app);

// ✅ IMPORTANT: CORS FIX FOR SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: "*", // for testing (we can lock it later)
    methods: ["GET", "POST"]
  }
});

let game = new Chess();

// optional health route
app.get("/", (req, res) => {
  res.send("Chess backend running");
});

io.on("connection", (socket) => {
  console.log("Player connected");

  socket.emit("gameState", game.fen());

  socket.on("makeMove", (move) => {
    const result = game.move(move);

    if (result) {
      io.emit("gameState", game.fen());
    }
  });

  socket.on("disconnect", () => {
    console.log("Player disconnected");
  });
});

server.listen(process.env.PORT || 10000, () => {
  console.log("Server running");
});