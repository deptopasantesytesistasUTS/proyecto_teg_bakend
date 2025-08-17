import express from "express";
import * as controllers from "../controlers/aulavirtualEstudiante.controlers.js";

const router = express.Router();

router.put("/estudiante/titulos",controllers.uploadTitles);
router.get(
  "/estudiante/titulos/:userId/:idMateria",
  controllers.getTitlesAula
);
router.put("/estudiante/urls", controllers.putURLsMatricula);

// Nueva ruta para obtener todos los títulos para el Excel
router.get("/estudiante/titulos-excel", controllers.getAllTitlesForExcel);

export default router; 