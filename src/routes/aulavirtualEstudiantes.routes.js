import express from "express";
import * as controllers from "../controlers/aulavirtualEstudiante.controlers.js";

const router = express.Router();


 router.put("/estudiante/titulos",controllers.uploadTitles);

 router.get(
   "/estudiante/titulos/:userId/:idMateria",
   controllers.getTitlesAula
 );

 router.put("/estudiante/archivos",controllers.putURLsMatricula);

 router.get("/estudiante/profile/:userId/:idMateria",controllers.getStudentData);

 router.get("/estudiante/archivos/:userId/:idMateria",controllers.getEnlacesEntregados);

 router.get(
   "/estudianteAdm/archivos/:cedula/:idMateria",
   controllers.getEnlacesEntregadosAdm
 );


// Nueva ruta para obtener todos los títulos para el Excel
router.get("/estudiante/titulos-excel", controllers.getAllTitlesForExcel);

export default router; 