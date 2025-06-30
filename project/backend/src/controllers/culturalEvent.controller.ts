import { Request, Response } from 'express';
import CulturalEvent from '../models/CulturalEvent.model';

export const createEvent = async (req: Request, res: Response) => {
  try {
    const eventData = {
      ...req.body,
      createdBy: req.user?.id,
    };

    const event = new CulturalEvent(eventData);
    await event.save();
    return res.status(201).json(event);
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    return res.status(500).json({ message: 'Erro ao criar evento cultural' });
  }
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    const {
      startDate,
      endDate,
      state,
      city,
      eventType,
      category,
      status,
    } = req.query;

    const filter: any = {};

    if (startDate && endDate) {
      filter.startDate = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    if (state) filter.state = state;
    if (city) filter.city = city;
    if (eventType) filter.eventType = eventType;
    if (category) filter.category = category;
    if (status) filter.status = status;

    const events = await CulturalEvent.find(filter)
      .sort({ startDate: 1 });

    return res.json(events);
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    return res.status(500).json({ message: 'Erro ao buscar eventos culturais' });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await CulturalEvent.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    return res.json(event);
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    return res.status(500).json({ message: 'Erro ao buscar evento cultural' });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await CulturalEvent.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    // Verifica se o usuário tem permissão para editar o evento
    if (event.createdBy.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Sem permissão para editar este evento' });
    }

    Object.assign(event, req.body);
    await event.save();
    return res.json(event);
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    return res.status(500).json({ message: 'Erro ao atualizar evento cultural' });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await CulturalEvent.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    // Verifica se o usuário tem permissão para deletar o evento
    if (event.createdBy.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Sem permissão para deletar este evento' });
    }

    await CulturalEvent.deleteOne({ _id: event._id });
    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    return res.status(500).json({ message: 'Erro ao deletar evento cultural' });
  }
}; 