import {
  getDashboardStats,
  getDashboardEvents,
  getMateriasByUser,
  getComunicadosByUser,
  getTutoriasByUser
} from "../models/dashboard.models.js";

// Obtener estadísticas generales del dashboard
export async function getDashboardStatistics(req, res) {
  try {
    const stats = await getDashboardStats();
    
    if (!stats) {
      return res.status(500).json({ error: "Error al obtener estadísticas del dashboard" });
    }

    res.json(stats);
  } catch (error) {
    console.error("Error en getDashboardStatistics:", error);
    res.status(500).json({ error: error.message || "Error en el servidor" });
  }
}

// Obtener eventos del calendario para el dashboard
export async function getDashboardEventsController(req, res) {
  try {
    const { userId, role } = req.query;
    
    if (!userId || !role) {
      return res.status(400).json({ error: "userId y role son requeridos" });
    }

    const events = await getDashboardEvents(userId, parseInt(role));
    
    if (!events) {
      return res.status(500).json({ error: "Error al obtener eventos del dashboard" });
    }

    res.json(events);
  } catch (error) {
    console.error("Error en getDashboardEventsController:", error);
    res.status(500).json({ error: error.message || "Error en el servidor" });
  }
}

// Obtener materias por usuario (estudiante o profesor)
export async function getMateriasByUserId(req, res) {
  try {
    const { userId, role } = req.query;
    
    if (!userId || !role) {
      return res.status(400).json({ error: "userId y role son requeridos" });
    }

    const materias = await getMateriasByUser(userId, parseInt(role));
    
    if (!materias) {
      return res.status(500).json({ error: "Error al obtener materias del usuario" });
    }

    res.json(materias);
  } catch (error) {
    console.error("Error en getMateriasByUserId:", error);
    res.status(500).json({ error: error.message || "Error en el servidor" });
  }
}

// Obtener comunicados por usuario
export async function getComunicadosByUserId(req, res) {
  try {
    const { userId, role } = req.query;
    
    if (!userId || !role) {
      return res.status(400).json({ error: "userId y role son requeridos" });
    }

    const comunicados = await getComunicadosByUser(userId, parseInt(role));
    
    if (!comunicados) {
      return res.status(500).json({ error: "Error al obtener comunicados del usuario" });
    }

    res.json(comunicados);
  } catch (error) {
    console.error("Error en getComunicadosByUserId:", error);
    res.status(500).json({ error: error.message || "Error en el servidor" });
  }
}

// Obtener tutorías por usuario
export async function getTutoriasByUserId(req, res) {
  try {
    const { userId, role } = req.query;
    
    if (!userId || !role) {
      return res.status(400).json({ error: "userId y role son requeridos" });
    }

    const tutorias = await getTutoriasByUser(userId, parseInt(role));
    
    if (!tutorias) {
      return res.status(500).json({ error: "Error al obtener tutorías del usuario" });
    }

    res.json(tutorias);
  } catch (error) {
    console.error("Error en getTutoriasByUserId:", error);
    res.status(500).json({ error: error.message || "Error en el servidor" });
  }
} 