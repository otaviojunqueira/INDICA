import { Request, Response } from 'express';
import Notice from '../models/Notice.model';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';

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
      const userRole = (req as any).userRole;
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

  // Listar todos os editais
  listAll: async (req: Request, res: Response) => {
    try {
      const { status, entityId, category } = req.query;
      
      // Construir o filtro
      const filter: any = {};
      
      // Filtrar por status
      if (status) {
        filter.status = status;
      }
      
      // Filtrar por entidade
      if (entityId) {
        filter.entityId = entityId;
      }
      
      // Filtrar por categoria
      if (category) {
        filter.categories = { $in: [category] };
      }

      // Buscar editais com paginação
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const notices = await Notice.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('entityId', 'name');

      // Contar o total de editais para paginação
      const total = await Notice.countDocuments(filter);

      res.json({
        notices,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Erro ao listar editais:', error);
      res.status(500).json({ message: 'Erro no servidor' });
    }
  },

  // Obter um edital específico
  getNotice: async (req: Request, res: Response) => {
    try {
      const noticeId = req.params.id;

      // Verificar se o ID é válido
      if (!mongoose.Types.ObjectId.isValid(noticeId)) {
        return res.status(400).json({ message: 'ID de edital inválido' });
      }

      const notice = await Notice.findById(noticeId).populate('entityId', 'name contactEmail contactPhone');
      
      if (!notice) {
        return res.status(404).json({ message: 'Edital não encontrado' });
      }

      res.json(notice);
    } catch (error) {
      console.error('Erro ao buscar edital:', error);
      res.status(500).json({ message: 'Erro no servidor' });
    }
  },

  // Atualizar um edital
  update: async (req: Request, res: Response) => {
    try {
      // Validar os dados da requisição
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Verificar se o usuário tem permissão (admin)
      const userRole = (req as any).userRole;
      if (userRole !== 'admin') {
        return res.status(403).json({ message: 'Acesso negado' });
      }

      const noticeId = req.params.id;

      // Verificar se o ID é válido
      if (!mongoose.Types.ObjectId.isValid(noticeId)) {
        return res.status(400).json({ message: 'ID de edital inválido' });
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
        status,
        categories,
        requirements,
        documents,
        evaluationCriteria
      } = req.body;

      // Buscar o edital
      const notice = await Notice.findById(noticeId);
      if (!notice) {
        return res.status(404).json({ message: 'Edital não encontrado' });
      }

      // Atualizar os campos
      if (title) notice.title = title;
      if (description) notice.description = description;
      if (entityId) notice.entityId = entityId;
      if (startDate) notice.startDate = new Date(startDate);
      if (endDate) notice.endDate = new Date(endDate);
      if (totalAmount) notice.totalAmount = totalAmount;
      if (maxApplicationValue) notice.maxApplicationValue = maxApplicationValue;
      if (minApplicationValue) notice.minApplicationValue = minApplicationValue;
      if (status) notice.status = status;
      if (categories) notice.categories = categories;
      if (requirements) notice.requirements = requirements;
      if (documents) notice.documents = documents;
      if (evaluationCriteria) notice.evaluationCriteria = evaluationCriteria;

      await notice.save();

      res.json({
        message: 'Edital atualizado com sucesso',
        notice
      });
    } catch (error) {
      console.error('Erro ao atualizar edital:', error);
      res.status(500).json({ message: 'Erro no servidor' });
    }
  },

  // Excluir um edital (apenas para administradores)
  delete: async (req: Request, res: Response) => {
    try {
      // Verificar se o usuário tem permissão (admin)
      const userRole = (req as any).userRole;
      if (userRole !== 'admin') {
        return res.status(403).json({ message: 'Acesso negado' });
      }

      const noticeId = req.params.id;

      // Verificar se o ID é válido
      if (!mongoose.Types.ObjectId.isValid(noticeId)) {
        return res.status(400).json({ message: 'ID de edital inválido' });
      }

      // Buscar e excluir o edital
      const notice = await Notice.findByIdAndDelete(noticeId);
      
      if (!notice) {
        return res.status(404).json({ message: 'Edital não encontrado' });
      }

      res.json({ message: 'Edital excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir edital:', error);
      res.status(500).json({ message: 'Erro no servidor' });
    }
  },

  // Publicar um edital
  publish: async (req: Request, res: Response) => {
    try {
      // Verificar se o usuário tem permissão (admin)
      const userRole = (req as any).userRole;
      if (userRole !== 'admin') {
        return res.status(403).json({ message: 'Acesso negado' });
      }

      const noticeId = req.params.id;

      // Verificar se o ID é válido
      if (!mongoose.Types.ObjectId.isValid(noticeId)) {
        return res.status(400).json({ message: 'ID de edital inválido' });
      }

      // Buscar o edital
      const notice = await Notice.findById(noticeId);
      if (!notice) {
        return res.status(404).json({ message: 'Edital não encontrado' });
      }

      // Verificar se o edital está em rascunho
      if (notice.status !== 'draft') {
        return res.status(400).json({ message: 'Apenas editais em rascunho podem ser publicados' });
      }

      // Atualizar o status para publicado
      notice.status = 'published';
      await notice.save();

      res.json({
        message: 'Edital publicado com sucesso',
        notice
      });
    } catch (error) {
      console.error('Erro ao publicar edital:', error);
      res.status(500).json({ message: 'Erro no servidor' });
    }
  }
};

export default noticeController; 