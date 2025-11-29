import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js"; // ✔ nome padronizado

class AuthService {
  async register({ name, email, password }) {
    // Verifica se email existe
    const existing = await User.findOne({ email });
    if (existing) {
      throw { status: 400, message: "Email já cadastrado" };
    }

    

    const user = await User.create({
      name,
      email,
      password, // senha pura → será hasheada no pre("save")
    });

    return {
      success: true,
      message: "Usuário registrado com sucesso!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async login({ email, password }) {
    // Verifica se o usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      throw { status: 401, message: "Credenciais inválidas" };
    }

    // Verifica senha
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw { status: 401, message: "Credenciais inválidas" };
    }

    // VERIFICA SE A CHAVE EXISTE NO .env
    if (!process.env.JWT_SECRET) {
      console.error("❌ ERRO: JWT_SECRET não definido no .env!");
      throw { status: 500, message: "Erro interno de autenticação" };
    }

    // Gera token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return {
      success: true,
      message: "Login bem-sucedido!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    };
  }
}

export default new AuthService();
