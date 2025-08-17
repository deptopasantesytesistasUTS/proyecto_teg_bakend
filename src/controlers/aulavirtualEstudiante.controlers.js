import {
  updateTitles,
  getTitlesInfo,
  getCedulaEstudianteByUserId,
  getMateriasByUserId,
  updateURLs,
  getAllStudentsTitles,
} from "../models/aulavirtualEstudiantes.models.js";
import { getSemesterByDate2 } from "../models/models_admin.js";
export async function getCedulaEstudianteByUserIdController(req, res) {
  try {
    const userId = req.params.userId;
    const cedula = await getCedulaEstudianteByUserId(userId);
    if (cedula) {
      res.json({ cedula });
    } else {
      res.status(404).json({ message: "Estudiante no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//  para obtener materias del estudiante (dashboard)
export async function getMateriasByUserIdController(req, res) {
  try {
    const userId = req.params.userId;
    const today = new Date();
    const isoToday = today.toISOString();
    const lapso = await getSemesterByDate2(isoToday);
    const materias = await getMateriasByUserId(userId, lapso.id);
    res.json(materias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function uploadTitles(req, res) {
  try {
    const titulos = req.body;

    const today = new Date();
    const isoToday = today.toISOString();

    const lapso = await getSemesterByDate2(isoToday);

    const estudiante = await getCedulaEstudianteByUserId(titulos.user);

    await updateTitles(
      titulos.info[0].title,
      titulos.info[1].title,
      titulos.info[2].title,
      titulos.info[0].purpose,
      titulos.info[1].purpose,
      titulos.info[2].purpose,
      titulos.info[0].researchLine,
      titulos.info[1].researchLine,
      titulos.info[2].researchLine,
      titulos.info[0].placeName,
      titulos.info[1].placeName,
      titulos.info[2].placeName,
      titulos.info[0].placeAddress,
      titulos.info[1].placeAddress,
      titulos.info[2].placeAddress,
      titulos.info[0].placePhone,
      titulos.info[1].placePhone,
      titulos.info[2].placePhone,
      titulos.info[0].placeMobile,
      titulos.info[1].placeMobile,
      titulos.info[2].placeMobile,
      estudiante,
      lapso.id,
      parseInt(titulos.idMateria)
    );

    res.json({
      ok: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

export async function getTitlesAula(req, res) {
  try {
    const { userId, idMateria } = req.params;
    const cedula = await getCedulaEstudianteByUserId(parseInt(userId));
    if (!cedula) {
      res.status(404).json({ message: "Estudiante no encontrado" });
    }

    const today = new Date();
    const isoToday = today.toISOString();

    const lapso = await getSemesterByDate2(isoToday);

    const titleInfo = await getTitlesInfo(
      lapso.id,
      cedula,
      parseInt(idMateria)
    );

    console.log(titleInfo);

    res.json([
      {
        title: titleInfo.titulo1,
        purpose: titleInfo.propositoInv1,
        researchLine: titleInfo.lineaInv1,
        placeName: titleInfo.lugar1,
        placeAddress: titleInfo.direccionL1,
        placePhone: titleInfo.lugar1Telf,
        placeMobile: titleInfo.lugar1Movil,
      },
      {
        title: titleInfo.titulo2,
        purpose: titleInfo.propositoInv2,
        researchLine: titleInfo.lineaInv2,
        placeName: titleInfo.lugar2,
        placeAddress: titleInfo.direccionL2,
        placePhone: titleInfo.lugar2Telf,
        placeMobile: titleInfo.lugar2Movil,
      },
      {
        title: titleInfo.titulo3,
        purpose: titleInfo.propositoInv3,
        researchLine: titleInfo.lineaInv3,
        placeName: titleInfo.lugar3,
        placeAddress: titleInfo.direccionL3,
        placePhone: titleInfo.lugar3Telf,
        placeMobile: titleInfo.lugar3Movil,
      },
    ]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

export async function putURLsMatricula(req, res) {
  try {
    const urls = req.body;

    const today = new Date();
    const isoToday = today.toISOString();

    const lapso = await getSemesterByDate2(isoToday);

    const estudiante = await getCedulaEstudianteByUserId(urls.user);

    await updateURLs(
      {
        urlTitulosPDF,
        borrador1,
        borrador2,
        borrador3,
        borrador4,
      },
      estudiante,
      lapso.id,
      parseInt(urls.idMateria)
    );

    res.json({
      ok: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

// Obtener todos los títulos de todos los estudiantes para el Excel
export async function getAllTitlesForExcel(req, res) {
  try {
    console.log("Iniciando getAllTitlesForExcel");
    
    const today = new Date();
    const isoToday = today.toISOString();
    console.log("Fecha actual:", isoToday);

    let lapso = await getSemesterByDate2(isoToday);
    console.log("Lapso encontrado:", lapso);

    // Si no hay lapso activo, buscar el más reciente
    if (!lapso) {
      console.log("No se encontró lapso activo, buscando el más reciente");
      const prisma = (await import("../prisma.js")).default;
      lapso = await prisma.lapsoAcac.findFirst({
        orderBy: {
          fechaInicio: 'desc'
        }
      });
      console.log("Lapso más reciente encontrado:", lapso);
    }

    if (!lapso) {
      console.log("No se encontró ningún lapso");
      return res.status(404).json({ 
        error: "No se encontró ningún lapso académico",
        message: "No hay períodos académicos disponibles para obtener títulos"
      });
    }

    // Obtener todos los estudiantes con sus títulos
    const allTitles = await getAllStudentsTitles(lapso.id);
    console.log("Títulos obtenidos:", allTitles.length);

    res.json(allTitles);
  } catch (error) {
    console.error("Error en getAllTitlesForExcel:", error);
    res.status(500).json({ 
      error: error.message || "Error interno del servidor",
      details: "Error al obtener títulos de estudiantes"
    });
  }
}

