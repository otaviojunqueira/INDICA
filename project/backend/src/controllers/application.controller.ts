import { Request, Response } from 'express';
import Application from '../models/Application.model';
import Notice from '../models/Notice.model';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';

// Controller para inscrições
export const applicationController = {
  // Criar uma nova inscrição
  create: async (req: Request, res: Response) => {
    try {
      // Validar os dados da requisição
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = (req as any).userId;
      const {
        noticeId,
        projectName,
        projectDescription,
        requestedAmount,
        formData,
        documents
      } = req.body;

      // Verificar se o edital existe e está aberto para inscrições
      const notice = await Notice.findById(noticeId);
      if (!notice) {
        return res.status(404).json({ message: 'Edital não encontrado' });
      }

      if (notice.status !== 'published') {
        return res.status(400).json({ message: 'Este edital não está aberto para inscrições' });
      }

      const now = new Date();
      if (now < notice.startDate || now > notice.endDate) {
        return res.status(400).json({ message: 'Este edital não está no período de inscrições' });
      }

      // Verificar se já existe uma inscrição deste usuário para este edital
      const existingApplication = await Application.findOne({
        userId,
        noticeId
      });

      if (existingApplication) {
        return res.status(400).json({ message: 'Você já possui uma inscrição para este edital' });
      }

      // Criar a nova inscrição
      const application = new Application({
        noticeId,
        userId,
        projectName,
        projectDescription,
        requestedAmount,
        formData: formData || {},
        documents: documents || [],
        status: 'draft'
      });

      await application.save();

      res.status(201).json({
        message: 'Inscrição criada com sucesso',
        application
      });
    } catch (error) {
      console.error('Erro ao criar inscrição:', error);
      res.status(500).json({ message: 'Erro no servidor' });
    }
  },

  // Listar inscrições do usuário
  listUserApplications: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const { status } = req.query;
      
      // Construir o filtro
      const filter: any = { userId };
      
      // Filtrar por status
      if (status) {
        filter.status = status;
      }

      // Buscar inscrições com paginação
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const applications = await Application.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('noticeId', 'title entityId');

      // Contar o total de inscrições para paginação
      const total = await Application.countDocuments(filter);

      res.json({
        applications,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Erro ao listar inscrições:', error);
      res.status(500).json({ message: 'Erro no servidor' });
    }
  },

  // Obter uma inscrição específica
  getApplication: async (req: Request, res: Response) => {
    try {
      const applicationId = req.params.id;
      const userId = (req as any).userId;
      const userRole = (req as any).userRole;

      // Verificar se o ID é válido
      if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        return res.status(400).json({ message: 'ID de inscrição inválido' });
      }

      const application = await Application.findById(applicationId)
        .populate('noticeId', 'title entityId requirements documents evaluationCriteria')
        .populate('userId', 'name email phone');
      
      if (!application) {
        return res.status(404).json({ message: 'Inscrição não encontrada' });
      }

      // Verificar permissão: apenas o próprio usuário, administradores ou avaliadores podem ver
      if (
        application.userId.toString() !== userId &&
        userRole !== 'admin' &&
        userRole !== 'evaluator'
      ) {
        return res.status(403).json({ message: 'Acesso negado' });
      }

      res.json(application);
    } catch (error) {
      console.error('Erro ao buscar inscrição:', error);
      res.status(500).json({ message: 'Erro no servidor' });
    }
  },

  // Atualizar uma inscrição
  update: async (req: Request, res: Response) => {
    try {
      // Validar os dados da requisição
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const applicationId = req.params.id;
      const userId = (req as any).userId;

      // Verificar se o ID é válido
      if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        return res.status(400).json({ message: 'ID de inscrição inválido' });
      }

      // Buscar a inscrição
      const application = await Application.findById(applicationId);
      if (!application) {
        return res.status(404).json({ message: 'Inscrição não encontrada' });
      }

      // Verificar se o usuário é o dono da inscrição
      if (application.userId.toString() !== userId) {
        return res.status(403).json({ message: 'Acesso negado' });
      }

      // Verificar se a inscrição ainda pode ser editada
      if (application.status !== 'draft') {
        return res.status(400).json({ message: 'Apenas inscrições em rascunho podem ser editadas' });
      }

      const {
        projectName,
        projectDescription,
        requestedAmount,
        formData,
        documents
      } = req.body;

      // Atualizar os campos
      if (projectName) application.projectName = projectName;
      if (projectDescription) application.projectDescription = projectDescription;
      if (requestedAmount) application.requestedAmount = requestedAmount;
      if (formData) application.formData = formData;
      if (documents) application.documents = documents;

      await application.save();

      res.json({
        message: 'Inscrição atualizada com sucesso',
        application
      });
    } catch (error) {
      console.error('Erro ao atualizar inscrição:', error);
      res.status(500).json({ message: 'Erro no servidor' });
    }
  },

  // Enviar uma inscrição
  submit: async (req: Request, res: Response) => {
    try {
      const applicationId = req.params.id;
      const userId = (req as any).userId;

      // Verificar se o ID é válido
      if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        return res.status(400).json({ message: 'ID de inscrição inválido' });
      }

      // Buscar a inscrição
      const application = await Application.findById(applicationId);
      if (!application) {
        return res.status(404).json({ message: 'Inscrição não encontrada' });
      }

      // Verificar se o usuário é o dono da inscrição
      if (application.userId.toString() !== userId) {
        return res.status(403).json({ message: 'Acesso negado' });
      }

      // Verificar se a inscrição ainda pode ser enviada
      if (application.status !== 'draft') {
        return res.status(400).json({ message: 'Apenas inscrições em rascunho podem ser enviadas' });
      }

      // Verificar se o edital ainda está aberto
      const notice = await Notice.findById(application.noticeId);
      if (!notice) {
        return res.status(404).json({ message: 'Edital não encontrado' });
      }

      const now = new Date();
      if (now > notice.endDate) {
        return res.status(400).json({ message: 'O período de inscrições para este edital já encerrou' });
      }

      // Atualizar o status e a data de envio
      application.status = 'submitted';
      application.submittedAt = new Date();
      await application.save();

      res.json({
        message: 'Inscrição enviada com sucesso',
        application
      });
    } catch (error) {
      console.error('Erro ao enviar inscrição:', error);
      res.status(500).json({ message: 'Erro no servidor' });
    }
  },

  // Listar todas as inscrições (apenas para administradores)
  listAll: async (req: Request, res: Response) => {
    try {
      // Verificar se o usuário tem permissão (admin)
      const userRole = (req as any).userRole;
      if (userRole !== 'admin') {
        return res.status(403).json({ message: 'Acesso negado' });
      }

      const { noticeId, status } = req.query;
      
      // Construir o filtro
      const filter: any = {};
      
      // Filtrar por edital
      if (noticeId) {
        filter.noticeId = noticeId;
      }
      
      // Filtrar por status
      if (status) {
        filter.status = status;
      }

      // Buscar inscrições com paginação
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const applications = await Application.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('noticeId', 'title')
        .populate('userId', 'name email');

      // Contar o total de inscrições para paginação
      const total = await Application.countDocuments(filter);

      res.json({
        applications,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Erro ao listar inscrições:', error);
      res.status(500).json({ message: 'Erro no servidor' });
    }
  }
};

export default applicationController; 