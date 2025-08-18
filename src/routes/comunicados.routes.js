import express from "express";
import * as controllers from "../controlers/controllers_aulavirtual.js";

const router = express.Router();

router.put("/comunicados", controllers.putComunicados);
router.get("/comunicados", controllers.getComunicados);
router.get("/comunicados/:id", controllers.getComunicadoById);
router.delete("/comunicados/estudiantes/:idEstudiante", controllers.getComunicadosByEstudiante);

export default router; 