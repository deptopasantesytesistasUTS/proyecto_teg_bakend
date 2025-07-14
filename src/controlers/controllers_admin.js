import {
  getSemesterByDate,
  createSemester,
  getSemesterbyId,
  editSemesterById,
} from "../models/models_admin.js";

export async function getSemesterInfo(req, res) {
  const { fecha } = req.params;
  if (!fecha) {
    return res.status(400).json({ error: "Error en la Fecha" });
  }
  try {
    const semester = await getSemesterByDate(fecha);

    if (!semester) {
      return res.status(401).json({ error: "No hay lapso academico activo" });
    }

    res.json({
      semester: {
        id: semester.id,
        startDate: semester.fechaInicio,
        endDate: semester.fechaFinal,
        titleDeliveryDate: semester.fechaTitulos,
        firstDraftDate: semester.fechaB1,
        secondDraftDate: semester.fechaB2,
        thirdDraftDate: semester.fechaB3,
        finalDraftDate: semester.fechaBFinal,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Error en el servidor" });
  }
}

function convertFecha(fecha) {
  if (isNaN(new Date(fecha + "T00:00:00.000Z"))) return fecha;
  const startOfDayUTC = new Date(fecha + "T00:00:00.000Z");
  // Convert it to an ISO string
  return startOfDayUTC.toISOString();
}

export async function createNewSemester(req, res) {
  const { newSemester } = req.body;
  if (!newSemester) {
    return res.status(400).json({ error: "Error en los datos ingresados" });
  }
  try {
    const comprobacionFechaInicio = await getSemesterByDate(
      newSemester.startDate
    );
    const comprobacionFechaFinal = await getSemesterByDate(newSemester.endDate);

    console.log(comprobacionFechaInicio);
    console.log(comprobacionFechaFinal);

    if (comprobacionFechaFinal || comprobacionFechaInicio) {
      return res.status(400).json({
        error:
          "Las fechas ingresadas generan conflicto con un semestre ya existente",
      });
    }

    const startOfDayUTC = new Date(newSemester.startDate + "T00:00:00.000Z");

    // Convert it to an ISO string
    const startDate = startOfDayUTC.toISOString();

    const endOfDay1 = new Date(newSemester.endDate + "T23:59:59.999Z");

    // Convert it to an ISO string
    const endDate = endOfDay1.toISOString();

    const endOffirstDraftDate = new Date(
      newSemester.finalDraftDate + "T23:59:59.999Z"
    );

    // Convert it to an ISO string
    const firstDraftDate = endOffirstDraftDate.toISOString();

    const endOfsecondDraftDate = new Date(
      newSemester.secondDraftDate + "T23:59:59.999Z"
    );

    // Convert it to an ISO string
    const secondDraftDate = endOfsecondDraftDate.toISOString();

    const endOfthirdDraftDate = new Date(
      newSemester.thirdDraftDate + "T23:59:59.999Z"
    );

    // Convert it to an ISO string
    const thirdDraftDate = endOfthirdDraftDate.toISOString();

    const endOfDayfinalDraftDate = new Date(
      newSemester.finalDraftDate + "T23:59:59.999Z"
    );

    // Convert it to an ISO string
    const finalDraftDate = endOfDayfinalDraftDate.toISOString();

    const endOftitleDeliveryDate = new Date(
      newSemester.titleDeliveryDate + "T23:59:59.999Z"
    );

    // Convert it to an ISO string
    const titleDeliveryDate = endOftitleDeliveryDate.toISOString();

    const semester = await createSemester(
      parseInt(newSemester.id, 10),
      startDate,
      endDate,
      firstDraftDate,
      secondDraftDate,
      thirdDraftDate,
      finalDraftDate,
      titleDeliveryDate
    );

    if (!semester) {
      return res.status(400).json({
        error: "Fallo en la creacion del nuevo semestre",
      });
    }

    res.json({
      semester: semester,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Error en el servidor" });
  }
}

export async function editSemester(req, res) {
  const { editSemester } = req.body;
  if (!editSemester) {
    return res.status(400).json({ error: "Error en los datos ingresados" });
  }
  try {
    const semester = getSemesterbyId(editSemester.id);

    if (!semester) {
      return res.status(400).json({
        error: "El Semestre señalado no existe",
      });
    }

    const editedSemester = await editSemesterById(editSemester.id, {
      fechaInicio: convertFecha(editSemester.startDate),
      fechaFinal: convertFecha(editSemester.endDate),
      fechaB1: convertFecha(editSemester.firstDraftDate),
      fechaB2: convertFecha(editSemester.secondDraftDate),
      fechaB3: convertFecha(editSemester.thirdDraftDate),
      fechaBFinal: convertFecha(editSemester.finalDraftDate),
      fechaTitulos: convertFecha(editSemester.titleDeliveryDate),
    });

    if (!editSemester) {
      return res.status(400).json({
        error: "El Semestre no se pudo editar",
      });
    }

    res.json({
      ok: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Error en el servidor" });
  }
}
