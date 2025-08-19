import { se } from "date-fns/locale";
import { materia_categoria } from "@prisma/client";
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
  createMatricula,
  deleteStudentbyCedula,
  getMateriaCategoria,
  getProfesorParaCurso,
  getCarreraIDByNombre,
  getMateriaID,
  createCourse,
  getDocentebyID,
  getDocentesAdmin,
  createDocente,
  getUserIdByCedulaE,
  setUserActive,
  deleteMatriculaEst,
  createJudge,
  getInfoJudges,
} from "../models/models_admin.js";
import bcryptjs from "bcryptjs";

import { getUserByCorreo, updateCorreo } from "../models/models_login.js";
import transporter from "../../config/nodemailer.js";
import { email } from "zod/v4";

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
        inv2Borrador1: semester.fechaInv2B1,
        inv2Borrador2: semester.fechaInv2B2,
        inv2Borrador3: semester.fechaInv2B3,
        inv2Borrador4: semester.fechaInv2B4,
        inv2BorradorFinal: semester.fechaInv2BFinal,
        tutInicio: semester.fechaTutIni,
        tutFinal: semester.fechaTutFin,
        urlCronograma: semester.urlCronograma,
        cartaDate: semester.fechaGenCarta,
        fechaEntInst: semester.fechaEntInst,
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

    const inv2Borrador1 = convertFecha(newSemester.inv2Borrador1);

    const inv2Borrador2 = convertFecha(newSemester.inv2Borrador2);

    const inv2Borrador3 = convertFecha(newSemester.inv2Borrador3);

    const inv2Borrador4 = convertFecha(newSemester.inv2Borrador4);

    const inv2BorradorFinal = convertFecha(newSemester.inv2BorradorFinal);

    const tutInicio = convertFecha(newSemester.tutInicio);

    const tutFin = convertFecha(newSemester.tutFinal);

    const cartaDate = convertFecha(newSemester.cartaDate);

    const fechaEntInst = convertFecha(newSemester.fechaEntInst);

    const semester = await createSemester(
      parseInt(newSemester.id, 10),
      startDate,
      endDate,
      firstDraftDate,
      secondDraftDate,
      thirdDraftDate,
      finalDraftDate,
      titleDeliveryDate,
      inv2Borrador1,
      inv2Borrador2,
      inv2Borrador3,
      inv2Borrador4,
      inv2BorradorFinal,
      tutInicio,
      tutFin,
      newSemester.urlCronograma,
      cartaDate,
      fechaEntInst
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
      fechaInv2B1: convertFecha(editSemester.inv2Borrador1),
      fechaInv2B2: convertFecha(editSemester.inv2Borrador2),
      fechaInv2B3: convertFecha(editSemester.inv2Borrador3),
      fechaInv2B4: convertFecha(editSemester.inv2Borrador4),
      fechaInv2BFinal: convertFecha(editSemester.inv2BorradorFinal),
      fechaTutIni: convertFecha(editSemester.tutInicio),
      fechaTutFin: convertFecha(editSemester.tutFinal),
      urlCronograma: editSemester.urlCronograma,
      fechaGenCarta: convertFecha(editSemester.cartaDate),
      fechaEntInst: convertFecha(editSemester.fechaEntInst),
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
  const { estudiante, correo } = req.body;
  if (!estudiante) {
    return res.status(400).json({ error: "Error en los datos ingresados" });
  }
  try {
    const editedStudent = await editStudentbyCorreo(correo, estudiante);

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

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const editedStudent = await editUserbyCedulaE(cedula, {
      password: hashedPassword,
    });

    if (!editedStudent) {
      return res.status(400).json({
        error: "El estudiante no se pudo editar",
      });
    }

    await transporter.sendMail({
      from: "UTS San Cristobal",
      to: user.correo,
      subject: `Restaurar Contraseña Usuario UTS San Cristobal`,
      text: ` Buen Día ${editedStudent.nombre1} ${editedStudent.apellido1}, el presente correo le hacemos llegar la contraseña de su usuario para ingresar a la plataforma 
            Password: ${password}
        `,
    });

    res.json({
      ok: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Error en el servidor" });
  }
}

export async function postEstudiante(req, res) {
  const estudiante = req.body.newStudent;

  try {
    const password = generarCadenaAleatoria(8);

    if (!estudiante.correo || !password) {
      return res.status(400).json({
        error: "Correo y contraseña son requeridos",
      });
    }

    let newStudent;
    let user;

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const estudianteAux = await getStudentById(parseInt(estudiante.cedula, 10));

    if (estudianteAux) {
      newStudent = estudianteAux;
    } else {
      user = await createUser(estudiante.correo, hashedPassword, 3);

      if (!user) {
        return res.status(400).json({
          error: "Error en la creacion del usuario",
        });
      }

      newStudent = await createStudent(
        parseInt(estudiante.cedula, 10),
        estudiante.nombre1,
        estudiante.nombre2,
        estudiante.apellido1,
        estudiante.apellido2,
        estudiante.telf,
        parseInt(estudiante.carrera, 10),
        user.userId
      );
    }

    if (!newStudent) {
      const deleteUser = await deleteUserByEmail(user.correo);
      return res.status(400).json({
        error: "Error en la creacion del estudiante",
      });
    }

    const today = new Date();
    const isoToday = today.toISOString();

    const lapso = await getSemesterByDate2(isoToday);

    if (!lapso) {
      return res
        .status(401)
        .json({ error: "Error al obtener lapso academico" });
    }

    const matricula = await createMatricula(
      lapso.id,
      parseInt(estudiante.cedula, 10),
      parseInt(estudiante.seccion)
    );

    if (!matricula) {
      const deleteUser = await deleteUserByEmail(user.correo);
      const deleteStudent = await deleteStudentbyCedula(
        parseInt(estudiante.cedula, 10)
      );
      return res.status(400).json({
        error: "Error en la creacion del estudiante",
      });
    }

    if (
      estudiante.seccion_tutor &&
      !isNaN(parseInt(estudiante.seccion_tutor, 10))
    ) {
      const matriculaTutor = await createMatricula(
        lapso.id,
        parseInt(estudiante.cedula, 10),
        parseInt(estudiante.seccion_tutor, 10)
      );

      if (!matriculaTutor) {
        const deleteUser = await deleteUserByEmail(user.correo);
        const deleteStudent = await deleteStudentbyCedula(
          parseInt(estudiante.cedula, 10)
        );
        return res.status(400).json({
          error: "Error en la creacion del estudiante",
        });
      }
    }

    if (user)
      await transporter.sendMail({
        from: "UTS San Cristobal",
        to: user.correo,
        subject: `Usuario UTS San Cristobal`,
        text: ` Buen Día ${newStudent.nombre1} ${newStudent.apellido1}, el presente correo le hacemos llegar la contraseña de su usuario para ingresar a la plataforma 
              Password: ${password}
          `,
      });

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
    const today = new Date();
    const isoToday = today.toISOString();

    const lapso = await getSemesterByDate2(isoToday);

    if (!lapso) {
      return res
        .status(401)
        .json({ error: "Error al obtener lapso academico" });
    }
    const estudiantes = await getStudentListA(lapso);

    if (!estudiantes) {
      return res.status(400).json({
        error: "Error en la obtencion del listado de estudiantes",
      });
    }

    res.json({
      estudiantes: estudiantes.map((est) => {
        return {
          nombre:
            est.nombre1 +
            " " +
            est.nombre2 +
            " " +
            est.apellido1 +
            " " +
            est.apellido2,
          cedula: est.cedula,
          carrera: est.Carreras.nombre,
          materia: est.Matricula.map((mat) => {
            return mat.Secciones.Materias.categoria;
          }),
          status: est.Users.status,
          email: est.Users.correo,
        };
      }),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Error en el servidor" });
  }
}

export async function getStudentProfile(req, res) {
  const { cedula } = req.params;
  console.log("🔍 getStudentProfile - Cedula recibida:", cedula);
  console.log("🔍 getStudentProfile - Tipo de cedula:", typeof cedula);

  try {
    const estudiante = await getStudentById(parseInt(cedula));
    console.log("🔍 getStudentProfile - Estudiante encontrado:", estudiante);

    if (!estudiante) {
      console.log("🔍 getStudentProfile - Estudiante no encontrado");
      return res.status(404).json({
        error: "Estudiante no encontrado",
      });
    }

    const today = new Date();
    const isoToday = today.toISOString();

    const lapso = await getSemesterByDate2(isoToday);
    console.log("🔍 getStudentProfile - Lapso encontrado:", lapso);

    if (!lapso) {
      console.log("🔍 getStudentProfile - No se encontró lapso académico");
      return res
        .status(401)
        .json({ error: "Error al obtener lapso academico" });
    }

    const matricula = await getMatriculaInfo(parseInt(cedula), lapso.id);
    console.log("🔍 getStudentProfile - Matrícula encontrada:", matricula);

    if (!matricula) {
      console.log("🔍 getStudentProfile - No se encontró matrícula");
      return res.status(401).json({ error: "Error al obtener la matricula" });
    }

    const response = {
      estudiante: estudiante,
      matricula: matricula,
    };
    console.log("🔍 getStudentProfile - Respuesta exitosa:", response);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Error en el servidor" });
  }
}

export async function getUnidadesList(req, res) {
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
      unidades: unidades.map((u) => {
        let cat;
        if (u.Materias.categoria == materia_categoria.Trabajo_Especial_de_Grado)
          cat = "Trabajo de Grado";
        else if (u.Materias.categoria == materia_categoria.investigacion_II)
          cat = "Investigación 2";
        else if (u.Materias.categoria == materia_categoria.Tutorias)
          cat = "Tutorias";
        return {
          nombre: cat,
          carrera: u.Materias.Carreras.nombre,
          profesores:
            u.Personal.nombre1 +
            " " +
            u.Personal.nombre2 +
            " " +
            u.Personal.apellido1 +
            " " +
            u.Personal.apellido2,
          estatus: "activa",
          idSeccion: u.idSeccion,
          correoDocente: u.Personal.Users.correo,
        };
      }),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Error en el servidor" });
  }
}

export async function getProfesorParaCursos(req, res) {
  try {
    const profesores = await getProfesorParaCurso();

    if (!profesores) {
      return res.status(400).json({
        error: "Error en la obtencion de las profesores",
      });
    }

    const resProfesores = profesores.map((profesor) => {
      console.log(profesor);
      return {
        idProfesor: profesor.Personal[0].cedula,
        nombre:
          profesor.Personal[0].nombre1 +
          " " +
          profesor.Personal[0].nombre2 +
          " " +
          profesor.Personal[0].apellido1 +
          " " +
          profesor.Personal[0].apellido2,
      };
    });

    res.json({
      profesores: resProfesores,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Error en el servidor" });
  }
}

export async function postSeccion(req, res) {
  const seccionInfo = req.body;

  try {
    if (!seccionInfo) {
      return res.status(400).json({
        error: "Datos incompletos o corruptos",
      });
    }

    const carrera = await getCarreraIDByNombre(seccionInfo.carrera);

    if (!carrera) {
      return res.status(400).json({
        error: "error al buscar la informacion de la carrera",
      });
    }

    const materia = await getMateriaID(carrera.idCarrera, seccionInfo.nombre);

    if (!materia) {
      return res.status(400).json({
        error: "error al buscar la informacion de la unidad",
      });
    }

    const today = new Date();
    const isoToday = today.toISOString();

    const lapso = await getSemesterByDate2(isoToday);

    if (!lapso) {
      return res
        .status(401)
        .json({ error: "Error al obtener lapso academico" });
    }

    const profesor = await getDocentebyID(parseInt(seccionInfo.profesores));

    if (!profesor) {
      return res
        .status(401)
        .json({ error: "Error al obtener informacion del profesor" });
    }

    const unidades = await getUnidadesA(lapso);
    console.log(lapso);

    const seccion = createCourse({
      idSeccion: parseInt(
        lapso.id +
          "" +
          carrera.idCarrera +
          "" +
          materia.idMateria +
          "" +
          unidades.length
      ),
      lapsoAcac: {
        connect: {
          id: lapso.id, // Conecta la sección al lapso académico con el ID 20252
        },
      },
      Personal: {
        connect: {
          cedula: profesor.cedula, // <-- Corregido. Usa la propiedad de relación 'Personal'
        },
      },
      letra: seccionInfo.letraSeccion,
      Materias: {
        connect: {
          idMateria: materia.idMateria, // <-- Corregido. Usa la propiedad de relación 'Materias'
        },
      },
    });

    if (!seccion) {
      return res.status(400).json({
        error: "Error en la creacion de la seccion",
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

export async function getDocentes(req, res) {
  try {
    const profesores = await getDocentesAdmin();

    if (!profesores) {
      return res.status(400).json({
        error: "Error en la obtencion de las profesores",
      });
    }

    const resProfesores = profesores.map((profesor) => {
      console.log(profesor);
      return {
        cedula: profesor.cedula,
        correo: profesor.Users.correo,
        estatus: profesor.Users.status,
        nombre:
          profesor.nombre1 +
          " " +
          profesor.nombre2 +
          " " +
          profesor.apellido1 +
          " " +
          profesor.apellido2,
      };
    });

    res.json({
      profesores: resProfesores,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Error en el servidor" });
  }
}

export async function postDocente(req, res) {
  const docente = req.body;

  try {
    const password = generarCadenaAleatoria(8);

    if (!docente.email || !password) {
      return res.status(400).json({
        error: "Correo y contraseña son requeridos",
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const user = await createUser(docente.email, hashedPassword, 2);

    if (!user) {
      return res.status(400).json({
        error: "Error en la creacion del usuario",
      });
    }

    const newTeacher = await createDocente(
      parseInt(docente.id),
      docente.firstName,
      docente.secondName,
      docente.firstLastName,
      docente.secondLastName,
      docente.telf,
      user.userId
    );

    if (!newTeacher) {
      const deleteUser = await deleteUserByEmail(user.correo);
      return res.status(400).json({
        error: "Error en la creacion del docente",
      });
    }

    await transporter.sendMail({
      from: "UTS San Cristobal",
      to: user.correo,
      subject: `Usuario UTS San Cristobal`,
      text: ` Buen Día ${newTeacher.nombre1} ${newTeacher.apellido1}, el presente correo le hacemos llegar la contraseña de su usuario para ingresar a la plataforma 
              Password: ${password}
          `,
    });

    res.json({
      ok: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Error en el servidor" });
  }
}

export async function deleteMatricula(req, res) {
  const estudiante = req.body;

  try {
    const today = new Date();
    const isoToday = today.toISOString();

    const lapso = await getSemesterByDate2(isoToday);

    if (!lapso) {
      return res
        .status(401)
        .json({ error: "Error al obtener lapso academico" });
    }

    const user = await getUserIdByCedulaE(parseInt(estudiante.cedula));

    if (user) {
      setUserActive(user.Users.userId, "inactivo");
    }

    await deleteMatriculaEst(lapso.id, parseInt(estudiante.cedula));

    res.json({
      ok: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Error en el servidor" });
  }
}

export async function assignJudges(req, res) {
  const info = req.body;

  try {
    const today = new Date();
    const isoToday = today.toISOString();

    const lapso = await getSemesterByDate2(isoToday);

    if (!lapso) {
      return res
        .status(401)
        .json({ error: "Error al obtener lapso academico" });
    }

    const jurado1 = await createJudge(
      parseInt(info.studentId),
      parseInt(info.judges[0]),
      lapso.id
    );
    const jurado2 = await createJudge(
      parseInt(info.studentId),
      parseInt(info.judges[1]),
      lapso.id
    );
    const jurado3 = await createJudge(
      parseInt(info.studentId),
      parseInt(info.judges[2]),
      lapso.id
    );

    if (!jurado1 || !jurado2 || !jurado3) {
      return res.status(401).json({ error: "Error en la creacion del jurado" });
    }

    res.json({
      ok: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Error en el servidor" });
  }
}

export async function getJudges(req,res) {
  try {
    const { cedulaEst } = req.params;

     const today = new Date();
     const isoToday = today.toISOString();

     const lapso = await getSemesterByDate2(isoToday);


    const judges = await getInfoJudges(parseInt(cedulaEst),lapso.id)



    if (!judges) {
      return res.status(401).json({ error: "Error en la busqueda de informacion de los jueces" });
    }

    console.log(
      {
        nombre:
          judges[0].Personal.nombre1 +
          " " +
          judges[0].Personal.nombre2 +
          " " +
          judges[0].Personal.apellido1 +
          " " +
          judges[0].Personal.apellido2 +
          " ",
        email: judges[0].Personal.Users.correo,
        cedula: judges[0].Personal.cedula,
        telf: judges[0].Personal.telf,
      },
      {
        nombre:
          judges[1].Personal.nombre1 +
          " " +
          judges[1].Personal.nombre2 +
          " " +
          judges[1].Personal.apellido1 +
          " " +
          judges[1].Personal.apellido2 +
          " ",
        email: judges[1].Personal.Users.correo,
        cedula: judges[1].Personal.cedula,
        telf: judges[1].Personal.telf,
      },
      {
        nombre:
          judges[2].Personal.nombre1 +
          " " +
          judges[2].Personal.nombre2 +
          " " +
          judges[2].Personal.apellido1 +
          " " +
          judges[2].Personal.apellido2 +
          " ",
        email: judges[2].Personal.Users.correo,
        cedula: judges[2].Personal.cedula,
        telf: judges[2].Personal.telf,
      }
    );
    
    res.json([
      {
        nombre:
          judges[0].Personal.nombre1 +
          " " +
          judges[0].Personal.nombre2 +
          " " +
          judges[0].Personal.apellido1 +
          " " +
          judges[0].Personal.apellido2 +
          " ",
        email: judges[0].Personal.Users.correo,
        cedula: judges[0].Personal.cedula,
        telf: judges[0].Personal.telf,
      },
      {
        nombre:
          judges[1].Personal.nombre1 +
          " " +
          judges[1].Personal.nombre2 +
          " " +
          judges[1].Personal.apellido1 +
          " " +
          judges[1].Personal.apellido2 +
          " ",
        email: judges[1].Personal.Users.correo,
        cedula: judges[1].Personal.cedula,
        telf: judges[1].Personal.telf,
      },
      {
        nombre:
          judges[2].Personal.nombre1 +
          " " +
          judges[2].Personal.nombre2 +
          " " +
          judges[2].Personal.apellido1 +
          " " +
          judges[2].Personal.apellido2 +
          " ",
        email: judges[2].Personal.Users.correo,
        cedula: judges[2].Personal.cedula,
        telf: judges[2].Personal.telf,
      },
    ]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Error en el servidor" });
  }
}
