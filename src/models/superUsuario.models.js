import prisma from "../prisma.js";

export async function buscarRolAdmin() {
  return prisma.roles.findFirst({ where: { nombre: "admin" } });
}

export async function crearUsuarioAdmin({ correo, password, roleId }) {
  return prisma.users.create({
    data: {
      correo,
      password,
      role_id: roleId,
      status: "activo"
    }
  });
}