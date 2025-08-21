import express from "express";
import routes from "./routes/routes_login.js";
import adminRoutes from "./routes/admin.routes.js";
import generalInfo from "./routes/generalInfo.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import prisma from "./prisma.js";
import cors from "cors";
import { PORT } from "./config.js";
import aulavirtualRoutes from "./routes/aulavirtual.routes.js";
import aulavirtualEstudiantesRoutes from "./routes/aulavirtualEstudiantes.routes.js";
import superUserRoutes from "./routes/superUser.routes.js";
import aulavirtualDocenteRoutes from "./routes/aulavirtualDocente.routes.js";
const app = express();

// Habilita CORS para el frontend antes de las rutas
app.use(
  cors({
    origin: true, // Allow all origins temporarily
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
  })
);

// Handle preflight requests
app.options("*", cors());

// Additional CORS headers middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Middleware para parsear JSON
app.use(express.json());

// Tus rutas
app.use("/api", routes);
app.use("/api", adminRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", aulavirtualRoutes);
app.use("/api", aulavirtualEstudiantesRoutes);
app.use("/api/aulavirtualDocente", aulavirtualDocenteRoutes);
app.use("/api/aulavirtual-Docente", aulavirtualDocenteRoutes);
app.use("/api", generalInfo);
app.use("/api", superUserRoutes);

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
