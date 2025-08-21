import { materia_categoria } from "@prisma/client";
import prisma from "../prisma.js";
import { id } from "date-fns/locale";

export async function getSemesterByDate(fecha) {
  const startOfDayUTC = new Date(fecha + "T00:00:00.000Z");

  // Convert it to an ISO string
  const isoStartOfDay = startOfDayUTC.toISOString();

  // Create a Date object for the end of the day in UTC
  const endOfDayUTC = new Date(fecha + "T23:59:59.999Z");

  // Convert it to an ISO string
  const isoEndOfDay = endOfDayUTC.toISOString();

  return prisma.lapsoAcac.findFirst({
    where: {
      fechaInicio: { lte: isoStartOfDay },
      fechaFinal: { gte: isoEndOfDay },
    },
  });
}

export async function getSemesterByDate2(fecha) {
  return prisma.lapsoAcac.findFirst({
    where: {
      fechaInicio: { lte: fecha },
      fechaFinal: { gte: fecha },
    },
  });
}

export async function getSemesterbyId(id) {
  return prisma.lapsoAcac.findFirst({
    where: { id: id },
  });
}

export async function createSemester(
  id,
  fechaInicio,
  fechaFinal,
  fechaB1,
  fechaB2,
  fechaB3,
  fechaBFinal,
  fechaTitulos,
  fechaInv2B1,
  fechaInv2B2,
  fechaInv2B3,
  fechaInv2B4,
  fechaTutIni,
  fechaTutFin,
  urlCronograma,
  fechaGenCarta,
  fechaEntInst
) {
  return prisma.lapsoAcac.create({
    data: {
      id: id,
      fechaInicio: fechaInicio,
      fechaFinal: fechaFinal,
      fechaB1: fechaB1,
      fechaB2: fechaB2,
      fechaB3: fechaB3,
      fechaBFinal: fechaBFinal,
      fechaTitulos: fechaTitulos,
      fechaInv2B1: fechaInv2B1,
      fechaInv2B2: fechaInv2B2,
      fechaInv2B3: fechaInv2B3,
      fechaInv2B4: fechaInv2B4,
      fechaTutIni: fechaTutIni,
      fechaTutFin: fechaTutFin,
      urlCronograma: urlCronograma,
      fechaGenCarta: fechaGenCarta,
      fechaEntInst: fechaEntInst,
    },
  });
}

export async function editSemesterById(id, updateData) {
  return prisma.lapsoAcac.update({
    where: {
      id: id,
    },
    data: {
      ...updateData,
    },
  });
}

export async function createUser(correo, password, role_id) {
  return prisma.users.create({
    data: {
      password: password,
      role_id: role_id,
      status: "activo",
      correo: correo,
    },
  });
}

export async function createMatricula(lapso, cedula, seccion) {
  return prisma.matricula.create({
    data: {
      idSeccion: seccion,
      idEstudiante: cedula,
      lapsoAcac: lapso,
    },
  });
}

export async function deleteUserByEmail(correo) {
  return prisma.users.delete({
    where: {
      correo: correo,
    },
  });
}

export async function deleteStudentbyCedula(cedula) {
  return prisma.estudiantes.delete({
    where: {
      cedula: cedula,
    },
  });
}

export async function createStudent(
  cedula,
  nombre1,
  nombre2,
  apellido1,
  apellido2,
  telf,
  localidad,
  idCarrera,
  idUsuario
) {
  return prisma.estudiantes.create({
    data: {
      cedula: cedula,
      nombre1: nombre1,
      nombre2: nombre2,
      apellido1: apellido1,
      apellido2: apellido2,
      telf: telf,
      localidad: localidad,
      idCarrera: idCarrera,
      idUsuario: idUsuario,
    },
  });
}

