import {
  getMateriasWithAulaVirtual,
  getMateriaByIdWithAulaVirtual,
  getMateriasDashboard,
  getCedulaPersonalByUserId,
  getParticipantesBySeccion,
  getComunicados,
  createComunicado,
  updateComunicado,
  deleteComunicado,
} from "../models/models_aulavirtual.js";

import { getSemesterByDate2 } from "../models/models_admin.js";

// Controlador para obtener todas las materias con sus secciones (aula virtual)
export async function getMateriasAulaVirtual(req, res) {
  try {
    const materias = await getMateriasWithAulaVirtual();
    console.log("Materias Aula Virtual:", JSON.stringify(materias, null, 2));
    res.json(materias);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener materias" });
  }
}

// Controlador para obtener una materia por id con sus secciones (aula virtual)
export async function getMateriaAulaVirtualById(req, res) {
  try {
    const { id } = req.params;
    const materia = await getMateriaByIdWithAulaVirtual(id);
    if (!materia)
      return res.status(404).json({ error: "Materia no encontrada" });
    res.json(materia);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la materia" });
  }
}

// Controlador para obtener solo el listado de materias para el dashboard
export async function getMateriasDashboardController(req, res) {
  try {
    const { userId, role } = req.query;
    if (!userId || !role) {
      return res.status(400).json({ error: "userId y role son requeridos" });
    }
    const today = new Date();
    const isoToday = today.toISOString();

    const lapso = await getSemesterByDate2(isoToday);
    
    const materias = await getMateriasDashboard(userId, role, lapso.id);
    res.json(materias);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error al obtener materias para dashboard" });
  }
}

// Controlador para obtener la cédula de un usuario en la tabla Personal
export async function getCedulaPersonalController(req, res) {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "userId es requerido" });
    }
    const cedula = await getCedulaPersonalByUserId(userId);
    res.json({ cedula });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la cédula" });
  }
}

// Controlador para obtener participantes de una sección
export async function getParticipantesBySeccionController(req, res) {
  try {
    const { idSeccion } = req.params;
    const participantes = await getParticipantesBySeccion(idSeccion);
    res.json(participantes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener participantes" });
  }
}

// ================= Comunicados (CRUD) =================

export async function getComunicadosController(req, res) {
  try {
    const { seccionId, limit } = req.query;
    const comunicados = await getComunicados({ seccionId, limit });
    res.json(comunicados);
  } catch (error) {
    console.error("Error en getComunicadosController:", error);
    res.status(500).json({ error: "Error al obtener comunicados" });
  }
}

export async function postComunicadosController(req, res) {
  try {
    const { titulo, texto, idUsuario, seccionesIds } = req.body;
    if (!titulo || !texto) {
      return res.status(400).json({ error: "titulo y texto son requeridos" });
    }
    const comunicado = await createComunicado({ titulo, texto, idUsuario, seccionesIds });
    res.status(201).json(comunicado);
  } catch (error) {
    console.error("Error en postComunicadosController:", error);
    res.status(500).json({ error: "Error al crear comunicado" });
  }
}

export async function putComunicadosController(req, res) {
  try {
    const { id } = req.params;
    const { titulo, texto } = req.body;
    const comunicado = await updateComunicado(id, { titulo, texto });
    res.json(comunicado);
  } catch (error) {
    console.error("Error en putComunicadosController:", error);
    res.status(500).json({ error: "Error al actualizar comunicado" });
  }
}

export async function deleteComunicadosController(req, res) {
  try {
    const { id } = req.params;
    await deleteComunicado(id);
    res.json({ ok: true });
  } catch (error) {
    console.error("Error en deleteComunicadosController:", error);
    res.status(500).json({ error: "Error al eliminar comunicado" });
  }
}
