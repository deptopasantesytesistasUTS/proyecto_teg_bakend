import prisma from "../prisma.js";

export async function getUserByCorreo(correo) {
  return prisma.users.findFirst({ where: { correo } });
}
