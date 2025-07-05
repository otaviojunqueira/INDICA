import { Request, Response } from 'express';
import { User } from '../models';
import { handleAsync } from '../utils/errorHandler';

export const entityController = {
  // Listar todos os entes federados
  getAllEntities: handleAsync(async (req: Request, res: Response) => {
    const entities = await User.find({ role: 'entity' })
      .select('-password')
      .populate('cityId', 'name state');

    res.json(entities);
  }),

  // Buscar entes federados com filtros
  searchEntities: handleAsync(async (req: Request, res: Response) => {
    const { name, state, isActive } = req.query;
    
    const query: any = { role: 'entity' };
    
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const entities = await User.find(query)
      .select('-password')
      .populate({
        path: 'cityId',
        match: state ? { state } : {},
        select: 'name state'
      });

    // Filtrar entidades que não têm cidade correspondente quando o estado é especificado
    const filteredEntities = state
      ? entities.filter(entity => entity.cityId)
      : entities;

    res.json(filteredEntities);
  }),

  // Obter um ente federado específico
  getEntity: handleAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const entity = await User.findOne({ _id: id, role: 'entity' })
      .select('-password')
      .populate('cityId', 'name state');

    if (!entity) {
      return res.status(404).json({ message: 'Ente federado não encontrado' });
    }

    res.json(entity);
  }),

  // Atualizar um ente federado
  updateEntity: handleAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    // Remover campos que não devem ser atualizados
    delete updateData.password;
    delete updateData.role;
    delete updateData.cpfCnpj;
    delete updateData.cityId;

    const entity = await User.findOneAndUpdate(
      { _id: id, role: 'entity' },
      updateData,
      { new: true }
    )
    .select('-password')
    .populate('cityId', 'name state');

    if (!entity) {
      return res.status(404).json({ message: 'Ente federado não encontrado' });
    }

    res.json(entity);
  }),

  // Alterar status do ente federado (ativar/desativar)
  toggleEntityStatus: handleAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isActive } = req.body;

    const entity = await User.findOneAndUpdate(
      { _id: id, role: 'entity' },
      { isActive },
      { new: true }
    )
    .select('-password')
    .populate('cityId', 'name state');

    if (!entity) {
      return res.status(404).json({ message: 'Ente federado não encontrado' });
    }

    res.json(entity);
  })
};