# API del Hospital Oncológico - Backend

Este es el backend del sistema de gestión del Hospital Oncológico, implementado con el patrón MVC (Model-View-Controller) usando Node.js, Express y PostgreSQL.

## 🚀 Características

- **Patrón MVC**: Separación clara de responsabilidades
- **Base de datos PostgreSQL**: Almacenamiento robusto y escalable
- **API RESTful**: Endpoints bien estructurados
- **Validación de datos**: Validaciones tanto en frontend como backend
- **CORS configurado**: Permite peticiones desde el frontend
- **Manejo de errores**: Respuestas consistentes y informativas

## 📋 Prerrequisitos

- Node.js (versión 16 o superior)
- PostgreSQL (versión 12 o superior)
- npm o yarn

## 🛠️ Instalación

1. **Clonar el repositorio** (si no lo has hecho ya):
```bash
git clone <url-del-repositorio>
cd Oncologico-Hm-bakend
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar la base de datos**:
   - Crea una base de datos PostgreSQL llamada `oncologico_hm`
   - Ejecuta el script SQL en `database.sql` para crear las tablas

4. **Configurar variables de entorno**:
   Crea un archivo `.env` en la raíz del proyecto:
```env
# Configuración de la base de datos PostgreSQL
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=tu_password_aqui
DB_NAME=oncologico_hm
DB_PORT=5432

# Configuración del servidor
PORT=3003
```

## 🚀 Ejecutar el servidor

### Modo desarrollo (con auto-reload):
```bash
npm run dev
```

### Modo producción:
```bash
npm start
```

El servidor estará disponible en `http://localhost:3003`

## 📚 Endpoints de la API

### Pacientes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/pacientes` | Obtener todos los pacientes |
| GET | `/api/pacientes/:id` | Obtener paciente por ID |
| GET | `/api/pacientes/cedula/:cedula` | Obtener paciente por cédula |
| GET | `/api/pacientes/tipo/:tipo` | Obtener pacientes por tipo |
| POST | `/api/pacientes` | Crear nuevo paciente |
| PUT | `/api/pacientes/:id` | Actualizar paciente |
| DELETE | `/api/pacientes/:id` | Eliminar paciente |

### Ejemplo de uso

#### Crear un paciente:
```bash
curl -X POST http://localhost:3003/api/pacientes \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "cedula": "1234567890",
    "fecha_nacimiento": "1990-05-15",
    "sexo": "masculino",
    "direccion": "Calle Principal 123",
    "telefono": "555-0101",
    "email": "juan.perez@email.com",
    "tipo_paciente": "triaje"
  }'
```

#### Obtener todos los pacientes:
```bash
curl http://localhost:3003/api/pacientes
```

## 🏗️ Estructura del Proyecto

```
src/
├── controlers/          # Controladores (lógica de negocio)
│   └── pacienteController.js
├── models/              # Modelos (interacción con base de datos)
│   └── Paciente.js
├── routes/              # Rutas (definición de endpoints)
│   └── pacientes.js
├── middlewares/         # Middlewares (CORS, autenticación, etc.)
│   └── cors.js
├── utils/               # Utilidades
├── schemas/             # Esquemas de validación
├── db.js               # Configuración de base de datos
├── config.js           # Configuración general
└── index.js            # Punto de entrada del servidor
```

## 🔧 Configuración de la Base de Datos

### Crear la base de datos:
```sql
CREATE DATABASE oncologico_hm;
```

### Ejecutar el script de creación de tablas:
```bash
psql -d oncologico_hm -f database.sql
```

## 📝 Formato de Respuestas

### Respuesta exitosa:
```json
{
  "success": true,
  "data": {...},
  "message": "Operación realizada exitosamente"
}
```

### Respuesta de error:
```json
{
  "success": false,
  "message": "Descripción del error"
}
```

## 🔒 Validaciones

El backend incluye las siguientes validaciones:

- **Campos obligatorios**: nombre, apellido, cédula, fecha de nacimiento, sexo, tipo de paciente
- **Formato de email**: Validación de formato de email si se proporciona
- **Cédula única**: No se permiten cédulas duplicadas
- **Formato de fecha**: La fecha debe estar en formato YYYY-MM-DD
- **Valores permitidos**: Sexo y tipo de paciente tienen valores específicos permitidos

## 🚨 Solución de Problemas

### Error de conexión a PostgreSQL:
- Verifica que PostgreSQL esté ejecutándose
- Confirma las credenciales en el archivo `.env`
- Asegúrate de que la base de datos `oncologico_hm` exista

### Error de CORS:
- Verifica que el frontend esté ejecutándose en uno de los puertos permitidos
- Revisa la configuración en `src/middlewares/cors.js`

### Error de validación:
- Revisa que todos los campos obligatorios estén presentes
- Verifica el formato de los datos enviados

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC. 