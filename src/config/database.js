import mongoose from "mongoose";
import { MONGODB_URI } from "./env.js";

export const connectDatabase = async () => {
  try {
    console.log("\n🔄 Conectando ao MongoDB...");

    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log("✅ MongoDB conectado com sucesso!");
    console.log(`📊 Banco: ${mongoose.connection.db.databaseName}`);
  } catch (error) {
    console.error("❌ Erro ao conectar ao MongoDB:", error.message);
    process.exit(1);
  }
};

// Eventos Mongo
mongoose.connection.on("connected", () => {
  console.log("🟢 Mongoose conectado ao MongoDB");
});

mongoose.connection.on("disconnected", () => {
  console.warn("🟡 Mongo desconectado");
});

mongoose.connection.on("error", (error) => {
  console.error("🔴 Erro no Mongo:", error);
});

export const closeDatabase = async () => {
  try {
    await mongoose.connection.close();
    console.log("🛑 Conexão Mongo encerrada.");
  } catch (err) {
    console.error("❌ Erro ao encerrar Mongo:", err.message);
  }
};
