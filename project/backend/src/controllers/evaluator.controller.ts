import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Evaluator, User, Entity } from '../models';
import { handleAsync, ApiError } from '../utils/errorHandler';
import mongoose from 'mongoose';

// Controller para pareceristas (avaliadores)
export const evaluatorController = {
  // Listar pareceristas (filtrado por entidade para admins)
  listEvaluators: handleAsync(async (req: Request, res: Response) => {
    const { entityId, specialty, active, query } = req.query;
    
    // Construir filtro de busca
    const filter: any = {};
    
    // Se for admin, filtrar por entidade (se especificada)
    if (req.user.role === 'admin') {
      if (entityId) {
        filter.entityId = new mongoose.Types.ObjectId(entityId.toString());
      } else if (req.user.entityId) {
        // Se não especificou entidade, filtrar pela entidade do admin
        filter.entityId = req.user.entityId;
      }
    } else {
      // Para não-admin, mostrar apenas pareceristas da mesma entidade
      if (!req.user.entityId) {
        return res.status(403).json({ message: 'Acesso negado' });
      }
      filter.entityId = req.user.entityId;
    }
    
    if (specialty) {
      filter.specialties = { $in: [specialty.toString()] };
    }
    
    if (active !== undefined) {
      filter.isActive = active === 'true';
    }
    
    // Buscar pareceristas com filtros
    const evaluators = await Evaluator.find(filter)
      .populate('userId', 'name email')
      .populate('entityId', 'name');
    
    // Se houver uma consulta de texto, filtrar pelo nome do usuário
    let filteredEvaluators = evaluators;
    if (query) {
      const queryStr = query.toString().toLowerCase();
      filteredEvaluators = evaluators.filter(evaluator => 
        (evaluator.userId as any)?.name?.toLowerCase().includes(queryStr) ||
        (evaluator.biography && evaluator.biography.toLowerCase().includes(queryStr))
      );
    }
    
    res.json(filteredEvaluators);
  }),
  
  // Obter parecerista por ID
  getEvaluatorById: handleAsync(async (req: Request, res: Response) => {
    const evaluator = await Evaluator.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('entityId', 'name');
    
    if (!evaluator) {
      return res.status(404).json({ message: 'Parecerista não encontrado' });
    }
    
    // Verificar permissão (admin da mesma entidade ou o próprio usuário)
    if (
      req.user.role !== 'admin' && 
      evaluator.entityId.toString() !== req.user.entityId?.toString() &&
      evaluator.userId.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    
    res.json(evaluator);
  }),
  
  // Criar um novo parecerista (apenas admin)
  createEvaluator: handleAsync(async (req: Request, res: Response) => {
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
      userId,
      entityId,
      specialties,
      biography,
      education,
      experience
    } = req.body;
    
    // Se não especificou entidade, usar a entidade do admin
    const actualEntityId = entityId || req.user.entityId;
    if (!actualEntityId) {
      return res.status(400).json({ message: 'Entidade não especificada' });
    }
    
    // Verificar se a entidade existe
    const entity = await Entity.findById(actualEntityId);
    if (!entity) {
      return res.status(400).json({ message: 'Entidade não encontrada' });
    }
    
    // Verificar se o usuário existe e não é já um parecerista
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }
    
    // Verificar se já existe um parecerista com este usuário
    const existingEvaluator = await Evaluator.findOne({ userId });
    if (existingEvaluator) {
      return res.status(400).json({ message: 'Este usuário já é um parecerista' });
    }
    
    // Atualizar o papel do usuário para 'evaluator'
    user.role = 'evaluator';
    await user.save();
    
    // Criar o novo parecerista
    const evaluator = new Evaluator({
      userId,
      entityId: actualEntityId,
      specialties,
      biography,
      education,
      experience
    });
    
    await evaluator.save();
    
    res.status(201).json({
      message: 'Parecerista criado com sucesso',
      evaluator
    });
  }),
  
  // Atualizar parecerista (apenas admin ou o próprio parecerista)
  updateEvaluator: handleAsync(async (req: Request, res: Response) => {
    // Validar os dados da requisição
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const evaluatorId = req.params.id;
    
    // Verificar se o parecerista existe
    const evaluator = await Evaluator.findById(evaluatorId);
    if (!evaluator) {
      return res.status(404).json({ message: 'Parecerista não encontrado' });
    }
    
    // Verificar permissão (admin da mesma entidade ou o próprio usuário)
    const isAdmin = req.user.role === 'admin';
    const isOwnProfile = evaluator.userId.toString() === req.user.id;
    const isSameEntity = evaluator.entityId.toString() === req.user.entityId?.toString();
    
    if (!isAdmin && !isOwnProfile) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    
    // Campos que apenas o admin pode atualizar
    if (!isAdmin) {
      delete req.body.entityId;
      delete req.body.isActive;
    }
    
    // Atualizar os campos permitidos
    const updateData = req.body;
    Object.keys(updateData).forEach(key => {
      if (key !== '_id' && key !== 'userId' && key !== 'createdAt' && key !== 'updatedAt') {
        (evaluator as any)[key] = updateData[key];
      }
    });
    
    await evaluator.save();
    
    res.json({
      message: 'Parecerista atualizado com sucesso',
      evaluator
    });
  }),
  
  // Desativar/reativar parecerista (apenas admin)
  toggleEvaluatorStatus: handleAsync(async (req: Request, res: Response) => {
    // Verificar se o usuário tem permissão (admin)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    
    const evaluatorId = req.params.id;
    const { isActive } = req.body;
    
    // Verificar se o parecerista existe
    const evaluator = await Evaluator.findById(evaluatorId);
    if (!evaluator) {
      return res.status(404).json({ message: 'Parecerista não encontrado' });
    }
    
    // Verificar se o admin pertence à mesma entidade
    if (evaluator.entityId.toString() !== req.user.entityId?.toString()) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    
    // Atualizar status
    evaluator.isActive = isActive;
    await evaluator.save();
    
    res.json({
      message: isActive ? 'Parecerista ativado com sucesso' : 'Parecerista desativado com sucesso',
      evaluator
    });
  }),

  // Listar todos os pareceristas
  getAllEvaluators: async (req: Request, res: Response): Promise<void> => {
    try {
      const { query, specialty, isActive } = req.query;
      
      const filter: any = {};
      
      // Filtrar por status (ativo/inativo)
      if (isActive !== undefined) {
        filter.isActive = isActive === 'true';
      }
      
      // Filtrar por especialidade
      if (specialty) {
        filter.specialties = { $in: [specialty.toString()] };
      }
      
      // Buscar pareceristas
      let evaluators = await Evaluator.find(filter)
        .populate('userId', 'name email')
        .sort({ createdAt: -1 });
      
      // Filtrar por nome ou email (pós-consulta)
      if (query) {
        const queryStr = query.toString().toLowerCase();
        evaluators = evaluators.filter(evaluator => 
          (evaluator.userId as any)?.name?.toLowerCase().includes(queryStr) ||
          (evaluator.userId as any)?.email?.toLowerCase().includes(queryStr)
        );
      }
      
      res.status(200).json(evaluators);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obter um parecerista por ID
  getEvaluatorByIdSequelize: async (req: Request, res: Response): Promise<void> => {
    try {
      const evaluator = await Evaluator.findById(req.params.id)
        .populate('userId', 'name email');
      
      if (!evaluator) {
        res.status(404).json({ message: 'Parecerista não encontrado' });
        return;
      }
      
      res.status(200).json(evaluator);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  // Criar um novo parecerista
  createEvaluatorSequelize: async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, specialties, biography, education, experience } = req.body;
      
      // Verificar se o usuário existe
      const user = await User.findById(userId);
      
      if (!user) {
        res.status(404).json({ message: 'Usuário não encontrado' });
        return;
      }
      
      // Verificar se o usuário já é um parecerista
      const existingEvaluator = await Evaluator.findOne({ userId });
      
      if (existingEvaluator) {
        res.status(400).json({ message: 'Este usuário já está cadastrado como parecerista' });
        return;
      }
      
      // Atualizar o papel do usuário para 'evaluator'
      user.role = 'evaluator';
      await user.save();
      
      // Criar o parecerista
      const newEvaluator = new Evaluator({
        userId,
        specialties,
        biography,
        education,
        experience,
        isActive: true
      });
      
      await newEvaluator.save();
      
      // Retornar o parecerista criado com dados do usuário
      const evaluatorWithUser = await Evaluator.findById(newEvaluator._id)
        .populate('userId', 'id name email');
      
      res.status(201).json(evaluatorWithUser);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  // Atualizar um parecerista
  updateEvaluatorSequelize: async (req: Request, res: Response): Promise<void> => {
    try {
      const { specialties, biography, education, experience } = req.body;
      
      // Verificar se o parecerista existe
      const evaluator = await Evaluator.findById(req.params.id);
      
      if (!evaluator) {
        res.status(404).json({ message: 'Parecerista não encontrado' });
        return;
      }
      
      // Atualizar o parecerista
      if (specialties) evaluator.specialties = specialties;
      if (biography) evaluator.biography = biography;
      if (education) evaluator.education = education;
      if (experience) evaluator.experience = experience;
      
      await evaluator.save();
      
      // Retornar o parecerista atualizado com dados do usuário
      const updatedEvaluator = await Evaluator.findById(evaluator._id)
        .populate('userId', 'id name email');
      
      res.status(200).json(updatedEvaluator);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  // Alterar o status de um parecerista (ativar/desativar)
  updateEvaluatorStatus: handleAsync(async (req: Request, res: Response): Promise<void> => {
    const { isActive } = req.body;
    
    if (isActive === undefined) {
      res.status(400).json({ message: 'O campo isActive é obrigatório' });
      return;
    }
    
    // Verificar se o parecerista existe
    const evaluator = await Evaluator.findById(req.params.id);
    
    if (!evaluator) {
      res.status(404).json({ message: 'Parecerista não encontrado' });
      return;
    }
    
    // Atualizar o status do parecerista
    evaluator.isActive = isActive;
    await evaluator.save();
    
    res.status(200).json({ 
      message: `Parecerista ${isActive ? 'ativado' : 'desativado'} com sucesso`,
      evaluator
    });
  }),

  // Excluir um parecerista
  deleteEvaluator: handleAsync(async (req: Request, res: Response): Promise<void> => {
    try {
      // Verificar se o parecerista existe
      const evaluator = await Evaluator.findById(req.params.id);
      
      if (!evaluator) {
        res.status(404).json({ message: 'Parecerista não encontrado' });
        return;
      }
      
      // Verificar se o parecerista tem avaliações associadas
      // Nota: Este código depende da existência de um modelo Evaluation com uma relação com Evaluator
      // const evaluationCount = await Evaluation.countDocuments({ evaluatorId: req.params.id });
      
      // if (evaluationCount > 0) {
      //   res.status(400).json({ 
      //     message: 'Este parecerista não pode ser excluído pois possui avaliações associadas',
      //     evaluationCount
      //   });
      //   return;
      // }
      
      // Obter o ID do usuário associado
      const userId = evaluator.userId;
      
      // Excluir o parecerista
      await Evaluator.deleteOne({ _id: evaluator._id });
      
      // Atualizar o papel do usuário para 'agent' se não for admin
      const user = await User.findById(userId);
      if (user && user.role !== 'admin') {
        user.role = 'agent';
        await user.save();
      }
      
      res.status(200).json({ message: 'Parecerista excluído com sucesso' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }),
  
  // Listar pareceristas por especialidade
  listEvaluatorsBySpecialty: handleAsync(async (req: Request, res: Response) => {
    const { specialty } = req.params;
    
    if (!specialty) {
      res.status(400).json({ message: 'Especialidade é obrigatória' });
      return;
    }
    
    const evaluators = await Evaluator.find({
      specialties: { $in: [specialty] },
      isActive: true
    })
    .populate('userId', 'id name email')
    .sort({ createdAt: -1 });
    
    res.status(200).json(evaluators);
  })
}; 