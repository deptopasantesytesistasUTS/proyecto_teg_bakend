import {getDashboardEvents,getComunicadosByUser,} from "../models/dashboard.models.js";


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
