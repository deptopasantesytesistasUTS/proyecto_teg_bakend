import prisma from "../prisma.js";

export async function getCarreras() {
  return prisma.carreras.findMany();
}

export async function getSectionsTutorbyCareer(carrera, lapso) {
  try {
    const result = await prisma.lapsoAcac.findMany({
      where: {
        // CORRECTED: Pass the lapsoId directly to the 'id' field
        id: lapso.id,
        Secciones: {
          some: {
            Materias: {
              is: {
                idCarrera: carrera,
                categoria: "Tutorias",
              },
            },
          },
        },
      },
      select: {
        Secciones: {
          where: {
            Materias: {
              is: {
                idCarrera: carrera,
              },
            },
          },
          select: {
            idSeccion: true,
            letra: true,
            Materias: {
              select: {
                categoria: true,
              },
            },
          },
        },
      },
    });

    const flatSections = result.flatMap((lapso) => lapso.Secciones);
    return flatSections;
  } catch (error) {
    console.error("Error fetching sections by career:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function getSectionsbyCareer(carrera, lapso) {
  try {
    const result = await prisma.lapsoAcac.findMany({
      where: {
        // CORRECTED: Pass the lapsoId directly to the 'id' field
        id: lapso.id,
        Secciones: {
          some: {
            Materias: {
              is: {
                idCarrera: carrera,
              },
              isNot: {
                categoria: "Tutorias",
              },
            },
          },
        },
      },
      select: {
        Secciones: {
          where: {
            Materias: {
              is: {
                idCarrera: carrera,
              },
            },
          },
          select: {
            idSeccion: true,
            letra: true,
            Materias: {
              select: {
                categoria: true,
              },
            },
          },
        },
      },
    });

    const flatSections = result.flatMap((lapso) => lapso.Secciones);
    return flatSections;
  } catch (error) {
    console.error("Error fetching sections by career:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
