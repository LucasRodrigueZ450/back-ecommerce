import app from "./app.js";
import { PORT } from "./config/env.js";
import { connectDatabase } from "./config/database.js";
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (err) {
    console.error("Erro ao iniciar servidor:", err);
    process.exit(1);
  }
};

startServer();
