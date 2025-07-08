# 🚀 Inicio Rápido - Hospital Oncológico Backend

## ❌ Error Solucionado

El error `TypeError: Missing parameter name` ha sido corregido reordenando las rutas en `src/routes/pacientes.js`.

## 📋 Pasos para Configurar el Proyecto

### 1. Configuración Inicial
```bash
cd Oncologico-Hm-bakend
npm run setup
```

### 2. Configurar Base de Datos PostgreSQL

#### A. Crear la base de datos:
```sql
CREATE DATABASE oncologico_hm;
```

#### B. Ejecutar el script SQL:
```bash
psql -d oncologico_hm -f database.sql
```

### 3. Configurar Variables de Entorno

Edita el archivo `.env` que se creó automáticamente:
```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=tu_password_real_aqui
DB_NAME=oncologico_hm
DB_PORT=5432
PORT=3003
```

### 4. Probar la Conexión
```bash
npm run test-db
```

### 5. Iniciar el Servidor
```bash
npm run dev
```

## 🔧 Solución de Problemas

### Error de Conexión a PostgreSQL:
- Verifica que PostgreSQL esté ejecutándose
- Confirma las credenciales en `.env`
- Asegúrate de que la base de datos exista

### Error de Rutas:
- ✅ **SOLUCIONADO**: Las rutas específicas ahora van antes que las rutas con parámetros

### Error de CORS:
- El frontend debe estar en `http://localhost:5173` o `http://localhost:3000`

## 📡 Endpoints Disponibles

- `GET /api/pacientes` - Listar pacientes
- `POST /api/pacientes` - Crear paciente
- `GET /api/pacientes/:id` - Obtener paciente por ID
- `PUT /api/pacientes/:id` - Actualizar paciente
- `DELETE /api/pacientes/:id` - Eliminar paciente
- `GET /api/pacientes/cedula/:cedula` - Buscar por cédula
- `GET /api/pacientes/tipo/:tipo` - Filtrar por tipo

## 🎯 Próximos Pasos

1. ✅ Configurar base de datos
2. ✅ Probar conexión
3. ✅ Iniciar servidor
4. 🔄 Probar desde el frontend
5. 📝 Crear más módulos (doctores, consultas, etc.)

## 📞 Soporte

Si tienes problemas:
1. Ejecuta `npm run test-db` para diagnosticar
2. Verifica los logs del servidor
3. Revisa la configuración en `.env` 