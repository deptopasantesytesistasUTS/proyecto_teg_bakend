import express from "express";
import * as controllers from "../controlers/aulavirtualDocente.controlers.js";

const router = express.Router();

// Endpoint para obtener estudiantes inscritos en las clases de un docente
router.get(
  "/estudiantes-por-docente/:cedulaDocente",
  controllers.getEstudiantesPorDocente
);

export default router;
