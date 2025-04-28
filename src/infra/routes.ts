import express from "express";
import { NotasController } from "./controllers/NotasController";
import { NotasRepository } from "../infra/repositories/NotasRepository";
import { ConsultarNotas } from "../domain/usecases/notas/ConsultarNotas";

const router = express.Router();
const notasRepository = new NotasRepository();
const consultarNotas = new ConsultarNotas(notasRepository);
const notasController = new NotasController(consultarNotas);

router.get("/notas", notasController.listar.bind(notasController));

export default router;