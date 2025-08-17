import express from "express";
import * as controllers from "../controlers/aulavirtualEstudiante.controlers.js";

const router = express.Router();

 router.put("/estudiante/titulos",controllers.uploadTitles);

 router.get(
   "/estudiante/titulos/:userId/:idMateria",
   controllers.getTitlesAula
 );

 router.put("/estudiante/archivos",controllers.putURLsMatricula);

 router.get("/user/estudiante/profile/:userId",);


export default router; 