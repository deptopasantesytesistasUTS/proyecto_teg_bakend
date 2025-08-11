import prisma from "../prisma.js";


// Obtener eventos del calendario para el dashboard
export async function getDashboardEvents(userId, role) {
  try {
    const events = [];

    // Obtener tutorías del usuario
    const tutorias = await getTutoriasByUser(userId, role);
    if (tutorias) {
      events.push(...tutorias.map(tutoria => ({
        id: tutoria.idTutoria,
        title: `Tutoría - ${tutoria.Secciones?.Materias?.categoria || 'Tutoría'}`,
        date: tutoria.fecha,
        type: 'reunion',
        description: `Tutoría programada para la sección ${tutoria.Secciones?.letra || ''}`,
        startDate: tutoria.fecha,
        endDate: tutoria.fecha
      })));
    }

    // Obtener comunicados del usuario
    const comunicados = await getComunicadosByUser(userId, role);
    if (comunicados) {
      events.push(...comunicados.map(comunicado => ({
        id: comunicado.idComunicado,
        title: comunicado.titulo,
        date: comunicado.created_At,
        type: 'clase',
        description: comunicado.texto,
        startDate: comunicado.created_At,
        endDate: comunicado.created_At
      })));
    }

    // Obtener fechas importantes del lapso académico actual
    const today = new Date();
    const lapsoActual = await prisma.lapsoAcac.findFirst({
      where: {
        fechaInicio: {
          lte: today
        },
        fechaFinal: {
          gte: today
        }
      }
    });

    if (lapsoActual) {
      // Fechas de entrega de borradores
      if (lapsoActual.fechaB1) {
        events.push({
          id: 'b1',
          title: 'Entrega Borrador 1',
          date: lapsoActual.fechaB1,
          type: 'tarea',
          description: 'Fecha límite para entrega del primer borrador',
          startDate: lapsoActual.fechaB1,
          endDate: lapsoActual.fechaB1
        });
      }

      if (lapsoActual.fechaB2) {
        events.push({
          id: 'b2',
          title: 'Entrega Borrador 2',
          date: lapsoActual.fechaB2,
          type: 'tarea',
          description: 'Fecha límite para entrega del segundo borrador',
          startDate: lapsoActual.fechaB2,
          endDate: lapsoActual.fechaB2
        });
      }

      if (lapsoActual.fechaB3) {
        events.push({
          id: 'b3',
          title: 'Entrega Borrador 3',
          date: lapsoActual.fechaB3,
          type: 'tarea',
          description: 'Fecha límite para entrega del tercer borrador',
          startDate: lapsoActual.fechaB3,
          endDate: lapsoActual.fechaB3
        });
      }

      if (lapsoActual.fechaB4) {
        events.push({
          id: 'b4',
          title: 'Entrega Borrador 4',
          date: lapsoActual.fechaB4,
          type: 'tarea',
          description: 'Fecha límite para entrega del cuarto borrador',
          startDate: lapsoActual.fechaB4,
          endDate: lapsoActual.fechaB4
        });
      }

      if (lapsoActual.fechaBFinal) {
        events.push({
          id: 'bfinal',
          title: 'Entrega Borrador Final',
          date: lapsoActual.fechaBFinal,
          type: 'proyecto',
          description: 'Fecha límite para entrega del borrador final',
          startDate: lapsoActual.fechaBFinal,
          endDate: lapsoActual.fechaBFinal
        });
      }

      if (lapsoActual.fechaTitulos) {
        events.push({
          id: 'titulos',
          title: 'Entrega de Títulos',
          date: lapsoActual.fechaTitulos,
          type: 'proyecto',
          description: 'Fecha límite para entrega de títulos de proyecto',
          startDate: lapsoActual.fechaTitulos,
          endDate: lapsoActual.fechaTitulos
        });
      }
    }

    return events;
  } catch (error) {
    console.error("Error en getDashboardEvents:", error);
    throw error;
  }
}

// Obtener comunicados por usuario
export async function getComunicadosByUser(userId, role) {
  try {
    if (role === 1) {
      // Admin - obtener todos los comunicados
      return await prisma.Comunicados.findMany({
        include: {
          Users: {
            select: {
              correo: true
            }
          }
        },
        orderBy: {
          created_At: 'desc'
        }
      });
    } else if (role === 2) {
      // Profesor - obtener comunicados de sus secciones
      const personal = await prisma.Personal.findFirst({
        where: {
          userID: parseInt(userId)
        }
      });

      if (!personal) return [];

      return await prisma.Comunicados.findMany({
        where: {
          Receptores: {
            some: {
              Secciones: {
                idDocente: personal.cedula
              }
            }
          }
        },
        include: {
          Users: {
            select: {
              correo: true
            }
          }
        },
        orderBy: {
          created_At: 'desc'
        }
      });
    } else if (role === 3) {
      // Estudiante - obtener comunicados de sus secciones
      const estudiante = await prisma.Estudiantes.findFirst({
        where: {
          idUsuario: parseInt(userId)
        }
      });

      if (!estudiante) return [];

      return await prisma.Comunicados.findMany({
        where: {
          Receptores: {
            some: {
              Secciones: {
                Matricula: {
                  some: {
                    idEstudiante: estudiante.cedula
                  }
                }
              }
            }
          }
        },
        include: {
          Users: {
            select: {
              correo: true
            }
          }
        },
        orderBy: {
          created_At: 'desc'
        }
      });
    }

    return [];
  } catch (error) {
    console.error("Error en getComunicadosByUser:", error);
    throw error;
  }
}

