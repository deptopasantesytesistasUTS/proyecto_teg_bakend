import { PrismaClient, materia_categoria } from "@prisma/client";
import { tr } from "date-fns/locale";
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
      lugar1: true,
      lugar2: true,
      lugar3: true,
      direccionL1: true,
      direccionL2: true,
      direccionL3: true,
      lugar1Telf: true,
      lugar2Telf: true,
      lugar3Telf: true,
      lugar1Movil: true,
      lugar2Movil: true,
      lugar3Movil: true,
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

export async function getTituloElegidoInfo(lapso, cedula, materiaId) {
  return prisma.matricula.findFirst({
    select: {
      titulo1: true,
      titulo2: true,
      titulo3: true,
      tituloElegido: true,
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

export async function getEnlacesInfo(lapso, cedula, materiaId) {
  return prisma.matricula.findFirst({
    select: {
      borrador1: true,
      borrador2: true,
      borrador3: true,
      urlCargaAcad: true,
      urlCartaEntrega: true,
      borrador4: true,
      borradorFinal: true,
      urlTitulo1PDF: true,
      urlTitulo2PDF: true,
      urlTitulo3PDF: true,
      instr1Url: true,
      instr2Url: true,
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

export async function getCategoria(idMateria) {
  return prisma.materias.findFirst({
    select:{
      categoria: true
    },
    where:{
      idMateria: idMateria
    }
  })
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


// Obtener todos los títulos de todos los estudiantes para el Excel
export async function getAllStudentsTitles(lapsoId) {
  try {
    const matriculas = await prisma.matricula.findMany({
      where: {
        lapsoAcac: lapsoId,
        OR: [
          { titulo1: { not: null } },
          { titulo2: { not: null } },
          { titulo3: { not: null } }
        ]
      },
      include: {
        Estudiantes: {
          include: {
            Users: {
              select: {
                correo: true
              }
            },
            Carreras: {
              select: {
                nombre: true
              }
            }
          }
        },
        Secciones: {
          include: {
            Materias: {
              select: {
                categoria: true
              }
            },
            Personal: {
              select: {
                nombre1: true,
                nombre2: true,
                apellido1: true,
                apellido2: true,
                cedula: true
              }
            }
          }
        }
      }
    });

    // Mapear tutorías para identificar tutor (materia categoría Tutorías)
    const tutorias = await prisma.matricula.findMany({
      where: {
        lapsoAcac: lapsoId,
        Secciones: {
          is: {
            Materias: { is: { categoria: materia_categoria.Tutorias } }
          }
        }
      },
      include: {
        Estudiantes: { select: { cedula: true } },
        Secciones: { include: { Personal: true } }
      }
    });
    const estudianteCedulaToTutor = new Map();
    tutorias.forEach(t => {
      const p = t.Secciones?.Personal;
      if (!p || !t.Estudiantes?.cedula) return;
      const nombre = [p.nombre1, p.nombre2, p.apellido1, p.apellido2].filter(Boolean).join(' ');
      estudianteCedulaToTutor.set(t.Estudiantes.cedula, nombre);
    });

    // Jurados por estudiante/lapso
    const jurados = await prisma.jurados.findMany({
      where: { lapso: lapsoId },
      include: { Personal: true }
    });
    const estudianteCedulaToJurados = new Map();
    jurados.forEach(j => {
      const nombre = [j.Personal?.nombre1, j.Personal?.nombre2, j.Personal?.apellido1, j.Personal?.apellido2]
        .filter(Boolean).join(' ');
      const list = estudianteCedulaToJurados.get(j.cedulaEstudiante) || [];
      if (nombre) list.push(nombre);
      estudianteCedulaToJurados.set(j.cedulaEstudiante, list);
    });

    const titlesData = [];
    matriculas.forEach(matricula => {
      const student = matricula.Estudiantes;
      const section = matricula.Secciones;
      const tutorName = estudianteCedulaToTutor.get(student.cedula) || '';
      const juradosNombres = estudianteCedulaToJurados.get(student.cedula) || [];

      const pushEntry = (titulo, proposito, linea, lugar, direccion, telf, movil) => {
        titlesData.push({
          cedula: student.cedula,
          nombre: [student.nombre1, student.nombre2, student.apellido1, student.apellido2].filter(Boolean).join(' ').trim(),
          email: student.Users?.correo || '',
          carrera: student.Carreras?.nombre || '',
          materia: section.Materias?.categoria || '',
          titulo: titulo || '',
          proposito: proposito || '',
          lineaInvestigacion: linea || '',
          lugar: lugar || '',
          direccion: direccion || '',
          telefono: telf || '',
          movil: movil || '',
          tutor: tutorName,
          jurados: juradosNombres
        });
      };

      if (matricula.titulo1) pushEntry(matricula.titulo1, matricula.propositoInv1, matricula.lineaInv1, matricula.lugar1, matricula.direccionL1, matricula.lugar1Telf, matricula.lugar1Movil);
      if (matricula.titulo2) pushEntry(matricula.titulo2, matricula.propositoInv2, matricula.lineaInv2, matricula.lugar2, matricula.direccionL2, matricula.lugar2Telf, matricula.lugar2Movil);
      if (matricula.titulo3) pushEntry(matricula.titulo3, matricula.propositoInv3, matricula.lineaInv3, matricula.lugar3, matricula.direccionL3, matricula.lugar3Telf, matricula.lugar3Movil);
    });

    return titlesData;
  } catch (error) {
    console.error("Error en getAllStudentsTitles:", error);
  }
}

export async function updateURLs(dataURL, cedula, lapso, materiaId) {
  try {
    console.log("data ", dataURL);
    // 1. Encontrar el registro único de Matricula
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

    if (!matricula) {
      throw new Error(
        "Matricula record not found for the given student, lapso, and materiaId."
      );
    }

    // 2. Si se encontró un registro, actualizarlo
    return prisma.matricula.update({
      data: {
        ...dataURL
      },
      where: {
        // Use the unique ID of the record we just found in Step 1.
        idMatricula: matricula.idMatricula, // Replace with your actual primary key field
      },
    });
  } catch (error) {
    console.error("Error al actualizar la URL de la matrícula:", error);
    throw error;
  }
}

export async function getProfileEst(userID, lapso, idMateria) {
  try {
    const userProfile = await prisma.users.findFirst({
      where: {
        userId: userID,
        Estudiantes: {
          is: {
            Matricula: {
              // Aquí Matricula es una relación de uno a muchos
              some: {
                // Usamos 'some' para filtrar la colección de matrículas
                lapsoAcac: lapso,
                Secciones: {
                  is: {
                    // Si la relación con Secciones es de uno a uno, 'is' es correcto.
                    Materias: {
                      is: {
                        idMateria: idMateria,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      select: {
        correo: true,
        Estudiantes: {
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
            Matricula: {
              select: {
                Secciones: {
                  select: {
                    letra: true,
                    Personal: {
                      select: {
                        nombre1: true,
                        nombre2: true,
                        apellido1: true,
                        apellido2: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return userProfile;
  } catch (error) {
    console.error("Error al obtener el perfil del estudiante:", error);
    throw error;
  }
}
