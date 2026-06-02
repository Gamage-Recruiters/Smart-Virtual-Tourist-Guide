const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const notificationHandler = require("./socket/notificationHandler");

const app = express();
const server = http.createServer(app);

/**
 * Initialize the Socket.io server to enable real-time communication.
 * The 'cors' setting allows our Frontend (localhost:3000) to securely
 * connect to this Backend server.
 */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // URL of your Frontend application
    methods: ["GET", "POST"], // Allowed HTTP methods for the connection
  },
});

/**
 * Connect the Socket instance to our Notification & Alerts Engine.
 * This function handles all room-joining logic and location-based updates.
 */
notificationHandler(io);

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
