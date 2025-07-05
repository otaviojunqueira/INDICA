import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Notice, Entity, User } from '../models';
import { handleAsync } from '../utils/errorHandler';
import mongoose from 'mongoose';

// Controller para editais
export const noticeController = {
  // Listar editais com priorização por cidade do usuário
  listNotices: handleAsync(async (req: Request, res: Response) => {
    const { 
      status, 
      category, 
      entity, 
      city,
      startDate, 
      endDate, 
      query,
      page = 1, 
      limit = 10 
    } = req.query;
    
    // Construir filtro de busca
    const filter: any = {};
    
    if (status) {
      filter.status = status;
    } else {
      // Por padrão, mostrar apenas editais publicados
      filter.status = 'published';
    }
    
    if (category) {
      filter.categories = { $in: [category.toString()] };
    }
    
    if (entity) {
      filter.entityId = new mongoose.Types.ObjectId(entity.toString());
    }
    
    if (city) {
      filter.cityId = new mongoose.Types.ObjectId(city.toString());
    }
    
    if (startDate) {
      filter.startDate = { $gte: new Date(startDate.toString()) };
    }
    
    if (endDate) {
      filter.endDate = { $lte: new Date(endDate.toString()) };
    }
    
    if (query) {
      filter.$or = [
        { title: { $regex: query.toString(), $options: 'i' } },
        { description: { $regex: query.toString(), $options: 'i' } }
      ];
    }
    
    // Calcular paginação
    const skip = (Number(page) - 1) * Number(limit);
    
    // Obter a cidade do usuário autenticado, se houver
    let userCityId = null;
    if (req.user && req.user.id) {
      const user = await User.findById(req.user.id).select('cityId');
      if (user && user.cityId) {
        userCityId = user.cityId;
      }
    }
    
    // Buscar editais
    let notices;
    
    // Se o usuário tem uma cidade definida, priorizar editais dessa cidade
    if (userCityId && !city) {
      // Primeiro, buscar editais da cidade do usuário
      const cityNotices = await Notice.find({ ...filter, cityId: userCityId })
        .sort({ startDate: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('entityId', 'name')
        .populate('cityId', 'name state stateCode');
      
      // Depois, buscar outros editais (excluindo os da cidade do usuário)
      const otherNotices = await Notice.find({ ...filter, cityId: { $ne: userCityId } })
        .sort({ startDate: -1 })
        .skip(Math.max(0, skip - cityNotices.length))
        .limit(Math.max(0, Number(limit) - cityNotices.length))
        .populate('entityId', 'name')
        .populate('cityId', 'name state stateCode');
      
      // Combinar os resultados
      notices = [...cityNotices, ...otherNotices];
    } else {
      // Busca normal sem priorização
      notices = await Notice.find(filter)
        .sort({ startDate: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('entityId', 'name')
        .populate('cityId', 'name state stateCode');
    }
    
    // Contar total de documentos para paginação
    const total = await Notice.countDocuments(filter);
    
    res.json({
      notices,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  }),
  
  // Obter edital por ID
  getNoticeById: handleAsync(async (req: Request, res: Response) => {
    const notice = await Notice.findById(req.params.id)
      .populate('entityId', 'name cnpj contactEmail contactPhone')
      .populate('cityId', 'name state stateCode');
    
    if (!notice) {
      return res.status(404).json({ message: 'Edital não encontrado' });
    }
    
    res.json(notice);
  }),
  
  // Criar um novo edital (apenas admin)
  create: handleAsync(async (req: Request, res: Response) => {
      // Validar os dados da requisição
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Verificar se o usuário tem permissão (admin)
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acesso negado' });
      }

      const {
        title,
        description,
        entityId,
        cityId,
        startDate,
        endDate,
        totalAmount,
        maxApplicationValue,
        minApplicationValue,
        categories,
        requirements,
        documents,
        evaluationCriteria,
        // Novos campos do modelo MinC
        quotas,
        accessibility,
        stages,
        appealPeriod,
        habilitationDocuments,
        budget
      } = req.body;
    
      // Verificar se a entidade existe
      const entity = await Entity.findById(entityId);
      if (!entity) {
        return res.status(400).json({ message: 'Entidade não encontrada' });
      }

      // Criar o novo edital
      const notice = new Notice({
        title,
        description,
        entityId,
        cityId,
        startDate,
        endDate,
        totalAmount,
        maxApplicationValue,
        minApplicationValue,
        categories: categories || [],
        requirements: requirements || [],
        documents: documents || [],
        evaluationCriteria: evaluationCriteria || [],
        // Novos campos do modelo MinC
        quotas: quotas || {
          blackQuota: 0,
          indigenousQuota: 0,
          disabilityQuota: 0
        },
        accessibility: accessibility || {
          physical: [],
          communicational: [],
          attitudinal: []
        },
        stages: stages || [],
        appealPeriod: appealPeriod || {
          selectionAppealDays: 3,
          habilitationAppealDays: 3
        },
        habilitationDocuments: habilitationDocuments || [],
        budget: budget || {
          totalAmount: totalAmount,
          maxValue: maxApplicationValue,
          minValue: minApplicationValue,
          allowedExpenses: []
        }
      });

      await notice.save();

      res.status(201).json({
        message: 'Edital criado com sucesso',
        notice
      });
  }),

  // Atualizar edital (apenas admin)
  update: handleAsync(async (req: Request, res: Response) => {
    // Validar os dados da requisição
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Verificar se o usuário tem permissão (admin)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    
    const noticeId = req.params.id;
    
    // Verificar se o edital existe
    const notice = await Notice.findById(noticeId);
    if (!notice) {
      return res.status(404).json({ message: 'Edital não encontrado' });
    }
    
    // Atualizar os campos
    const updateData = req.body;
    Object.keys(updateData).forEach(key => {
      if (key !== '_id' && key !== 'createdAt' && key !== 'updatedAt') {
        (notice as any)[key] = updateData[key];
      }
    });
    
    await notice.save();

    res.json({
      message: 'Edital atualizado com sucesso',
      notice
    });
  }),

  // Excluir edital (apenas admin)
  delete: handleAsync(async (req: Request, res: Response) => {
    // Verificar se o usuário tem permissão (admin)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    
    const noticeId = req.params.id;
    
    // Verificar se o edital existe
    const notice = await Notice.findById(noticeId);
    if (!notice) {
      return res.status(404).json({ message: 'Edital não encontrado' });
    }
    
    // Em vez de excluir, apenas cancelar
    notice.status = 'canceled';
    await notice.save();

    res.json({
      message: 'Edital cancelado com sucesso'
    });
  })
};

export default noticeController; 