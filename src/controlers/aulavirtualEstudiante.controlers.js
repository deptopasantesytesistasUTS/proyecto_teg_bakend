import { getCedulaEstudianteByUserId , getMateriasByUserId} from "../models/aulavirtualEstudiantes.models.js";

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
    const materias = await getMateriasByUserId(userId);
    res.json(materias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}