import express from "express";
import {getDashboardEventsController,getComunicadosByUserId,getConnectedUsersController } from "../controlers/dashboard.controller.js";

const router = express.Router();

// Ruta para obtener eventos del calendario
router.get("/dashboard/events", getDashboardEventsController);

// Ruta para obtener comunicados por usuario
router.get("/dashboard/comunicados", getComunicadosByUserId);

// Ruta para obtener usuarios conectados
router.get("/dashboard/connected-users", getConnectedUsersController);

// Ruta de prueba para verificar el estado de la base de datos
router.get("/dashboard/test", async (req, res) => {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    // Verificar conexión a la base de datos
    await prisma.$connect();
    
    // Contar registros en diferentes tablas
    const comunicadosCount = await prisma.Comunicados.count();
    const lapsoCount = await prisma.lapsoAcac.count();
    const lapsoData = await prisma.lapsoAcac.findMany({
      take: 3,
      orderBy: { fechaInicio: 'desc' }
    });
    
    res.json({
      status: 'OK',
      database: 'Connected',
      counts: {
        comunicados: comunicadosCount,
        lapsos: lapsoCount
      },
      latestLapsos: lapsoData,
      timestamp: new Date().toISOString()
    });
    
    await prisma.$disconnect();
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router; 