export async function updateTitleAs(
  tituloAsignado,
  cedula,
  lapso,
  materiaId
) {
  // Step 1: Find the unique `matricula` record that matches all the filters.
  // We use `findFirst` with the complex, nested `where` clause here. This is the correct
  // place for using the `some` operator to traverse a to-many relationship like `Secciones`.
  // The `idEstudiante` field is a direct filter, which simplifies the query.
  const matricula = await prisma.matricula.findFirst({
    where: {
      lapsoAcac: lapso,
      // The `cedula` parameter should correspond to the `idEstudiante` field.
      idEstudiante: cedula,
      // The `is` operator is used here because `Secciones` is likely a one-to-one relationship
      // with `matricula` in your schema.
      Secciones: {
        is: {
          Materias: {
            // Materias is likely a one-to-one or one-to-many relationship with Secciones
            is: {
              idMateria: materiaId,
            },
          },
        },
      },
    },
    // We only need the unique ID of the record to perform the update.
    select: {
      idMatricula: true, // Replace with your actual primary key field
    },
  });

  // If no matching `matricula` record is found, we should handle this gracefully.
  // This prevents the code from trying to update a non-existent record.
  if (!matricula) {
    throw new Error(
      "Matricula record not found for the given student, lapso, and materiaId."
    );
  }

  // Step 2: Now, use the found unique ID to perform the update.
  // The `update` method's `where` clause should only use the primary key for the most
  // efficient and direct update. This avoids the "Unknown argument some" error.
  return prisma.matricula.update({
    data: {
      tituloElegido: tituloAsignado
    },
    where: {
      // Use the unique ID of the record we just found in Step 1.
      idMatricula: matricula.idMatricula, // Replace with your actual primary key field
    },
  });
}

export async function getStudentById(cedula) {
  return prisma.estudiantes.findFirst({
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
      Users: {
        select: {
          userId: true,
          correo: true,
          status: true,
        },
      },
      Carreras: {
        select: {
          nombre: true,
        },
      },
    },
    where: {
      cedula: cedula,
    },
  });
}


export async function getTeacherById(cedula) {
  return prisma.personal.findFirst({
    select: {
      cedula: true,
      nombre1: true,
      nombre2: true,
      apellido1: true,
      apellido2: true,
      telf: true,
      Users: {
        select: {
          userId: true,
          correo: true,
          status: true,
        },
      },
    },
    where: {
      cedula: cedula,
    },
  });
}

export async function getMatriculaInfo(cedula, lapso) {
  return prisma.matricula.findMany({
    select: {
      idMatricula: true,
      titulo1: true,
      titulo2: true,
      titulo3: true,
      tituloElegido: true,
      Secciones: {
        select: {
          Materias: {
            select: {
              categoria: true,
              idMateria: true,
            },
          },
        },
      },
    },
    where: {
      idEstudiante: cedula,
      lapsoAcac: lapso,
    },
  });
}

export async function getMateriaCategoria(seccion) {
  return prisma.secciones.findFirst({
    select: {
      Materias: {
        select: {
          categoria: true,
        },
      },
    },
    where: {
      idSeccion: seccion,
    },
  });
}

export async function editUserbyCedulaE(cedula, updateData) {
  return prisma.users.update({
    where: {
      Estudiantes: {
        where: {
          cedula: cedula,
        },
      },
    },
    data: {
      ...updateData,
    },
  });
}

export async function editUserbyId(id, updateData) {
  return prisma.users.update({
    where: {
      userId: id,
    },
    data: {
      ...updateData,
    },
  });
}

export async function editStudentbyCorreo(correo, updateData) {
  return prisma.estudiantes.update({
    where: {
      Users: {
        is: {
          correo: correo,
        },
      },
    },
    data: {
      ...updateData,
    },
  });
}

export async function editStudentbyCedula(cedula, updateData) {
  return prisma.estudiantes.update({
    where: {
      cedula: cedula,
    },
    data: {
      ...updateData,
    },
  });
}

export async function editPersonalbyCedula(cedula, updateData) {
  return prisma.personal.update({
    where: {
      cedula: cedula,
    },
    data: {
      ...updateData,
    },
  });
}

export async function getStudentListA(lapso) {
  return prisma.estudiantes.findMany({
    select: {
      cedula: true,
      nombre1: true,
      nombre2: true,
      apellido1: true,
      apellido2: true,
      localidad: true,
      Carreras: {
        select: {
          nombre: true,
        },
      },
      Users: {
        select: {
          status: true,
          correo: true,
        },
      },
      Matricula: {
        select: {
          Secciones: {
            select: {
              Materias: {
                select: {
                  categoria: true,
                },
              },
            },
          },
        },
      },
    },
    where: {
      Matricula: {
        some: {
          lapsoAcac: lapso.id,
        },
      },
    },
  });
}

export async function getUnidadesA(lapso) {
  return prisma.secciones.findMany({
    select: {
      idSeccion: true,

      Personal: {
        select: {
          cedula: true,
          nombre1: true,
          nombre2: true,
          apellido1: true,
          apellido2: true,
          Users: {
            select: {
              correo: true,
            },
          },
        },
      },
      Materias: {
        select: {
          categoria: true,
          Carreras: {
            select: {
              nombre: true,
            },
          },
        },
      },
    },
    where: {
      lapsoAcac: lapso,
    },
  });
}

