import express from "express";
import * as controllers from "../controlers/controllers.superUsuario.js";

const router = express.Router();

router.post("/superusuario/crearadmin", controllers.crearAdminController);

export default router;