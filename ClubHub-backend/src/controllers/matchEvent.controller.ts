import { Request, Response } from "express";
import * as service from "../services/matchEvent.service";

export const createMatchEvent = async (req: Request, res: Response) => {
  try {
    const { matchId } = req.params;

    const event = await service.createEvent(Number(matchId), req.body);

    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao criar evento" });
  }
};

export const updateMatchEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const event = await service.updateEvent(Number(id), req.body);

    res.json(event);
  } catch (err) {
    res.status(500).json({ message: "Erro ao atualizar evento" });
  }
};

export const deleteMatchEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await service.deleteEvent(Number(id));

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Erro ao apagar evento" });
  }
};