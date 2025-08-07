import prisma from "../prisma.js";

export async function getUserByCorreo(correo) {
  return prisma.users.findFirst({ where: { correo } });
}

export async function getUserById(id) {
  return prisma.users.findFirst({ where: { userId: id } });
}

export async function getUserProfileEst(userID) {
  return prisma.users.findFirst({
    select: {
      correo: true,
      Estudiantes: {
        select: {
          cedula: true,
          nombre1: true,
          nombre2: true,
          apellido1: true,
          apellido2: true,
          telf: true,
        },
      },
      Roles: {
        select: {
          nombre: true,
        },
      },
    },
    where: {
      userId: userID,
    },
  });
}

export async function getUserProfileDoc(userID) {
  return prisma.users.findFirst({
    select: {
      correo: true,
      Personal: {
        select: {
          cedula: true,
          nombre1: true,
          nombre2: true,
          apellido1: true,
          apellido2: true,
          telf: true,
        },
      },
      Roles: {
        select: {
          nombre: true,
        },
      },
    },
    where:{
      userId: userID
    }
  });
}

export async function getUserProfileAdm(userID) {
  return prisma.users.findFirst({
    select: {
      correo: true,
      Personal: {
        select: {
          cedula: true,
          nombre1: true,
          nombre2: true,
          apellido1: true,
          apellido2: true,
          telf: true,
        },
      },
      Roles: {
        select: {
          nombre: true,
        },
      },
    },
    where: {
      userId: userID,
    },
  });
}

export async function updateCorreo(userId, updateData) {
  return prisma.users.update({
    where: {
      userId,
    },
    data: {
      ...updateData,
    },
  });
}

export async function updateProfileEst(cedula, updateData) {
  return prisma.estudiantes.update({
    where: {
      cedula
    },
    data: {
      ...updateData,
    },
  });
}

export async function updateProfilePer(cedula, updateData) {
  return prisma.personal.update({
    where: {
      cedula,
    },
    data: {
      ...updateData,
    },
  });
}


