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
router.get("/cedula-estudiante", controllers.getCedulaEstudianteController);
// Ruta para obtener participantes de una sección (docente y estudiantes)
router.get("/secciones/:idSeccion/participantes", controllers.getParticipantesBySeccionController);

export default router; 