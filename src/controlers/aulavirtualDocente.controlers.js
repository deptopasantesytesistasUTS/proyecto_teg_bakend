import {
  getEstudiantesPorDocente as getEstudiantesPorDocenteModel,
  crearTutoria,
  obtenerTutorias,
  actualizarTutoria as actualizarTutoriaModel,
  eliminarTutoria as eliminarTutoriaModel,
  registrarAsistencia,
  obtenerAsistenciasPorSeccion,
  getUltimosConectadosPorSeccion,
  getEstadisticasEntregasPorSeccion
} from "../models/aulavirtualDocente.models.js";

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

export async function crearTutoriaController(req, res) {
  try {
    const { fecha, idSeccion } = req.body;
    if (!fecha || !idSeccion) {
      return res.status(400).json({ error: "fecha e idSeccion son requeridos" });
    }
    const nuevaTutoria = await crearTutoria({ fecha, idSeccion });
    res.status(201).json(nuevaTutoria);
  } catch (error) {
    res.status(500).json({ error: "Error al crear la tutoría" });
  }
}

// Nuevo controlador para obtener tutorías
export async function obtenerTutoriasController(req, res) {
  try {
    const { idSeccion } = req.params; // <-- cambia de req.query a req.params
    const tutorias = await obtenerTutorias({ idSeccion });
    res.json(tutorias);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las tutorías" });
  }
}

export async function actualizarTutoriaController(req, res) {
  try {
    const { id } = req.params;
    const { fecha } = req.body;
    if (!fecha) {
      return res.status(400).json({ error: "La fecha es requerida" });
    }
    const tutoriaActualizada = await actualizarTutoriaModel({ id, fecha });
    res.json({ ...tutoriaActualizada, idTutoria: tutoriaActualizada.tutorias_pk });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la tutoría" });
  }
}

export async function eliminarTutoriaController(req, res) {
  try {
    const { id } = req.params;
    await eliminarTutoriaModel(id);
    res.json({ message: "Tutoría eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la tutoría" });
  }
}

export async function crearAsistenciaController(req, res) {
  try {
    const { idTutoria, idEstudiante, asistencia } = req.body;
    if (!idTutoria || !idEstudiante || asistencia === undefined) {
      return res.status(400).json({ error: "idTutoria, idEstudiante y asistencia son requeridos" });
    }
    const result = await registrarAsistencia({ idTutoria, idEstudiante, asistencia });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error al registrar la asistencia" });
  }
}

export async function obtenerAsistenciasController(req, res) {
  try {
    const { idSeccion } = req.params;
    if (!idSeccion) {
      return res.status(400).json({ error: "idSeccion es requerido" });
    }
    const asistencias = await obtenerAsistenciasPorSeccion(idSeccion);
    res.json(asistencias);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener asistencias" });
  }
}

export async function getUltimosConectadosController(req, res) {
  try {
    const { idSeccion } = req.params;
    const { limit } = req.query;
    if (!idSeccion) {
      return res.status(400).json({ error: "idSeccion es requerido" });
    }
    const users = await getUltimosConectadosPorSeccion(idSeccion, limit ?? 5);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener últimos conectados" });
  }
}

export async function getEstadisticasEntregasController(req, res) {
  try {
    const { idSeccion } = req.params;
    if (!idSeccion) {
      return res.status(400).json({ error: "idSeccion es requerido" });
    }
    const stats = await getEstadisticasEntregasPorSeccion(idSeccion);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener estadísticas de entregas" });
  }
}
