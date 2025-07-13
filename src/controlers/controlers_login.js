import prisma from "../prisma.js";
import { generarToken } from "../authentication.js";
import { getUserByCorreo } from "../models/models_login.js";

export async function loginUser(req, res) {
  const { correo, password } = req.body;
  if (!correo || !password) {
    return res.status(400).json({ error: "Correo y contraseña son requeridos" });
  }
  try {
    const user = await getUserByCorreo(correo);
    if (!user) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }
    // Comparación simple, en producción usa hash
    if (user.password !== password) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }
    // Incluye el rol en el token
    const token = generarToken({ userId: user.userId, role: user.role_id, correo: user.correo });
    res.json({ token, user: { userId: user.userId, correo: user.correo, role: user.role_id } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
}
