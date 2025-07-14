import prisma from "../prisma.js";

export async function getSemesterByDate(fecha) {

  const startOfDayUTC = new Date(fecha + "T00:00:00.000Z");

  // Convert it to an ISO string
  const isoStartOfDay = startOfDayUTC.toISOString();

  // Create a Date object for the end of the day in UTC
  const endOfDayUTC = new Date(fecha + "T23:59:59.999Z");

  // Convert it to an ISO string
  const isoEndOfDay = endOfDayUTC.toISOString();

  return prisma.lapsoAcac.findFirst({
    where: {
      fechaInicio: { lte: isoStartOfDay },
      fechaFinal: { gte: isoEndOfDay },
    },
  });
}

export async function getSemesterbyId(id) {
  return prisma.lapsoAcac.findFirst({
    where: { id: id },
  });
}

export async function createSemester(
  id,
  fechaInicio,
  fechaFinal,
  fechaB1,
  fechaB2,
  fechaB3,
  fechaBFinal,
  fechaTitulos
) {


  return prisma.lapsoAcac.create({
    data: {
      id: id,
      fechaInicio: fechaInicio,
      fechaFinal: fechaFinal,
      fechaB1: fechaB1,
      fechaB2: fechaB2,
      fechaB3: fechaB3,
      fechaBFinal: fechaBFinal,
      fechaTitulos: fechaTitulos,
    },
  });
}

export async function editSemesterById(id, updateData) {
  return prisma.lapsoAcac.update({
    where: {
      id: id,
    },
    data: {
      ...updateData,
    },
  });
}
