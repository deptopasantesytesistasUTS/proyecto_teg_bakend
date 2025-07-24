import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Obtener todas las materias con sus secciones (aula virtual)
export async function getMateriasWithAulaVirtual() {
  
  const materias = await prisma.materias.findMany({
    include: {
      Carreras: true,
      Secciones: true,
    },
  });
  return materias.map((m) => ({
    idMateria: m.idMateria,
    categoria: m.categoria,
    carrera: m.Carreras?.nombre,
    secciones: m.Secciones.map((s) => ({
      idSeccion: s.idSeccion,
      seccion_letra: s.letra,
      idDocente: s.idDocente,
    })),
  }));
}

// Obtener una materia por id con sus secciones (aula virtual)
export async function getMateriaByIdWithAulaVirtual(idMateria) {
  return await prisma.materias.findUnique({
    where: { idMateria: Number(idMateria) },
    include: {
      Secciones: true,
    },
  });
}

// Obtener solo el listado de materias para el dashboard, filtrado por usuario y rol
export async function getMateriasDashboard(userId, role) {
  if (role == 3 || role === "3" || role === "estudiante") {
    // 1. Buscar la cédula del estudiante
    const estudiante = await prisma.estudiantes.findFirst({
      where: { idUsuario: Number(userId) }
    });
    if (!estudiante) return [];
    // 2. Buscar materias donde el estudiante está inscrito
    const matriculas = await prisma.matricula.findMany({
      where: { idEstudiante: estudiante.cedula },
      include: {
        Secciones: {
          include: {
            Materias: { include: { Carreras: true } },
          },
        },
      },
    });
    return matriculas.map((mat) => ({
      idMateria: mat.Secciones?.Materias?.idMateria,
      categoria: mat.Secciones?.Materias?.categoria,
      carrera: mat.Secciones?.Materias?.Carreras?.nombre,
    })).filter((m) => m.idMateria);
  } else if (role == 2 || role === "2" || role === "docente") {
    // 1. Buscar la cédula del docente
    const docente = await prisma.personal.findFirst({
      where: { userID: Number(userId) }
    });
    if (!docente) return [];
    // 2. Buscar materias donde el docente imparte la sección
    const secciones = await prisma.secciones.findMany({
      where: { idDocente: docente.cedula },
      include: {
        Materias: { include: { Carreras: true } },
      },
    });
    return secciones.map((sec) => ({
      idMateria: sec.Materias?.idMateria,
      categoria: sec.Materias?.categoria,
      carrera: sec.Materias?.Carreras?.nombre,
    })).filter((m) => m.idMateria);
  } else {
    return [];
  }
}

// Obtener la cédula de un usuario en la tabla Personal usando userId
export async function getCedulaPersonalByUserId(userId) {
  const personal = await prisma.personal.findFirst({
    where: { userID: Number(userId) },
    select: { cedula: true }
  });
  return personal ? personal.cedula : null;
}

// Obtener los participantes (docente y estudiantes) de una sección específica
export async function getParticipantesBySeccion(idSeccion) {
  try {
    const seccion = await prisma.secciones.findUnique({
      where: { idSeccion: Number(idSeccion) },
      include: { Personal: true }
    });
    if (!seccion) throw new Error("Sección no encontrada");
    const matriculas = await prisma.matricula.findMany({
      where: { idSeccion: Number(idSeccion) },
      include: { Estudiantes: true }
    });
    return {
      docente: seccion.Personal || null,
      estudiantes: matriculas.map(m => m.Estudiantes)
    };
  } catch (err) {
    console.error("Error en getParticipantesBySeccion:", err);
    throw err;
  }
}