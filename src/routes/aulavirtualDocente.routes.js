import express from "express";
import { crearTutoriaController, getEstudiantesPorDocente , obtenerTutoriasController , actualizarTutoriaController, eliminarTutoriaController , crearAsistenciaController , obtenerAsistenciasController, getUltimosConectadosController, getEstadisticasEntregasController } from "../controlers/aulavirtualDocente.controlers.js";

const router = express.Router();

// Endpoint para obtener estudiantes inscritos en las clases de un docente
router.get(
  "/estudiantes-por-docente/:cedulaDocente",
  getEstudiantesPorDocente
);

// Endpoint para crear una nueva tutoría (cronograma)
router.post("/tutorias", crearTutoriaController);
router.get("/tutorias/:idSeccion", obtenerTutoriasController);
router.patch("/tutorias/:id", actualizarTutoriaController);
router.delete("/tutorias/:id", eliminarTutoriaController);

//endpoint para asistencias
router.post("/asistencias", crearAsistenciaController);
router.get("/asistencias/:idSeccion", obtenerAsistenciasController);

// informacion 

// Últimos conectados por sección
router.get("/secciones/:idSeccion/ultimos-conectados", getUltimosConectadosController);

// Estadísticas de entregas por sección
router.get("/secciones/:idSeccion/estadisticas-entregas", getEstadisticasEntregasController);

export default router;