import express from "express";
import {
  getDashboardStatistics,
  getDashboardEventsController,
  getMateriasByUserId,
  getComunicadosByUserId,
  getTutoriasByUserId
} from "../controlers/dashboard.controller.js";

const router = express.Router();

// Ruta para obtener estadísticas generales del dashboard
router.get("/dashboard/stats", getDashboardStatistics);

// Ruta para obtener eventos del calendario
router.get("/dashboard/events", getDashboardEventsController);

// Ruta para obtener materias por usuario
router.get("/dashboard/materias", getMateriasByUserId);

// Ruta para obtener comunicados por usuario
router.get("/dashboard/comunicados", getComunicadosByUserId);

// Ruta para obtener tutorías por usuario
router.get("/dashboard/tutorias", getTutoriasByUserId);

export default router; 