import prisma from "../prisma.js";
import { generarToken } from "../authentication.js";
import { getUserByCorreo, getUserById, getUserProfileAdm, getUserProfileDoc, getUserProfileEst, updateCorreo } from "../models/models_login.js";

export async function loginUser(req, res) {
  const { correo, password } = req.body;
  if (!correo || !password) {
    return res.status(400).json({ error: "Correo y contraseña son requeridos" });
  }
  try {
    const user = await getUserByCorreo(correo);
    if (!user) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }
    const isMatch = await bcryptjs.compare(password, user.password);
    // Comparación simple, en producción usa hash
    if (!isMatch) {
      return res
        .status(401)
        .json({ error: "Usuario o contraseña incorrectos" });
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
