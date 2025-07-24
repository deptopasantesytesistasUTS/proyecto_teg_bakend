import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Obtener la cédula de un estudiante en la tabla Estudiantes usando userId
export async function getCedulaEstudianteByUserId(userId) {
  const estudiante = await prisma.estudiantes.findUnique({
    where: { idUsuario: userId },
    select: { cedula: true }
  });
  return estudiante ? estudiante.cedula : null;
}

export async function getMateriasByUserId(userId) {
  const idUsuario = Number(userId);
  if (isNaN(idUsuario)) return [];
  // 1. Buscar el estudiante por userId
  const estudiante = await prisma.estudiantes.findUnique({
    where: { idUsuario },
    select: { cedula: true }
  });
  if (!estudiante) return [];


  // 2. Buscar las matrículas del estudiante, trayendo la sección y la materia
  const matriculas = await prisma.matricula.findMany({
    where: { idEstudiante: estudiante.cedula },
    include: {
      Secciones: {
        include: {
          Materias: {
            include: {
              Carreras: true
            }
          }
        }
      }
    }
  });

  // 3. Formatear la respuesta para el frontend
  return matriculas
    .filter(m => m.Secciones && m.Secciones.Materias)
    .map(m => ({
      idMateria: m.Secciones.Materias.idMateria,
      categoria: m.Secciones.Materias.categoria,
      carrera: m.Secciones.Materias.Carreras?.nombre ?? null,
      seccion: m.Secciones.letra,
      idSeccion: m.Secciones.idSeccion
    }));
}