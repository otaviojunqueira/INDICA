import { Request, Response } from 'express';
import { Op } from 'sequelize';
import CulturalEvent from '../models/CulturalEvent.model';

export const createEvent = async (req: Request, res: Response) => {
  try {
    const eventData = {
      ...req.body,
      createdBy: req.user?.id,
    };

    const event = await CulturalEvent.create(eventData);
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

    const where: any = {};

    if (startDate && endDate) {
      where.startDate = {
        [Op.between]: [new Date(startDate as string), new Date(endDate as string)],
      };
    }

    if (state) where.state = state;
    if (city) where.city = city;
    if (eventType) where.eventType = eventType;
    if (category) where.category = category;
    if (status) where.status = status;

    const events = await CulturalEvent.findAll({
      where,
      order: [['startDate', 'ASC']],
    });

    return res.json(events);
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    return res.status(500).json({ message: 'Erro ao buscar eventos culturais' });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await CulturalEvent.findByPk(id);

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
    const event = await CulturalEvent.findByPk(id);

    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    // Verifica se o usuário tem permissão para editar o evento
    if (event.createdBy !== req.user?.id) {
      return res.status(403).json({ message: 'Sem permissão para editar este evento' });
    }

    await event.update(req.body);
    return res.json(event);
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    return res.status(500).json({ message: 'Erro ao atualizar evento cultural' });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await CulturalEvent.findByPk(id);

    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    // Verifica se o usuário tem permissão para deletar o evento
    if (event.createdBy !== req.user?.id) {
      return res.status(403).json({ message: 'Sem permissão para deletar este evento' });
    }

    await event.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    return res.status(500).json({ message: 'Erro ao deletar evento cultural' });
  }
}; 