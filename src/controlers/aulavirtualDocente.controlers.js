import { getEstudiantesPorDocente as getEstudiantesPorDocenteModel } from "../models/aulavirtualDocente.models.js";

export async function getEstudiantesPorDocente(req, res) {
  try {
    const { cedulaDocente } = req.params;
    if (!cedulaDocente) {
      return res.status(400).json({ error: "cedulaDocente es requerida" });
    }
    const estudiantes = await getEstudiantesPorDocenteModel(cedulaDocente);
    res.json(estudiantes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener estudiantes por docente" });
  }
} 