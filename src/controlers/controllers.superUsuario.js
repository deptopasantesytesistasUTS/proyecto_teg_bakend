import bcrypt from "bcryptjs";
import { crearUsuarioAdmin , buscarRolAdmin } from "../models/superUsuario.models.js";

export async function crearAdminController(req, res) {
  const { correo, password } = req.body;
  if (!correo || !password) {
    return res.status(400).json({ error: "Correo y contraseña son requeridos" });
  }
  try {
    const adminRole = await buscarRolAdmin();
    if (!adminRole) {
      return res.status(400).json({ error: "Rol administrador no existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = await crearUsuarioAdmin({
      correo,
      password: hashedPassword,
      roleId: adminRole.roleId
    });

    res.status(201).json({ ok: true, usuario: nuevoUsuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Error en el servidor" });
  }
}
