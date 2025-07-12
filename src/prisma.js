import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Función para conectar a la base de datos
export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Conexión a Prisma establecida correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error conectando a Prisma:', error.message);
    return false;
  }
};

// Función para cerrar la conexión
export const disconnectDB = async () => {
  await prisma.$disconnect();
};

export default prisma; 