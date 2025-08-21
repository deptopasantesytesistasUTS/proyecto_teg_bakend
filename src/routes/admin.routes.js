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
  getProfesorParaCursos,
  postSeccion,
  getDocentes,
  postDocente,
  deleteMatricula,
  assignJudges,
  getJudges,
  putAccess,
  putTitleA,
} from "../controlers/controllers_admin.js";

const router = express.Router();

//Ingresar nuevo semestre
router.post("/newLapse", createNewSemester);

//Fechas del semestre actual
router.get("/actLapso/:fecha", getSemesterInfo);

//Editar Semestre actual
router.put("/editLapse", editSemester);

//postEstudiante
router.post("/estudiante", postEstudiante);

//getEstudiantesList
router.get("/estudiantesA", getStudentListAdmin);

//getEstudiante

//getStudentProfile
router.get("/estudiantePerfil/:cedula", getStudentProfile);

//getStudentProfileSimple - versión simplificada para pruebas
router.get("/estudiantePerfilSimple/:cedula", async (req, res) => {
  const { cedula } = req.params;
  console.log("🔍 getStudentProfileSimple - Cedula recibida:", cedula);

  try {
    const { getStudentById } = await import("../models/models_admin.js");
    const estudiante = await getStudentById(cedula);

    if (!estudiante) {
      return res.status(404).json({
        error: "Estudiante no encontrado",
        cedula: cedula,
      });
    }

    res.json({
      estudiante: estudiante,
      message: "Datos básicos del estudiante",
    });
  } catch (error) {
    console.error("🔍 getStudentProfileSimple - Error:", error);
    res.status(500).json({
      error: "Error interno del servidor",
      details: error.message,
    });
  }
});

//getAllStudents - para listar todos los estudiantes y verificar datos
router.get("/todosEstudiantes", async (req, res) => {
  try {
    const { prisma } = await import("../prisma.js");
    const estudiantes = await prisma.estudiantes.findMany({
      select: {
        cedula: true,
        nombre1: true,
        nombre2: true,
        apellido1: true,
        apellido2: true,
        telf: true,
        Carreras: {
          select: {
            nombre: true,
          },
        },
      },
      take: 10, // Solo los primeros 10 para no sobrecargar
    });

    res.json({
      estudiantes: estudiantes,
      total: estudiantes.length,
      message: "Lista de estudiantes (primeros 10)",
    });
  } catch (error) {
    console.error("🔍 getAllStudents - Error:", error);
    res.status(500).json({
      error: "Error interno del servidor",
      details: error.message,
    });
  }
});

//putDatosPersonales
router.put("/estudianteData", putDatosPersonales);

//putCorreo
router.put("/estudianteCorreo", putCorreo);

//putTelefono
router.put("/estudianteTelf", putTelf);

//put contraseña
router.put("/estudiantePassword", putPassword);

//getMateria
router.get("/UnidadesListA", getUnidadesList);

//asignar jueces
router.post("/admin/asignar-jurados", assignJudges);

//get jueces

router.get("/jurados/:cedulaEst", getJudges);

//elegir titulos

//estado de los borradores

//obtener profesores para la lista de carreras
router.get("/profesoresUnidades", getProfesorParaCursos);

//obtener Listado de profesores
router.get("/docentesAdmin", getDocentes);

//crear docente
router.post("/docentesAdmin", postDocente);

//crear curso
router.post("/secciones", postSeccion);

//borrar Matriculas
router.delete("/matriculas", deleteMatricula);

router.put("/estudiante/changeInfo", putDatosPersonales);

router.put("/estudiante/changeTelf", putTelf);

router.put("/estudiante/changeCorreo", putCorreo);

router.put("/estudiante/restorePassword",putPassword);

router.put("/estudiante/setAccess", putAccess);

router.put("/estudiante/assign-Title",putTitleA);

export default router;
