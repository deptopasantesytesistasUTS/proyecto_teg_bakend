import express from "express";
import {getDashboardEventsController,getComunicadosByUserId } from "../controlers/dashboard.controller.js";

const router = express.Router();

// Ruta para obtener eventos del calendario
router.get("/dashboard/events", getDashboardEventsController);

// Ruta para obtener comunicados por usuario
router.get("/dashboard/comunicados", getComunicadosByUserId);

export default router; 