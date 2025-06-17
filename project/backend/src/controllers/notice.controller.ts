import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Notice, Entity } from '../models';
import { handleAsync } from '../utils/errorHandler';

// Controller para editais
export const noticeController = {
  // Criar um novo edital
  create: async (req: Request, res: Response) => {
    try {
      // Validar os dados da requisição
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Verificar se o usuário tem permissão (admin)
      const userRole = req.user.role;
      if (userRole !== 'admin') {
        return res.status(403).json({ message: 'Acesso negado' });
      }

      const {
        title,
        description,
        entityId,
        startDate,
        endDate,
        totalAmount,
        maxApplicationValue,
        minApplicationValue,
        categories,
        requirements,
        documents,
        evaluationCriteria
      } = req.body;

      // Criar o novo edital
      const notice = new Notice({
        title,
        description,
        entityId,
        startDate,
        endDate,
        totalAmount,
        maxApplicationValue,
        minApplicationValue,
        categories: categories || [],
        requirements: requirements || [],
        documents: documents || [],
        evaluationCriteria: evaluationCriteria || []
      });

      await notice.save();

      res.status(201).json({
        message: 'Edital criado com sucesso',
        notice
      });
    } catch (error) {
      console.error('Erro ao criar edital:', error);
      res.status(500).json({ message: 'Erro no servidor' });
    }
  },

  // Listar editais com filtros e ordenação
  listNotices: handleAsync(async (req: Request, res: Response) => {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = 'published',
      category,
      city,
      state,
      sortByLocation = false,
      minValue,
      maxValue
    } = req.query;

    // Construir query base
    const baseQuery: any = {
      status
    };

    // Adicionar filtro de busca
    if (search) {
      baseQuery.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Adicionar filtro de categoria
    if (category) {
      baseQuery.categories = category;
    }

    // Adicionar filtros de localização
    if (city || state) {
      const entityQuery: any = {};
      if (city) entityQuery.city = city;
      if (state) entityQuery.state = state;

      const entities = await Entity.find(entityQuery).select('_id');
      baseQuery.entityId = { $in: entities.map(e => e._id) };
    }

    // Adicionar filtros de valor
    if (minValue) baseQuery.minApplicationValue = { $gte: Number(minValue) };
    if (maxValue) baseQuery.maxApplicationValue = { $lte: Number(maxValue) };

    // Executar query principal
    let noticesQuery = Notice.find(baseQuery)
      .populate('entityId', 'name city state')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    // Ordenar por relevância geográfica se solicitado
    if (sortByLocation && city) {
      noticesQuery = noticesQuery.sort({
        'entityId.city': city ? 'asc' : 'desc',
        startDate: 'asc'
      });
    } else {
      noticesQuery = noticesQuery.sort({ startDate: 'asc' });
    }

    const [notices, total] = await Promise.all([
      noticesQuery.exec(),
      Notice.countDocuments(baseQuery)
    ]);

    res.status(200).json({
      success: true,
      data: notices,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  }),

  // Obter detalhes de um edital
  getNotice: handleAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const notice = await Notice.findById(id)
      .populate('entityId', 'name city state contactEmail contactPhone');

    if (!notice) {
      return res.status(404).json({
        success: false,
        error: 'Edital não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: notice
    });
  }),

  // Criar novo edital (apenas para entidades)
  createNotice: handleAsync(async (req: Request, res: Response) => {
    const entityId = req.user.entityId;

    if (!entityId) {
      return res.status(403).json({
        success: false,
        error: 'Apenas entidades podem criar editais'
      });
    }

    const notice = await Notice.create({
      ...req.body,
      entityId,
      status: 'draft'
    });

    res.status(201).json({
      success: true,
      data: notice
    });
  }),

  // Atualizar edital (apenas para entidades proprietárias)
  updateNotice: handleAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const entityId = req.user.entityId;

    const notice = await Notice.findOne({ _id: id, entityId });

    if (!notice) {
      return res.status(404).json({
        success: false,
        error: 'Edital não encontrado ou você não tem permissão para editá-lo'
      });
    }

    // Não permitir alteração de status por esta rota
    delete req.body.status;

    const updatedNotice = await Notice.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedNotice
    });
  }),

  // Publicar edital
  publishNotice: handleAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const entityId = req.user.entityId;

    const notice = await Notice.findOne({ _id: id, entityId });

    if (!notice) {
      return res.status(404).json({
        success: false,
        error: 'Edital não encontrado ou você não tem permissão para publicá-lo'
      });
    }

    if (notice.status !== 'draft') {
      return res.status(400).json({
        success: false,
        error: 'Apenas editais em rascunho podem ser publicados'
      });
    }

    notice.status = 'published';
    await notice.save();

    res.status(200).json({
      success: true,
      data: notice
    });
  }),

  // Cancelar edital
  cancelNotice: handleAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const entityId = req.user.entityId;

    const notice = await Notice.findOne({ _id: id, entityId });

    if (!notice) {
      return res.status(404).json({
        success: false,
        error: 'Edital não encontrado ou você não tem permissão para cancelá-lo'
      });
    }

    if (notice.status === 'canceled') {
      return res.status(400).json({
        success: false,
        error: 'Este edital já está cancelado'
      });
    }

    notice.status = 'canceled';
    await notice.save();

    res.status(200).json({
      success: true,
      data: notice
    });
  })
};

export default noticeController; 