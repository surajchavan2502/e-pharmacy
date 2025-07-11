import express from "express";
import path from "path";
import { MODE, PORT, FRONTEND_PATH } from "./serverConfig.js";
import dbConnect from "./db.js";
import middlewareRouter from "./routes/middlwareRouter.js";
import createSuperAdmin from "./utils/superAdmin.js";
import morgan from "morgan";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";

// Initialize Express App
const app = express();
const port = PORT || 5000;
const dir = path.resolve();

// Create HTTP Server for WebSockets
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Attach `io` to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Middleware
app.use(express.json());
app.use(morgan("dev"));
// Serve Frontend in Production Mode
if (MODE === "prod") {
  app.use(express.static(path.join(dir, FRONTEND_PATH)));
} else {
  app.use(cors());
}

// API Routes
app.use("/api/public", middlewareRouter);
app.use("/api/protected", middlewareRouter);

// Handle 404 Errors
app.all("*", (req, res) => {
  res.status(404).json({ message: "Path not found" });
});

// WebSocket Logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start Server
try {
  await dbConnect();
  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

  // Create Super Admin (If not exists)
  createSuperAdmin();
} catch (error) {
  console.error("Server Initialization Error:", error);
}
