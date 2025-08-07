import { materia_categoria } from "@prisma/client";
import prisma from "../prisma.js";

export async function getCarreras() {
  return prisma.carreras.findMany();
}

export async function getSectionsTutorbyCareer(carrera, lapso) {
  try {
    const result = await prisma.lapsoAcac.findMany({
      where: {
        id: lapso.id,
        Secciones: {
          some: {
            Materias: {
              is: {
                idCarrera: carrera,
                categoria: materia_categoria.Tutorias,
              },
            },
          },
        },
      },
      select: {
        Secciones: {
          // Aquí aplicamos el filtro para asegurar que solo se seleccionen
          // las secciones que contengan materias de la categoría 'Tutorias'.
          where: {
            Materias: {
              is: {
                idCarrera: carrera,
                categoria: materia_categoria.Tutorias,
              },
            },
          },
          select: {
            idSeccion: true,
            letra: true,
            Materias: {
              // Ya no es necesario un `where` aquí, ya que el filtro superior
              // se encargará de traer solo las materias de la categoría 'Tutorias'.
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
        id: lapso.id,
        Secciones: {
          some: {
            Materias: {
              // Aplica el filtro para la carrera
              is: {
                idCarrera: carrera,
                // Y aquí aplicamos el filtro para excluir las tutorías
                categoria: {
                  not: materia_categoria.Tutorias,
                },
              },
            },
          },
        },
      },
      select: {
        Secciones: {
          // Es crucial aplicar el mismo filtro de 'Materias' también aquí
          where: {
            Materias: {
              is: {
                idCarrera: carrera,
                // Incluye el filtro de exclusión de tutorías en el 'where' anidado
                categoria: {
                  not: materia_categoria.Tutorias,
                },
              },
            },
          },
          select: {
            idSeccion: true,
            letra: true,
            Materias: {
              // El `select` anidado para `Materias` ya no necesita un filtro `where`
              // porque el `where` de `Secciones` ya lo ha filtrado.
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
