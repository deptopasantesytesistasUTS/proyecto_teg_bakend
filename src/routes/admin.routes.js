import express from "express";
import {
  getSemesterInfo,
  createNewSemester,
  editSemester,
  postEstudiante,
  getStudentListAdmin,
  getStudentProfile,
  putDatosPersonales,
  putCorreo,
  putTelf,
  putPassword,
  getUnidadesList,
} from "../controlers/controllers_admin.js";

const router = express.Router();

//Ingresar nuevo semestre
router.post("/newLapse", createNewSemester);

//Fechas del semestre actual
router.get("/actLapso/:fecha", getSemesterInfo);

//Editar Semestre actual
router.put("/editLapse", editSemester);

//postEstudiante
router.post("/estudiante", postEstudiante)

//getEstudiantesList
router.get("/estudiantesA",getStudentListAdmin)

//getEstudiante

//getStudentProfile
router.get("estudiantePerfil/:cedula",getStudentProfile)

//putDatosPersonales
router.put("/estudianteData",putDatosPersonales)

//putCorreo
router.put("/estudianteCorreo",putCorreo)

//putTelefono
router.put("/estudianteTelf",putTelf)

//put contraseña
router.put("/estudiantePassword",putPassword)

//getMateria
router.get("/UnidadesListA",getUnidadesList)

//asignar jueces


//elegir titulos


//estado de los borradores




export default router;
