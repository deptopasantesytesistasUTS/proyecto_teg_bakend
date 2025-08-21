import prisma from "../prisma.js";
import { generarToken } from "../authentication.js";
import { getProfileImageDB, getUserByCorreo, getUserById, getUserProfileAdm, getUserProfileDoc, getUserProfileEst, putImagen, putPasswordbyEmail, updateCorreo } from "../models/models_login.js";
import { editUserbyCedulaE } from "../models/models_admin.js";
import bcryptjs from "bcryptjs";
import transporter from "../../config/nodemailer.js";
import multer from "multer";
import fs from "fs"
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

export async function loginUser(req, res) {
  const { correo, password } = req.body;
  console.log(correo);
  console.log(password);
  if (!correo || !password) {
    return res.status(400).json({ error: "Correo y contraseña son requeridos" });
  }
  try {
    const user = await getUserByCorreo(correo);
    console.log(user);
    console.log(password);
    if (!user) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }

    if(!(user.status === "activo")) return res
      .status(400)
      .json({ error: "Acceso Denegado" });

    const isMatch = await bcryptjs.compare(password, user.password);
    // Comparación simple, en producción usa hash
    if (!isMatch) {
      return res
        .status(401)
        .json({ error: "Usuario o contraseña incorrectos" });
    }
    // Registrar última sesión para alimentar "últimos conectados"
    try {
      await prisma.users.update({
        where: { userId: user.userId },
        data: { last_sesion: new Date(), online: 1 },
      });
    } catch (e) {
      console.error("No se pudo actualizar last_sesion:", e?.message || e);
    }
    // Incluye el rol en el token
    const token = generarToken({ userId: user.userId, role: user.role_id, correo: user.correo });
    res.json({ token, user: { userId: user.userId, correo: user.correo, role: user.role_id } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
}

export async function getProfileInfo(req,res) {
  const {userId} = req.params;

  if (!userId) {
    return res
      .status(400)
      .json({ error: "Id de usuario no valida" });
  }

  try {
      const usuario = await getUserById(parseInt(userId));
      let perfil
      let perfilInfo
  
      if (!usuario) {
        return res.status(400).json({
          error: "Error en la obtencion del usuario",
        });
      }
  
      if(usuario.role_id == 1){
        perfil = await getUserProfileAdm(parseInt(userId))

        perfilInfo = {
          firstName: perfil.Personal.nombre1 || "Usuario",
          secondName: perfil.Personal.nombre2 || "",
          firstLastName: perfil.Personal.apellido1 || "",
          secondLastName: perfil.Personal.apellido2 || "",
          id: perfil.Personal.cedula || "",
          phone: perfil.Personal.telf || "",
          email: perfil.correo,
          role: perfil.Roles.nombre,
        };
      }
      else if (usuario.role_id == 2)
      {
        perfil = await getUserProfileDoc(parseInt(userId));
        perfilInfo = {
          firstName: perfil.Personal.nombre1 || "Usuario",
          secondName: perfil.Personal.nombre2 || "DOcente",
          firstLastName: perfil.Personal.apellido1 || "",
          secondLastName: perfil.Personal.apellido2 || "",
          id: perfil.Personal.cedula || "",
          phone: perfil.Personal.telf || "",
          email: perfil.correo,
          role: perfil.Roles.nombre,
        };
      }
      else if (usuario.role_id == 3){
        perfil = await getUserProfileEst(parseInt(userId));
        console.log(perfil);
        perfilInfo = {
          firstName: perfil.Estudiantes.nombre1 || "Usuario",
          secondName: perfil.Estudiantes.nombre2 || "DOcente",
          firstLastName: perfil.Estudiantes.apellido1 || "",
          secondLastName: perfil.Estudiantes.apellido2 || "",
          id: perfil.Estudiantes.cedula || "",
          phone: perfil.Estudiantes.telf || "",
          email: perfil.correo,
          role: perfil.Roles.nombre,
        };
      }
        res.json(
          perfilInfo
        );
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || "Error en el servidor" });
    }
}  

