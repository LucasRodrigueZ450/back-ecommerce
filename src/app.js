import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();

// CORS CORRIGIDO
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "ngrok-skip-browser-warning"
  ]
}));

// Para permitir JSON
app.use(express.json());

// Rotas
app.use("/api", routes);

export default app;
