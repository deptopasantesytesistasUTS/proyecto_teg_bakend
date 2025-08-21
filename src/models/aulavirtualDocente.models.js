import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getEstudiantesPorDocente(cedulaDocente) {
  // ...tu lógica actual...
  return [];
}

export async function crearTutoria({ fecha, idSeccion }) {
  return await prisma.tutorias.create({
    data: {
      fecha: new Date(fecha),
      idSeccion: Number(idSeccion),
    },
  });
}

// Nueva función para obtener tutorías por sección (o todas)
export async function obtenerTutorias({ idSeccion }) {
  const where = idSeccion ? { idSeccion: Number(idSeccion) } : {};
  const tutorias = await prisma.tutorias.findMany({
    where,
    orderBy: { fecha: "asc" },
  });
  // Mapear tutorias_pk a idTutoria para el frontend
  return tutorias.map(t => ({
    ...t,
    idTutoria: t.tutorias_pk,
  }));
}

// Actualizar tutoría
export async function actualizarTutoria({ id, fecha }) {
  return await prisma.tutorias.update({
    where: { tutorias_pk: Number(id) },
    data: { fecha: new Date(fecha) },
  });
}

// Eliminar tutoría
export async function eliminarTutoria(id) {
  return await prisma.tutorias.delete({
    where: { tutorias_pk: Number(id) },
  });
}

// Crear o actualizar asistencia
export async function registrarAsistencia({ idTutoria, idEstudiante, asistencia }) {
  // Busca si ya existe la asistencia
  const existente = await prisma.asistencias.findFirst({
    where: { idTutoria: Number(idTutoria), idEstudiante: Number(idEstudiante) }
  });
  if (existente) {
    // Actualiza
    return await prisma.asistencias.update({
      where: { idAsistencia: existente.idAsistencia },
      data: { asistencia: Boolean(asistencia) }
    });
  } else {
    // Crea
    return await prisma.asistencias.create({
      data: {
        idTutoria: Number(idTutoria),
        idEstudiante: Number(idEstudiante),
        asistencia: Boolean(asistencia)
      }
    });
  }
}

// Obtener asistencias por sección
export async function obtenerAsistenciasPorSeccion(idSeccion) {
  // Busca todas las asistencias de las tutorías de esa sección
  return await prisma.asistencias.findMany({
    where: {
      Tutorias: { idSeccion: Number(idSeccion) }
    }
  });
}

// Obtener últimos conectados de una sección (por last_sesion de Users)
export async function getUltimosConectadosPorSeccion(idSeccion, limit = 5) {
  const registros = await prisma.matricula.findMany({
    where: { idSeccion: Number(idSeccion) },
    include: {
      Estudiantes: {
        include: {
          Users: true,
        },
      },
    },
  });

  const usuarios = registros
    .map((m) => {
      const u = m.Estudiantes?.Users;
      if (!u) return null;
      const e = m.Estudiantes;
      const nombre = [e?.nombre1, e?.nombre2, e?.apellido1, e?.apellido2]
        .filter(Boolean)
        .join(" ");
      return {
        id: String(e?.cedula ?? ""),
        name: nombre || u.correo,
        email: u.correo,
        lastConnection: u.last_sesion ? u.last_sesion.toISOString() : "",
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      const ta = a.lastConnection ? new Date(a.lastConnection).getTime() : 0;
      const tb = b.lastConnection ? new Date(b.lastConnection).getTime() : 0;
      return tb - ta;
    });

  // Eliminar duplicados por id de estudiante (si aparece varias veces en la sección)
  const uniqueById = new Map();
  for (const u of usuarios) {
    if (!uniqueById.has(u.id)) uniqueById.set(u.id, u);
  }

  return Array.from(uniqueById.values()).slice(0, Number(limit));
}

// Obtener estadísticas de entregas por sección
export async function getEstadisticasEntregasPorSeccion(idSeccion) {
  const matriculas = await prisma.matricula.findMany({
    where: { idSeccion: Number(idSeccion) },
    select: {
      titulo1: true,
      titulo2: true,
      titulo3: true,
      tituloElegido: true,
      borrador1: true,
      borrador2: true,
      borrador3: true,
      borrador4: true,
      borradorFinal: true,
    },
  });

  const total = matriculas.length || 1; // evitar división por cero

  const porcentaje = (count) => Math.round((count * 100) / total);

  const countTitulo = matriculas.filter(
    (m) => m.tituloElegido != null || m.titulo1 != null || m.titulo2 != null || m.titulo3 != null
  ).length;
  const countB1 = matriculas.filter((m) => m.borrador1 != null).length;
  const countB2 = matriculas.filter((m) => m.borrador2 != null).length;
  const countB3 = matriculas.filter((m) => m.borrador3 != null).length;
  const countB4 = matriculas.filter((m) => m.borrador4 != null).length;
  const countFinal = matriculas.filter((m) => m.borradorFinal != null).length;

  return [
    { label: "Entrega de Título", value: porcentaje(countTitulo) },
    { label: "Entrega de Borrador 1", value: porcentaje(countB1) },
    { label: "Entrega de Borrador 2", value: porcentaje(countB2) },
    { label: "Entrega de Borrador 3", value: porcentaje(countB3) },
    { label: "Entrega de Borrador 4", value: porcentaje(countB4) },
    { label: "Entrega de Borrador Final", value: porcentaje(countFinal) },
  ];
}

