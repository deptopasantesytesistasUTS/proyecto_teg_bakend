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
      Carreras: true,
    },
  });
}

// Obtener solo el listado de materias para el dashboard, filtrado por usuario y rol
export async function getMateriasDashboard(userId, role,lapso) {
  if (role == 3 || role === "3" || role === "estudiante") {
    // 1. Buscar la cédula del estudiante
    const estudiante = await prisma.estudiantes.findFirst({
      where: { idUsuario: Number(userId) }
    });
    if (!estudiante) return [];
    // 2. Buscar materias donde el estudiante está inscrito
    const matriculas = await prisma.matricula.findMany({
      where: { idEstudiante: estudiante.cedula, lapsoAcac: lapso },
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
      where: { idDocente: docente.cedula, lapsoAcad: lapso },
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

// =============== Comunicados (CRUD) =================

export async function getComunicados({ seccionId = null, limit = 10 } = {}) {
  // Si se requiere filtrar por seccion, usar la relación Receptores
  if (seccionId) {
    const receptores = await prisma.receptores.findMany({
      where: { idSeccion: Number(seccionId) },
      include: { Comunicados: true },
      take: Number(limit),
    });
    const comunicados = receptores
      .map(r => r.Comunicados)
      .filter(Boolean)
      .sort((a, b) => new Date(b.created_At) - new Date(a.created_At));
    return comunicados;
  }
  // Caso general: últimos comunicados
  return prisma.comunicados.findMany({
    orderBy: { created_At: "desc" },
    take: Number(limit),
  });
}

export async function createComunicado({ titulo, texto, idUsuario = null, seccionesIds = [] }) {
  // Obtener el próximo id para Comunicados (no es autoincrement en el schema)
  const maxComRow = await prisma.comunicados.findMany({
    orderBy: { idComunicado: "desc" },
    take: 1,
    select: { idComunicado: true },
  });
  const nextComId = maxComRow.length > 0 ? (Number(maxComRow[0].idComunicado) + 1) : 1;

  const comunicado = await prisma.comunicados.create({
    data: {
      idComunicado: nextComId,
      titulo,
      texto,
      idUsuario: idUsuario ? Number(idUsuario) : null,
      created_At: new Date(),
    },
  });

  // Crear receptores si seccionesIds fue provisto
  if (Array.isArray(seccionesIds) && seccionesIds.length > 0) {
    // Obtener el máximo id actual para receptor para asegurar PK
    const maxIdRow = await prisma.receptores.findMany({
      orderBy: { id: "desc" },
      take: 1,
      select: { id: true },
    });
    let nextId = maxIdRow.length > 0 ? (maxIdRow[0].id + 1) : 1;

    for (const secId of seccionesIds) {
      await prisma.receptores.create({
        data: {
          id: nextId++,
          idSeccion: Number(secId),
          idComunicado: comunicado.idComunicado,
        },
      });
    }
  }

  return comunicado;
}

export async function updateComunicado(idComunicado, { titulo, texto }) {
  return prisma.comunicados.update({
    where: { idComunicado: Number(idComunicado) },
    data: { titulo, texto },
  });
}

export async function deleteComunicado(idComunicado) {
  const id = Number(idComunicado);
  // Borrar receptores asociados primero
  await prisma.receptores.deleteMany({ where: { idComunicado: id } });
  // Borrar comunicado
  return prisma.comunicados.delete({ where: { idComunicado: id } });
}

export async function getEstadisticasAula(idMateria,cedula){

  const seccion = await prisma.secciones.findFirst({
    where: {
      idMateria: idMateria,
      idDocente: cedula,
    },
  });

  if (!seccion) {
    throw new Error(
      "Seccion no encontrada"
    );
  }


  console.log("hoal ",seccion)

  return prisma.matricula.findMany({
    where:{
      idSeccion: seccion.idSeccion
    },
    include:{
      Secciones: {
        include: {
          Materias: true,
        }
      },
    }
  })
}