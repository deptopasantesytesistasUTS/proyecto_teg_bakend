import {
  getCedulaEstudianteByUserId,
  getMateriasByUserId,
  getTitlesInfo,
  updateTitles,
  updateURLs,
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
      },
      {
        title: titleInfo.titulo2,
        purpose: titleInfo.propositoInv2,
        researchLine: titleInfo.lineaInv2,
      },
      {
        title: titleInfo.titulo3,
        purpose: titleInfo.propositoInv3,
        researchLine: titleInfo.lineaInv3,
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

