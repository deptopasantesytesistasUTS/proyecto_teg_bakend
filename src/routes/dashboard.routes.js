import express from "express";
import {getDashboardEventsController,getComunicadosByUserId,getConnectedUsersController } from "../controlers/dashboard.controller.js";

const router = express.Router();

// Ruta para obtener eventos del calendario
router.get("/dashboard/events", getDashboardEventsController);

// Ruta para obtener comunicados por usuario
router.get("/dashboard/comunicados", getComunicadosByUserId);

// Ruta para obtener usuarios conectados
router.get("/dashboard/connected-users", getConnectedUsersController);

export default router; 