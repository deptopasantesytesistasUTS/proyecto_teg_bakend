import express from "express";
import * as controllers from "../controlers/controllers.superUsuario.js";

const router = express.Router();

router.post("/superusuario/crearadmin", controllers.crearAdminController);
router.get("/superusuario/administradores", controllers.obtenerAdministradoresController);
router.delete("/superusuario/administradores/:id", controllers.eliminarAdministradorController);

export default router;