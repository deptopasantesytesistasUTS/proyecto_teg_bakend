import express from "express";
import {
  getCareers,
  getSections,
  getSectionsTutor,
} from "../controlers/generalInfo.controller.js";

const router = express.Router();

//getCarreras

router.get("/carreras", getCareers);

//getSecciones
router.get("/secciones/:carrera", getSections);

//
router.get("/seccionesTutor/:carrera", getSectionsTutor);

export default router;
