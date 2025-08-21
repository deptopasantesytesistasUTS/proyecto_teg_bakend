import {
  getMateriasWithAulaVirtual,
  getMateriaByIdWithAulaVirtual,
  getMateriasDashboard,
  getCedulaPersonalByUserId,
  getParticipantesBySeccion,
  getComunicados,
  createComunicado,
  updateComunicado,
  deleteComunicado,
  getEstadisticasAula,
} from "../models/models_aulavirtual.js";

import { getSemesterByDate2 } from "../models/models_admin.js";

// Controlador para obtener todas las materias con sus secciones (aula virtual)
export async function getMateriasAulaVirtual(req, res) {
  try {
    const materias = await getMateriasWithAulaVirtual();
    console.log("Materias Aula Virtual:", JSON.stringify(materias, null, 2));
    res.json(materias);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener materias" });
  }
}

// Controlador para obtener una materia por id con sus secciones (aula virtual)
export async function getMateriaAulaVirtualById(req, res) {
  try {
    const { id } = req.params;
    const materia = await getMateriaByIdWithAulaVirtual(id);
    if (!materia)
      return res.status(404).json({ error: "Materia no encontrada" });
    res.json(materia);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la materia" });
  }
}

// Controlador para obtener solo el listado de materias para el dashboard
export async function getMateriasDashboardController(req, res) {
  try {
    const { userId, role } = req.query;
    if (!userId || !role) {
      return res.status(400).json({ error: "userId y role son requeridos" });
    }
    const today = new Date();
    const isoToday = today.toISOString();

    const lapso = await getSemesterByDate2(isoToday);

    const materias = await getMateriasDashboard(userId, role, lapso.id);
    res.json(materias);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener materias para dashboard" });
  }
}

// Controlador para obtener la cédula de un usuario en la tabla Personal
export async function getCedulaPersonalController(req, res) {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "userId es requerido" });
    }
    const cedula = await getCedulaPersonalByUserId(userId);
    res.json({ cedula });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la cédula" });
  }
}

// Controlador para obtener participantes de una sección
export async function getParticipantesBySeccionController(req, res) {
  try {
    const { idSeccion } = req.params;
    const participantes = await getParticipantesBySeccion(idSeccion);
    res.json(participantes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener participantes" });
  }
}

export async function getStatisticsAula(req, res) {
  try {
    const { idMateria, cedula } = req.params;
    console.log(req.params)
    console.log(cedula)

    if (!idMateria || !cedula) {
      return res.status(400).json({ error: "Datos faltantes" });
    }

    const participantes = await getEstadisticasAula(parseInt(idMateria),parseInt(cedula));
    let protocolo1 = 0;
    let protocolo2 = 0;
    let protocolo3 = 0;
    let cap1 = 0;
    let cap2 = 0;
    let cap3 = 0;
    let caE = 0;
    let InstrInv = 0;
    let instr1 = 0;
    let instr2 = 0;
    let eProp = 0;
    let Informe = 0;
    let TomoC = 0;
    let Diapositivas = 0;
    let totalEst = 0

    participantes.map((p) => {
      totalEst = totalEst + 1
      if (p.urlTitulo1PDF !== null) protocolo1 = protocolo1 + 1;
      if (p.urlTitulo1PDF !== null) protocolo2 = protocolo2 + 1;
      if (p.urlTitulo1PDF !== null) protocolo3 = protocolo3 + 1;
      if (p.borrador1 !== null) {
        if (p.Secciones.Materias.categoria === "Trabajo_Especial_de_Grado")
          eProp = eProp + 1;
        else cap1 = cap1 +1;
      }
      if (p.borrador2 !== null) {
        if (p.Secciones.Materias.categoria === "Trabajo_Especial_de_Grado")
          Informe = Informe + 1;
        else cap2 = cap2 + 1;
      }
      if (p.borrador3 !== null) {
        if (p.Secciones.Materias.categoria === "Trabajo_Especial_de_Grado")
          TomoC = TomoC + 1;
        else cap3 = cap3 + 1;
      }
      if (p.borrador4 !== null) InstrInv = InstrInv + 1;
      if (p.borradorFinal !== null) Diapositivas = Diapositivas + 1;
      if (p.instr1Url !== null) instr1 = instr1 + 1;
      if (p.instr2Url !== null) instr2 = instr2 + 1;
      if (p.urlCartaEntrega !== null) caE = caE +1;
    });

    res.json({
    totalEst,
    protocolo1,
    protocolo2,
    protocolo3,
    cap1,
    cap2,
    cap3,
    caE,
    InstrInv,
    instr1,
    instr2,
    eProp,
    Informe,
    TomoC,
    Diapositivas,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error al obtener participantes" });
  }
}

// ================= Comunicados (CRUD) =================

export async function getComunicadosController(req, res) {
  try {
    const { seccionId, limit } = req.query;
    const comunicados = await getComunicados({ seccionId, limit });
    res.json(comunicados);
  } catch (error) {
    console.error("Error en getComunicadosController:", error);
    res.status(500).json({ error: "Error al obtener comunicados" });
  }
}

export async function postComunicadosController(req, res) {
  try {
    const { titulo, texto, idUsuario, seccionesIds } = req.body;
    if (!titulo || !texto) {
      return res.status(400).json({ error: "titulo y texto son requeridos" });
    }
    const comunicado = await createComunicado({
      titulo,
      texto,
      idUsuario,
      seccionesIds,
    });
    res.status(201).json(comunicado);
  } catch (error) {
    console.error("Error en postComunicadosController:", error);
    res.status(500).json({ error: "Error al crear comunicado" });
  }
}

export async function putComunicadosController(req, res) {
  try {
    const { id } = req.params;
    const { titulo, texto } = req.body;
    const comunicado = await updateComunicado(id, { titulo, texto });
    res.json(comunicado);
  } catch (error) {
    console.error("Error en putComunicadosController:", error);
    res.status(500).json({ error: "Error al actualizar comunicado" });
  }
}

export async function deleteComunicadosController(req, res) {
  try {
    const { id } = req.params;
    await deleteComunicado(id);
    res.json({ ok: true });
  } catch (error) {
    console.error("Error en deleteComunicadosController:", error);
    res.status(500).json({ error: "Error al eliminar comunicado" });
  }
}
