import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Obtener la cédula de un estudiante en la tabla Estudiantes usando userId
export async function getCedulaEstudianteByUserId(userId) {
  const estudiante = await prisma.estudiantes.findUnique({
    where: { idUsuario: userId },
    select: { cedula: true },
  });
  return estudiante ? estudiante.cedula : null;
}

export async function getMateriasByUserId(userId,lapso) {
  const idUsuario = Number(userId);
  if (isNaN(idUsuario)) return [];
  // 1. Buscar el estudiante por userId
  const estudiante = await prisma.estudiantes.findUnique({
    where: { idUsuario },
    select: { cedula: true },
  });
  if (!estudiante) return [];

  // 2. Buscar las matrículas del estudiante, trayendo la sección y la materia
  const matriculas = await prisma.matricula.findMany({
    where: { idEstudiante: estudiante.cedula },
    include: {
      Secciones: {
        include: {
          lapsoAcac: lapso,
          Materias: {
            include: {
              Carreras: true,
            },
          },
        },
      },
    },
  });

  // 3. Formatear la respuesta para el frontend
  return matriculas
    .filter((m) => m.Secciones && m.Secciones.Materias)
    .map((m) => ({
      idMateria: m.Secciones.Materias.idMateria,
      categoria: m.Secciones.Materias.categoria,
      carrera: m.Secciones.Materias.Carreras?.nombre ?? null,
      seccion: m.Secciones.letra,
      idSeccion: m.Secciones.idSeccion,
    }));
}

export async function getFechasInv2(lapso) {
  return prisma.lapsoAcac.findFirst({
    select: {
      fechaInv2B1: true,
      fechaInv2B2: true,
      fechaInv2B3: true,
      fechaInv2BFinal: true,
      fechaEntInst: true,
    },
    where: {
      id: lapso,
    },
  });
}

export async function updateTitles(
  titulo1,
  titulo2,
  titulo3,
  proposito1,
  proposito2,
  proposito3,
  linea1,
  linea2,
  linea3,
  lugar1,
  lugar2,
  lugar3,
  direccion1,
  direccion2,
  direccion3,
  telf1,
  telf2,
  telf3,
  movil1,
  movil2,
  movil3,
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
      titulo1,
      titulo2,
      titulo3,
      propositoInv1: proposito1,
      propositoInv2: proposito2,
      propositoInv3: proposito3,
      lineaInv1: linea1,
      lineaInv2: linea2,
      lineaInv3: linea3,
      lugar1: lugar1,
      lugar2: lugar2,
      lugar3: lugar3,
      direccionL1: direccion1,
      direccionL2: direccion2,
      direccionL3: direccion3,
      lugar1Telf: telf1,
      lugar2Telf: telf2,
      lugar3Telf: telf3,
      lugar1Movil: movil1,
      lugar2Movil: movil2,
      lugar3Movil: movil3,
    },
    where: {
      // Use the unique ID of the record we just found in Step 1.
      idMatricula: matricula.idMatricula, // Replace with your actual primary key field
    },
  });
}

export async function updateURLTitles(url,lapso,cedula,materiaId) {
  return prisma.matricula.update({
    data: {
      urlTitulosPDF: url,
    },
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
  });
}

export async function getTitlesInfo(lapso, cedula, materiaId) {
  return prisma.matricula.findFirst({
    select: {
      titulo1: true,
      titulo2: true,
      titulo3: true,
      propositoInv1: true,
      propositoInv2: true,
      propositoInv3: true,
      lineaInv1: true,
      lineaInv2: true,
      lineaInv3: true,
    },
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
  });
}

export async function getTitlesPDFURL(lapso, estudiante, materiaId) {
  return prisma.matricula.findFirst({
    select: {
      urlTitulosPDF: true,
    },
    where: {
      lapsoAcac: lapso,
      idEstudiante: estudiante,
      // Here we filter by the nested relationship.
      // The `some` operator is used to check if at least one related record meets the criteria.
      Secciones: {
        some: {
          Materias: {
            some: {
              idMateria: materiaId,
            },
          },
        },
      },
    },
  });
}

export async function updateURLs(data, lapso, cedula, materiaId) {
  return prisma.matricula.update({
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
    data: {
      urlTitulosPDF,
      borrador1,
      borrador2,
      borrador3,
      borrador4,
    },
  });
}