export async function putProfile(req,res) {
  const perfil = req.body

  try {
  
    await updateCorreo(perfil.userId,perfil)

    res.json({
      token,
      user: { userId: user.userId, correo: user.correo, role: user.role_id },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
}

export async function UpdatePassword(req, res) {
  const { userId, currentPassword, newPassword } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "Error en los datos ingresados" });
  }
  try {

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    const user = await getUserById(parseInt(userId))

    const isMatch = true //await bcryptjs.compare(currentPassword, user.password);
    // Comparación simple, en producción usa hash
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid current password" });
    }

    const editedUser = await putPasswordbyEmail(user.correo, hashedPassword);

    if (!editedUser) {
      return res.status(400).json({
        error: "El usuario no se pudo editar",
      });
    }

    await transporter.sendMail({
      from: "UTS San Cristobal",
      to: editedUser.correo,
      subject: `Cambio de Contraseña Usuario UTS San Cristobal`,
      text: ` Buen Día se le informa que el usuario asociado a este correo ha realizado un cambio de contraseña, si desconoce dicha operacion por favor ponerse en contacto con la
      coordinación
        `,
    });

    res.json({
      ok: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Error en el servidor" });
  }
}

export async function uploadImages(req, res) {
  // Configuración de Multer (debe estar fuera del try-catch para el manejo correcto)
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = "assets/profileImages/";
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const userId = req.body.userId || "unknown";
      const ext = path.extname(file.originalname);
      const filename = `profile_${userId}_${Date.now()}${ext}`;
      cb(null, filename);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes (JPEG, PNG)"), false);
    }
  };

  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 2 * 1024 * 1024, // 2MB
    },
  }).single("profileImage"); // Asegúrate que coincide con el nombre del campo en el FormData

  // Ejecutamos Multer como middleware
  upload(req, res, async (err) => {
    try {
      console.log(req.body)
      // Manejo de errores de Multer
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message: "La imagen no debe exceder los 2MB",
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      // Validar que se subió un archivo
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No se proporcionó ninguna imagen",
        });
      }

      // Validar userId
      const userId = req.body.userId;
      if (!userId) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
          success: false,
          message: "ID de usuario requerido",
        });
      }

      // Procesar imagen
      const outputFilename = `profile_${userId}_${Date.now()}.webp`;
      const outputPath = path.join("assets/profileImages/", outputFilename);

      await sharp(req.file.path)
        .resize(80, 80, {
          fit: "cover",
          position: "center",
          withoutEnlargement: true,
        })
        .webp({ quality: 80 }) // 80% de calidad para optimización
        .toFile(outputPath);

      // Eliminar el archivo original
      fs.unlinkSync(req.file.path);

      await putImagen(parseInt(userId),outputFilename)

      // Respuesta exitosa
      res.status(200).json({
        success: true,
        message: "Imagen de perfil actualizada exitosamente",
        imagePath: `profileImages/${outputFilename}`, // Ruta relativa
      });
    } catch (error) {
      console.error("Error al procesar imagen:", error);

      // Limpieza de archivos en caso de error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      if (outputPath && fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }

      res.status(500).json({
        success: false,
        message: "Error al procesar la imagen",
        error: process.env.NODE_ENV === "development" ? error.message : null,
      });
    }
  });
}

