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

