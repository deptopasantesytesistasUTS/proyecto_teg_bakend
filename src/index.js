import express from 'express';
import { PORT } from './config.js';
import morgan from 'morgan';
import './db.js'; // Importar para ejecutar la conexión a PostgreSQL


const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(corsMiddleware);



// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'API del Hospital Oncológico funcionando correctamente',
    version: '1.0.0',
    endpoints: {
      pacientes: '/api/pacientes',
      expedientes: '/api/expedientes'
    }
  });
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
});

