import express from "express";
import { getCareers, getSections } from "../controlers/generalInfo.controller.js";



const router = express.Router();

//getCarreras

router.get("/carreras",getCareers)

//getSecciones
router.get("/secciones/:carrera",getSections)


export default router;
