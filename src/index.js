import express from 'express';
import { PORT } from './config.js';
import morgan from 'morgan';
import cors from 'cors';
import { connectDB } from './prisma.js'; // Importar Prisma en lugar de pg

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'API del Proyecto Técnico funcionando correctamente',
    version: '1.0.0',
    endpoints: {
      usuarios: '/api/usuarios',
      cursos: '/api/cursos',
      inscripciones: '/api/inscripciones'
    }
  });
});

// Ruta para probar la conexión a la base de datos
app.get('/api/test-db', async (req, res) => {
  try {
    const isConnected = await connectDB();
    if (isConnected) {
      res.json({
        success: true,
        message: 'Conexión a la base de datos exitosa con Prisma'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error en la conexión a la base de datos'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al probar la conexión',
      error: error.message
    });
  }
});

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Middleware para manejar errores
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

app.listen(PORT, () => {
  console.log('Servidor escuchando en el puerto', PORT);
  console.log(`API disponible en: http://localhost:${PORT}`);
  
  // Probar conexión a la base de datos al iniciar
  connectDB();
});

