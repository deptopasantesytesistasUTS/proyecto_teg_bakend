import {
  getCarreras,
  getSectionsbyCareer,
  getSectionsTutorbyCareer,
} from "../models/generalInfo.models.js";
import { getSemesterByDate2 } from "../models/models_admin.js";

export async function getCareers(req, res) {
  try {
    const carreras = await getCarreras();

    if (!carreras) {
      return res.status(401).json({ error: "Error al obtener carreras" });
    }

    console.log(carreras);

    res.json(carreras);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Error en el servidor" });
  }
}

export async function getSections(req, res) {
  try {
    const { carrera } = req.params;

    const today = new Date();
    const isoToday = today.toISOString();

    const lapso = await getSemesterByDate2(isoToday);

    if (!lapso) {
      return res
        .status(401)
        .json({ error: "Error al obtener lapso academico" });
    }

    const secciones = await getSectionsbyCareer(parseInt(carrera), lapso);

    if (!secciones) {
      return res.status(401).json({ error: "Error al obtener secciones" });
    }

    res.json(secciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Error en el servidor" });
  }
}

export async function getSectionsTutor(req, res) {
  try {
    const { carrera } = req.params;

    const today = new Date();
    const isoToday = today.toISOString();

    const lapso = await getSemesterByDate2(isoToday);

    if (!lapso) {
      return res
        .status(401)
        .json({ error: "Error al obtener lapso academico" });
    }

    const secciones = await getSectionsTutorbyCareer(parseInt(carrera), lapso);

    if (!secciones) {
      return res.status(401).json({ error: "Error al obtener secciones" });
    }

    res.json(secciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Error en el servidor" });
  }
}
