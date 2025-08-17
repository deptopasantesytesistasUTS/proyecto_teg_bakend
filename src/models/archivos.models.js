import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Obtener todas las materias con sus secciones (aula virtual)
export async function setBorradoresURL(data) {
    return prisma.matricula.update(
        {
            ...data
        }
    )
}