export async function getProfileImage(req, res) {
  try {
    const { userId } = req.params;
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Se requiere el ID de usuario",
      });
    }

    // Buscar la imagen en el directorio
    const directoryPath = path.join(__dirname, "../../assets/profileImages");
    const files = fs.readdirSync(directoryPath);

    const user = await getProfileImageDB(parseInt(userId));
    const ruta = user.imagen;


    // Buscar archivos que coincidan con el patrón del usuario
    const userImage = files.find((file) =>
      file.startsWith(ruta)
    );

    if (!userImage) {
      // Puedes devolver una imagen por defecto si no se encuentra
      const defaultImage = path.join(
        __dirname,
        "../../assets/default-profile.webp"
      );
      return res.sendFile(defaultImage);
    }

    const imagePath = path.join(directoryPath, userImage);

    // Verificar que el archivo existe antes de enviarlo
    if (!fs.existsSync(imagePath)) {
      const defaultImage = path.join(
        __dirname,
        "../../assets/default-profile.webp"
      );
      return res.sendFile(defaultImage);
    }

    // Configurar headers para caching (opcional)
    res.setHeader("Cache-Control", "public, max-age=86400"); // Cache de 1 día

    return res.sendFile(imagePath);
  } catch (error) {
    console.error("Error al obtener imagen:", error);

    // Intentar devolver imagen por defecto en caso de error
    try {
      const defaultImage = path.join(
        __dirname,
        "../../assets/default-profile.webp"
      );
      return res.sendFile(defaultImage);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error al obtener la imagen de perfil",
      });
    }
  }
}

// Usuarios conectados (para dashboard)
export async function getConnectedUsers(req, res) {
  try {
    const limit = Math.min(parseInt(req.query.limit || "10", 10), 50);
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const statusFilter = (req.query.status || "online").toLowerCase();
    const where = {};
    if (statusFilter !== "all") {
      if (statusFilter === "online") where.online = 1;
      if (statusFilter === "offline") where.online = 0;
      // Para "away" usamos filtro por tiempo después; no hay bandera específica
    }

    const users = await prisma.users.findMany({
      where,
      include: {
        Roles: true,
        Estudiantes: {
          include: {
            Carreras: true,
          },
        },
        Personal: true,
      },
      orderBy: [{ last_sesion: "desc" }],
      take: limit,
    });

    const now = Date.now();
    const result = users.map((u) => {
      const lastSesionMs = u.last_sesion ? new Date(u.last_sesion).getTime() : 0;
      const diffMin = lastSesionMs ? Math.floor((now - lastSesionMs) / (1000 * 60)) : Infinity;
      let status = "offline";
      if (u.online === 1) {
        status = "online";
      } else if (diffMin <= 60) {
        status = "away";
      }

      const roleName = u.Roles?.nombre || String(u.role_id);
      const isStudent = u.role_id === 3 || /estudiante/i.test(roleName || "");
      const isTeacher = u.role_id === 2 || /docente/i.test(roleName || "");

      const student = u.Estudiantes || null;
      const teacher = Array.isArray(u.Personal) ? u.Personal[0] : u.Personal;

      const name = [
        (isStudent ? student?.nombre1 : teacher?.nombre1) || "",
        (isStudent ? student?.nombre2 : teacher?.nombre2) || "",
        (isStudent ? student?.apellido1 : teacher?.apellido1) || "",
        (isStudent ? student?.apellido2 : teacher?.apellido2) || "",
      ]
        .filter(Boolean)
        .join(" ") || u.correo;

      const department = isStudent
        ? student?.Carreras?.nombre || "Estudiante"
        : isTeacher
        ? "Docente"
        : "Administrador";

      return {
        id: u.userId,
        name,
        avatar: `${baseUrl}/api/user/profileImage/${u.userId}`,
        status,
        role: roleName || "Usuario",
        department,
        lastSeen: lastSesionMs || now, // número en ms para compatibilidad con frontend
      };
    });

    const filtered = statusFilter === "all"
      ? result
      : result.filter((u) => (u.status || "").toLowerCase() === statusFilter);
    res.json(filtered);
  } catch (error) {
    console.error("Error getConnectedUsers:", error);
    res.status(500).json({ error: "Error al obtener usuarios conectados" });
  }
}

// Logout: marcar usuario como offline
export async function logoutUser(req, res) {
  try {
    const userId = parseInt(req.body?.userId || req.query?.userId, 10);
    if (!userId || Number.isNaN(userId)) {
      return res.status(400).json({ error: "userId es requerido" });
    }
    await prisma.users.update({
      where: { userId },
      data: { online: 0, last_sesion: new Date() },
    });
    return res.json({ ok: true });
  } catch (error) {
    console.error("Error logoutUser:", error);
    return res.status(500).json({ error: "Error al cerrar sesión" });
  }
}
