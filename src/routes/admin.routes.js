import express from "express";
import { getSemesterInfo,createNewSemester,editSemester} from "../controlers/controllers_admin.js";


const router = express.Router();

//Ingresar nuevo semestre
router.post("/newLapse",createNewSemester)

//Fechas del semestre actual
router.get("/actLapso/:fecha", getSemesterInfo);

//Editar Semestre actual
router.put("/editLapse",editSemester)


export default router;
