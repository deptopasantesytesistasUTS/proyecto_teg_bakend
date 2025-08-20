import prisma from "../prisma.js";

export async function buscarRolAdmin() {
  return prisma.roles.findFirst({ where: { nombre: "Administrador" } });
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

export async function obtenerAdministradores() {
  return prisma.users.findMany({
    where: {
      Roles: {
        nombre: "Administrador",
      },
    },
    include: {
      Roles: true,
    },
  });
}

export async function eliminarAdministrador(id) {
  console.log("Modelo: Eliminando usuario con userId:", id);
  console.log("Modelo: Tipo de userId:", typeof id);
  
  const userId = parseInt(id);
  console.log("Modelo: userId convertido a entero:", userId);
  
  return prisma.users.delete({
    where: {
      userId: userId
    }
  });
}