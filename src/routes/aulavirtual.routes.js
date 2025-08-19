import express from "express";
import * as controllers from "../controlers/controllers_aulavirtual.js";

const router = express.Router();

// Ruta para obtener todas las materias con sus secciones (aula virtual)
router.get("/materias-aulavirtual", controllers.getMateriasAulaVirtual);
// Ruta para obtener una materia por id con sus secciones (aula virtual)
router.get("/materias-aulavirtual/:id", controllers.getMateriaAulaVirtualById);
// Ruta para obtener solo el listado de materias para el dashboard
router.get("/materias-dashboard", controllers.getMateriasDashboardController);
// Ruta para obtener la cédula de un usuario en la tabla Personal
router.get("/cedula-personal", controllers.getCedulaPersonalController);
// Ruta para obtener la cédula de un estudiante en la tabla Estudiantes
router.get("/secciones/:idSeccion/participantes", controllers.getParticipantesBySeccionController);

// comunicados (get , post , put , delete)
router.get("/comunicados", controllers.getComunicadosController);
router.post("/comunicados", controllers.postComunicadosController);
router.put("/comunicados/:id", controllers.putComunicadosController);
router.delete("/comunicados/:id", controllers.deleteComunicadosController);

export default router; 