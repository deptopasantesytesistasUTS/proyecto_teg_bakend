import prisma from "../prisma.js";


// Obtener eventos del calendario para el dashboard
export async function getDashboardEvents(userId, role) {
  try {
    const events = [];

    // Obtener comunicados del usuario
    const comunicados = await getComunicadosByUser(userId, role);
    if (comunicados && comunicados.length > 0) {
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
    try {
      const today = new Date();
      console.log('Buscando lapso académico para fecha:', today.toISOString());
      
      // Primero intentar encontrar un lapso activo (que contenga la fecha actual)
      let lapsoActual = await prisma.lapsoAcac.findFirst({
        where: {
          fechaInicio: {
            lte: today
          },
          fechaFinal: {
            gte: today
          }
        }
      });

      // Si no hay lapso activo, buscar el más reciente
      if (!lapsoActual) {
        console.log('No se encontró lapso activo, buscando el más reciente...');
        lapsoActual = await prisma.lapsoAcac.findFirst({
          orderBy: {
            fechaInicio: 'desc'
          }
        });
      }

      if (lapsoActual) {
        console.log('Lapso encontrado:', {
          id: lapsoActual.id,
          fechaInicio: lapsoActual.fechaInicio,
          fechaFinal: lapsoActual.fechaFinal,
          fechaB1: lapsoActual.fechaB1,
          fechaB2: lapsoActual.fechaB2,
          fechaB3: lapsoActual.fechaB3,
          fechaB4: lapsoActual.fechaB4,
          fechaBFinal: lapsoActual.fechaBFinal,
          fechaTitulos: lapsoActual.fechaTitulos
        });

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

        // Agregar fechas adicionales del lapso
        if (lapsoActual.fechaInv2B1) {
          events.push({
            id: 'inv2b1',
            title: 'Investigación II - Borrador 1',
            date: lapsoActual.fechaInv2B1,
            type: 'tarea',
            description: 'Fecha límite para entrega del primer borrador de Investigación II',
            startDate: lapsoActual.fechaInv2B1,
            endDate: lapsoActual.fechaInv2B1
          });
        }

        if (lapsoActual.fechaInv2B2) {
          events.push({
            id: 'inv2b2',
            title: 'Investigación II - Borrador 2',
            date: lapsoActual.fechaInv2B2,
            type: 'tarea',
            description: 'Fecha límite para entrega del segundo borrador de Investigación II',
            startDate: lapsoActual.fechaInv2B2,
            endDate: lapsoActual.fechaInv2B2
          });
        }

        if (lapsoActual.fechaInv2B3) {
          events.push({
            id: 'inv2b3',
            title: 'Investigación II - Borrador 3',
            date: lapsoActual.fechaInv2B3,
            type: 'tarea',
            description: 'Fecha límite para entrega del tercer borrador de Investigación II',
            startDate: lapsoActual.fechaInv2B3,
            endDate: lapsoActual.fechaInv2B3
          });
        }

        if (lapsoActual.fechaInv2B4) {
          events.push({
            id: 'inv2b4',
            title: 'Investigación II - Borrador 4',
            date: lapsoActual.fechaInv2B4,
            type: 'tarea',
            description: 'Fecha límite para entrega del cuarto borrador de Investigación II',
            startDate: lapsoActual.fechaInv2B4,
            endDate: lapsoActual.fechaInv2B4
          });
        }

        if (lapsoActual.fechaInv2BFinal) {
          events.push({
            id: 'inv2bfinal',
            title: 'Investigación II - Borrador Final',
            date: lapsoActual.fechaInv2BFinal,
            type: 'proyecto',
            description: 'Fecha límite para entrega del borrador final de Investigación II',
            startDate: lapsoActual.fechaInv2BFinal,
            endDate: lapsoActual.fechaInv2BFinal
          });
        }

        if (lapsoActual.fechaTutIni) {
          events.push({
            id: 'tutini',
            title: 'Inicio de Tutorías',
            date: lapsoActual.fechaTutIni,
            type: 'reunion',
            description: 'Fecha de inicio del período de tutorías',
            startDate: lapsoActual.fechaTutIni,
            endDate: lapsoActual.fechaTutIni
          });
        }

        if (lapsoActual.fechaTutFin) {
          events.push({
            id: 'tutfin',
            title: 'Fin de Tutorías',
            date: lapsoActual.fechaTutFin,
            type: 'reunion',
            description: 'Fecha de fin del período de tutorías',
            startDate: lapsoActual.fechaTutFin,
            endDate: lapsoActual.fechaTutFin
          });
        }

        console.log(`Se agregaron ${events.length} eventos del lapso académico`);
      } else {
        console.log('No se encontró ningún lapso académico en la base de datos');
      }
    } catch (lapsoError) {
      console.error("Error obteniendo fechas del lapso académico:", lapsoError);
      // Continuar sin las fechas del lapso si hay error
    }

    console.log(`Dashboard: ${events.length} eventos generados para usuario ${userId} con rol ${role}`);
    return events;
  } catch (error) {
    console.error("Error en getDashboardEvents:", error);
    // En caso de error, devolver array vacío en lugar de lanzar error
    return [];
  }
}

// Obtener comunicados por usuario
export async function getComunicadosByUser(userId, role) {
  try {
    if (role === 1) {
      // Admin - obtener todos los comunicados (simplificado)
      return await prisma.Comunicados.findMany({
        orderBy: {
          created_At: 'desc'
        },
        take: 10 // Limitar a 10 comunicados más recientes
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
        orderBy: {
          created_At: 'desc'
        },
        take: 10
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
        orderBy: {
          created_At: 'desc'
        },
        take: 10
      });
    }

    return [];
  } catch (error) {
    console.error("Error en getComunicadosByUser:", error);
    // En caso de error, devolver array vacío en lugar de lanzar error
    return [];
  }
}

// Obtener usuarios conectados
export async function getConnectedUsers(userId, role) {
  try {
    const connectedUsers = [];
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000); // 5 minutos atrás

    if (role === 1) {
      // Admin - puede ver todos los usuarios activos
      
      // Obtener administradores activos
      const admins = await prisma.Users.findMany({
        where: {
          role: 1,
          lastActivity: {
            gte: fiveMinutesAgo
          }
        },
        select: {
          id: true,
          correo: true,
          lastActivity: true
        }
      });

      admins.forEach(admin => {
        connectedUsers.push({
          id: admin.id,
          name: admin.correo.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          role: "Administrador",
          avatar: `https://i.pravatar.cc/40?img=${admin.id}`,
          status: "online",
          lastSeen: admin.lastActivity,
          department: "Sistemas"
        });
      });

      // Obtener docentes activos
      const docentes = await prisma.Personal.findMany({
        where: {
          Users: {
            lastActivity: {
              gte: fiveMinutesAgo
            }
          }
        },
        include: {
          Users: {
            select: {
              id: true,
              correo: true,
              lastActivity: true
            }
          },
          Carreras: {
            select: {
              nombre: true
            }
          }
        }
      });

      docentes.forEach(docente => {
        connectedUsers.push({
          id: docente.Users.id,
          name: `${docente.nombre1} ${docente.apellido1}`,
          role: "Docente",
          avatar: `https://i.pravatar.cc/40?img=${docente.Users.id}`,
          status: "online",
          lastSeen: docente.Users.lastActivity,
          department: docente.Carreras?.nombre || "Académico"
        });
      });

      // Obtener estudiantes activos
      const estudiantes = await prisma.Estudiantes.findMany({
        where: {
          Users: {
            lastActivity: {
              gte: fiveMinutesAgo
            }
          }
        },
        include: {
          Users: {
            select: {
              id: true,
              correo: true,
              lastActivity: true
            }
          },
          Carreras: {
            select: {
              nombre: true
            }
          }
        }
      });

      estudiantes.forEach(estudiante => {
        connectedUsers.push({
          id: estudiante.Users.id,
          name: `${estudiante.nombre1} ${estudiante.apellido1}`,
          role: "Estudiante",
          avatar: `https://i.pravatar.cc/40?img=${estudiante.Users.id}`,
          status: "online",
          lastSeen: estudiante.Users.lastActivity,
          department: estudiante.Carreras?.nombre || "TEG"
        });
      });

    } else {
      // Otros roles - solo pueden ver usuarios de su misma sección/carrera
      // Implementar lógica específica según el rol
    }

    // Ordenar por última actividad (más reciente primero)
    connectedUsers.sort((a, b) => new Date(b.lastSeen) - new Date(a.lastSeen));

    return connectedUsers;
  } catch (error) {
    console.error("Error en getConnectedUsers:", error);
    throw error;
  }
}

