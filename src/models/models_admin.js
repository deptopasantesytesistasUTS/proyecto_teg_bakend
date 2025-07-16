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
  fechaTitulos
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

export async function createMatricula(lapso,cedula,seccion) {
  return prisma.matricula.create({
    data: {
      idSeccion: seccion,
      idEstudiante: cedula,
      lapsoAcac: lapso
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
    where:{
      cedula: cedula,
    }
  })
}

export async function createStudent(
  cedula,
  nombre1,
  nombre2,
  apellido1,
  apellido2,
  telf,
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
      idCarrera: idCarrera,
      idUsuario: idUsuario,
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
    },
    where: {
      cedula: cedula,
    },
  });
}

export async function getMatriculaInfo(cedula, lapso) {
  return prisma.matricula.findFirst({
    where: {
      idEstudiante: cedula,
      lapsoAcac: lapso,
    },
  });
}

export async function getMateriaCategoria(seccion) {
  return prisma.secciones.findFirst({
    select:{
      Materias:{
        select:{
          categoria: true,
        }
      }
    },
    where:{
      idSeccion: seccion,
    }
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

export async function editStudentbyCorreo(correo, updateData) {
  return prisma.estudiantes.update({
    where: {
      Users: {
        where: {
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


export async function getStudentListA(lapso) {
  return prisma.matricula.findMany({
    select: {
      Estudiantes: {
        select: {
          cedula: true,
          nombre1: true,
          nombre2: true,
          apellido1: true,
          apellido2: true,
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
        },
      },
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
    where: {
      // Filter Estudiantes who have at least one Matricula recor

      // And that Matricula record must be linked to a specific lapsoAcac
      // The 'lapsoAcac' field on Matricula directly holds the ID
      lapsoAcac: lapso.id, // Assuming yourLapsoAcacId is the integer ID of the academic period
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
          Users: {
            select: {
              correo: true,
            },
          },
        },
      },
      Materias: {
        select: {
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

export async function createJudge() {}
