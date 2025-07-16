import prisma from "../prisma.js";

export async function getCarreras() {
    return prisma.carreras.findMany()
};

export async function getSectionsbyCareer(carrera,lapso) {
  return prisma.lapsoAcac.findMany({
    select: {
      idSeccion: true,
      letra: true,
    },
    where: {
      Materias: {
        idCarrera: carrera,
      },
      lapsoAcac: lapso
    },
  });
}