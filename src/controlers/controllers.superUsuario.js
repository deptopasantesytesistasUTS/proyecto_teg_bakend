import bcrypt from "bcryptjs";
import { crearUsuarioAdmin, buscarRolAdmin, obtenerAdministradores, eliminarAdministrador } from "../models/superUsuario.models.js";

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

export async function obtenerAdministradoresController(req, res) {
  try {
    console.log("Obteniendo administradores...");
    const administradores = await obtenerAdministradores();
    console.log("Administradores encontrados:", administradores);
    res.status(200).json(administradores);
  } catch (error) {
    console.error("Error en obtenerAdministradoresController:", error);
    res.status(500).json({ error: error.message || "Error al obtener administradores" });
  }
}

export async function eliminarAdministradorController(req, res) {
  const { id } = req.params;
  console.log("Eliminando administrador con ID:", id);
  console.log("Tipo de ID:", typeof id);
  
  if (!id || isNaN(parseInt(id))) {
    console.error("ID inválido:", id);
    return res.status(400).json({ error: "ID de administrador inválido" });
  }
  
  try {
    await eliminarAdministrador(id);
    console.log("Administrador eliminado exitosamente");
    res.status(200).json({ ok: true, message: "Administrador eliminado exitosamente" });
  } catch (error) {
    console.error("Error en eliminarAdministradorController:", error);
    res.status(500).json({ error: error.message || "Error al eliminar administrador" });
  }
}
