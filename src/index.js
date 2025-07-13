import express from "express";
import routes from "./routes/routes_login.js";
import prisma from "./prisma.js";
import cors from "cors";
import { PORT } from "./config.js";

const app = express();

// Habilita CORS para el frontend antes de las rutas
app.use(cors({ origin: "http://localhost:3000" }));

// Middleware para parsear JSON
app.use(express.json());

// Tus rutas
app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en el puerto ${PORT}`);
});

// Test de conexión a Prisma
async function testPrisma() {
  try {
    await prisma.$connect();
    console.log("✅ Prisma conectado correctamente a la base de datos");
  } catch (error) {
    console.error("❌ Error conectando Prisma:", error.message);
  }
}
testPrisma();