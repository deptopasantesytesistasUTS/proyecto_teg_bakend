import {
  getSemesterByDate,
  createSemester,
  getSemesterbyId,
  editSemesterById,
  getSemesterByDate2,
  editStudentbyCedula,
  editStudentbyCorreo,
  editUserbyCedulaE,
  getMatriculaInfo,
  getStudentById,
  createStudent,
  deleteUserByEmail,
  createUser,
  getStudentListA,
  getUnidadesA,
} from "../models/models_admin.js";

import { getUserByCorreo } from "../models/models_login.js";

export async function getSemesterInfo(req, res) {
  const { fecha } = req.params;
  if (!fecha) {
    return res.status(400).json({ error: "Error en la Fecha" });
  }
  try {
    const semester = await getSemesterByDate(fecha);

    if (!semester) {
      return res.status(401).json({ error: "No hay lapso academico activo" });
    }

    res.json({
      semester: {
        id: semester.id,
        startDate: semester.fechaInicio,
        endDate: semester.fechaFinal,
        titleDeliveryDate: semester.fechaTitulos,
        firstDraftDate: semester.fechaB1,
        secondDraftDate: semester.fechaB2,
        thirdDraftDate: semester.fechaB3,
        finalDraftDate: semester.fechaBFinal,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Error en el servidor" });
  }
}

function convertFecha(fecha) {
  if (isNaN(new Date(fecha + "T00:00:00.000Z"))) return fecha;
  const startOfDayUTC = new Date(fecha + "T00:00:00.000Z");
  // Convert it to an ISO string
  return startOfDayUTC.toISOString();
}

export async function createNewSemester(req, res) {
  const { newSemester } = req.body;
  if (!newSemester) {
    return res.status(400).json({ error: "Error en los datos ingresados" });
  }
  try {
    const comprobacionFechaInicio = await getSemesterByDate(
      newSemester.startDate
    );
    const comprobacionFechaFinal = await getSemesterByDate(newSemester.endDate);

    console.log(comprobacionFechaInicio);
    console.log(comprobacionFechaFinal);

    if (comprobacionFechaFinal || comprobacionFechaInicio) {
      return res.status(400).json({
        error:
          "Las fechas ingresadas generan conflicto con un semestre ya existente",
      });
    }

    const startOfDayUTC = new Date(newSemester.startDate + "T00:00:00.000Z");

    // Convert it to an ISO string
    const startDate = startOfDayUTC.toISOString();

    const endOfDay1 = new Date(newSemester.endDate + "T23:59:59.999Z");

    // Convert it to an ISO string
    const endDate = endOfDay1.toISOString();

    const endOffirstDraftDate = new Date(
      newSemester.finalDraftDate + "T23:59:59.999Z"
    );

    // Convert it to an ISO string
    const firstDraftDate = endOffirstDraftDate.toISOString();

    const endOfsecondDraftDate = new Date(
      newSemester.secondDraftDate + "T23:59:59.999Z"
    );

    // Convert it to an ISO string
    const secondDraftDate = endOfsecondDraftDate.toISOString();

    const endOfthirdDraftDate = new Date(
      newSemester.thirdDraftDate + "T23:59:59.999Z"
    );

    // Convert it to an ISO string
    const thirdDraftDate = endOfthirdDraftDate.toISOString();

    const endOfDayfinalDraftDate = new Date(
      newSemester.finalDraftDate + "T23:59:59.999Z"
    );

    // Convert it to an ISO string
    const finalDraftDate = endOfDayfinalDraftDate.toISOString();

    const endOftitleDeliveryDate = new Date(
      newSemester.titleDeliveryDate + "T23:59:59.999Z"
    );

    // Convert it to an ISO string
    const titleDeliveryDate = endOftitleDeliveryDate.toISOString();

    const semester = await createSemester(
      parseInt(newSemester.id, 10),
      startDate,
      endDate,
      firstDraftDate,
      secondDraftDate,
      thirdDraftDate,
      finalDraftDate,
      titleDeliveryDate
    );

    if (!semester) {
      return res.status(400).json({
        error: "Fallo en la creacion del nuevo semestre",
      });
    }

    res.json({
      semester: semester,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Error en el servidor" });
  }
}

export async function editSemester(req, res) {
  const { editSemester } = req.body;
  if (!editSemester) {
    return res.status(400).json({ error: "Error en los datos ingresados" });
  }
  try {
    const semester = getSemesterbyId(editSemester.id);

    if (!semester) {
      return res.status(400).json({
        error: "El Semestre señalado no existe",
      });
    }

    const editedSemester = await editSemesterById(editSemester.id, {
      fechaInicio: convertFecha(editSemester.startDate),
      fechaFinal: convertFecha(editSemester.endDate),
      fechaB1: convertFecha(editSemester.firstDraftDate),
      fechaB2: convertFecha(editSemester.secondDraftDate),
      fechaB3: convertFecha(editSemester.thirdDraftDate),
      fechaBFinal: convertFecha(editSemester.finalDraftDate),
      fechaTitulos: convertFecha(editSemester.titleDeliveryDate),
    });

    if (!editSemester) {
      return res.status(400).json({
        error: "El Semestre no se pudo editar",
      });
    }

    res.json({
      ok: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Error en el servidor" });
  }
}

function generarCadenaAleatoria(longitud) {
  const caracteresPosibles =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let resultado = "";
  const longitudCaracteres = caracteresPosibles.length;

  for (let i = 0; i < longitud; i++) {
    // Seleccionar un caracter aleatorio del conjunto
    resultado += caracteresPosibles.charAt(
      Math.floor(Math.random() * longitudCaracteres)
    );
  }

  return resultado;
}

export async function putDatosPersonales(req, res) {
  const { estudiante,correo } = req.body;
  if (!estudiante) {
    return res.status(400).json({ error: "Error en los datos ingresados" });
  }
  try {

    const editedStudent = await editStudentbyCorreo(correo,estudiante)

    if (!editedStudent) {
      return res.status(400).json({
        error: "El estudiante no se pudo editar",
      });
    }

    res.json({
      ok: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Error en el servidor" });
  }
}

export async function putCorreo(req, res) {}

export async function putTelf(req, res) {
  const { telf, correo } = req.body;
  if (!telf) {
    return res.status(400).json({ error: "Error en los datos ingresados" });
  }
  try {
    const editedStudent = await editStudentbyCorreo(correo, {
      telf: telf,
    });

    if (!editedStudent) {
      return res.status(400).json({
        error: "El estudiante no se pudo editar",
      });
    }

    res.json({
      ok: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Error en el servidor" });
  }
}

export async function putPassword(req, res) {
  const { cedula } = req.body;
  if (!telf) {
    return res.status(400).json({ error: "Error en los datos ingresados" });
  }
  try {
    const password = generarCadenaAleatoria(8);

    const editedStudent = await editUserbyCedulaE(cedula, {
      password: password,
    });

    if (!editedStudent) {
      return res.status(400).json({
        error: "El estudiante no se pudo editar",
      });
    }

    res.json({
      ok: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Error en el servidor" });
  }
}


export async function postEstudiante(req, res) {
  const estudiante = req.body;

  try {
    const password = generarCadenaAleatoria(8);

    if ((!estudiante.correo, !password)) {
      return res.status(400).json({
        error: "Correo y contraseña son requeridos",
      });
    }

    const user = await createUser(estudiante.correo, password, 3);

    if (!user) {
      return res.status(400).json({
        error: "Error en la creacion del usuario",
      });
    }

    const newStudent = await createStudent(
      parseInt(estudiante.cedula, 10),
      estudiante.nombre1,
      estudiante.nombre2,
      estudiante.apellido1,
      estudiante.apellido2,
      estudiante.telf,
      parseInt(estudiante.carrera, 10),
      user.userId
    );

    if (!newStudent) {
      const deleteUser = await deleteUserByEmail(user.correo);
      return res.status(400).json({
        error: "Error en la creacion del estudiante",
      });
    }

    res.json({
      ok: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Error en el servidor" });
  }
}

export async function getStudentListAdmin(req, res) {
  try {
    const estudiantes = await getStudentListA();

    if (!estudiantes) {
      return res.status(400).json({
        error: "Error en la obtencion del listado de estudiantes",
      });
    }

    res.json({
      estudiantes: estudiantes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Error en el servidor" });
  }
}

export async function getStudentProfile(req,res) {
  const {cedula} = req.params
  try {

    const estudiante = await getStudentById(cedula);

    if (!estudiante) {
      return res.status(400).json({
        error: "Error en la obtencion del estudiante",
      });
    }

    const today = new Date();
    const isoToday = today.toISOString();

    const lapso = await getSemesterByDate(isoToday);

    if (!lapso) {
      return res
        .status(401)
        .json({ error: "Error al obtener lapso academico" });
    }

    const matricula = await getMatriculaInfo(cedula,lapso)

    if (!matricula) {
      return res
        .status(401)
        .json({ error: "Error al obtener la matricula" });
    }



    res.json({
      estudiante: estudiante,
      matricula: matricula,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Error en el servidor" });
  }
}



export async function getUnidadesList(req,res) {
  try {

    const today = new Date();
    const isoToday = today.toISOString();

    const lapso = await getSemesterByDate2(isoToday);

    if (!lapso) {
      return res
        .status(401)
        .json({ error: "Error al obtener lapso academico" });
    }

    const unidades = await getUnidadesA(lapso);

    if (!unidades) {
      return res.status(400).json({
        error: "Error en la obtencion de las unidades",
      });
    }

    res.json({
      unidades: unidades,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Error en el servidor" });
  }
}