export async function getProfesorParaCurso() {
  return prisma.users.findMany({
    select: {
      Personal: {
        select: {
          cedula: true,
          nombre1: true,
          nombre2: true,
          apellido1: true,
          apellido2: true,
        },
      },
    },
    where: {
      role_id: 2,
      status: "activo",
    },
  });
}

export async function createCourse(data) {
  return prisma.secciones.create({
    data: data,
  });
}

export async function getCarreraIDByNombre(nombre) {
  return prisma.carreras.findFirst({
    select: {
      idCarrera: true,
    },
    where: {
      nombre: nombre,
    },
  });
}

export async function getMateriaID(carrera, categoria) {
  let cat;

  console.log(categoria);

  if (categoria == "Trabajo Especial de Grado")
    cat = materia_categoria.Trabajo_Especial_de_Grado;
  else if (categoria == "investigación II")
    cat = materia_categoria.investigacion_II;
  else if (categoria == "Tutorias") cat = materia_categoria.Tutorias;

  console.log(cat);

  return prisma.materias.findFirst({
    select: {
      idMateria: true,
    },
    where: {
      idCarrera: carrera,
      categoria: cat,
    },
  });
}

export async function getDocentebyID(cedula) {
  return prisma.personal.findFirst({
    select: {
      cedula: true,
      Users: {
        select: {
          correo: true,
        },
      },
    },
    where: {
      cedula: cedula,
    },
  });
}

export async function getDocentesAdmin() {
  return prisma.personal.findMany({
    select: {
      cedula: true,
      nombre1: true,
      nombre2: true,
      apellido1: true,
      apellido2: true,
      localidad: true,
      Users: {
        select: {
          correo: true,
          status: true,
        },
      },
    },
  });
}

export async function createDocente(
  cedula,
  nombre1,
  nombre2,
  apellido1,
  apellido2,
  telf,
  localidad,
  userID
) {
  return prisma.personal.create({
    data: {
      cedula: cedula,
      nombre1: nombre1,
      nombre2: nombre2,
      apellido1: apellido1,
      apellido2: apellido2,
      userID: userID,
      telf: telf,
      localidad: localidad,
    },
  });
}

export async function getUserIdByCedulaE(cedula) {
  return prisma.estudiantes.findFirst({
    where: {
      cedula: cedula,
    },
    select: {
      nombre1: true,
      apellido1: true,
      Users: {
        select: {
          userId: true,
          correo: true,
        },
      },
    },
  });
}

export async function getUserIdByCedulaP(cedula) {
  return prisma.personal.findFirst({
    where: {
      cedula: cedula,
    },
    select: {
      nombre1: true,
      apellido1: true,
      Users: {
        select: {
          userId: true,
          correo: true,
        },
      },
    },
  });
}

export async function setUserActive(id, active) {
  return prisma.users.update({
    where: {
      userId: id,
    },
    data: {
      status: active,
    },
  });
}

export async function deleteMatriculaEst(lapso, cedula) {
  return prisma.matricula.deleteMany({
    where: {
      idEstudiante: cedula,
      lapsoAcac: lapso,
    },
  });
}

export async function createJudge(cedulaEst, cedulaJur, lapso) {
  try {
    return await prisma.jurados.create({
      data: {
        lapso: lapso,
        Estudiantes: {
          connect: {
            cedula: cedulaEst,
          },
        },
        Personal: {
          connect: {
            cedula: cedulaJur,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error al crear el jurado:", error);
    throw error;
  }
}

export async function deleteJudgesEst(cedulaEst, lapso) {
  return prisma.jurados.delete({
    where: {
      cedulaEstudiante: cedulaEst,
      lapso: lapso,
    },
  });
}

export async function updateJudges(cedulaEst, cedulaJur, cedulaJur2, lapso) {
  return prisma.jurados.update({
    where: {
      cedulaEstudiante: cedulaEst,
      cedulaJurado: cedulaJur,
      lapso: lapso,
    },
    data: {
      cedulaJurado: cedulaJur2,
    },
  });
}

export async function getInfoJudges(cedulaEst, lapso) {
  return prisma.jurados.findMany({
    select: {
      Personal: {
        select: {
          nombre1: true,
          apellido1: true,
          apellido2: true,
          nombre2: true,
          cedula: true,
          telf: true,
          Users: {
            select: {
              correo: true,
            },
          },
        },
      },
    },
    where: {
      cedulaEstudiante: cedulaEst,
      lapso: lapso,
    },
  });
}
