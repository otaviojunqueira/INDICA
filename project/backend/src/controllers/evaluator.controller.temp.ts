import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Evaluator, User, Entity } from '../models';
import { handleAsync, ApiError } from '../utils/errorHandler';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Função para gerar senha aleatória
const generateRandomPassword = () => {
  return crypto.randomBytes(8).toString('hex');
};

// Controller para pareceristas (avaliadores)
export const evaluatorController = {
  // Listar pareceristas (filtrado por entidade para admins)
  listEvaluators: handleAsync(async (req: Request, res: Response) => {
    // Verificar se o usuário está autenticado e tem permissão
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'Não autorizado' });
    }

    const { culturalSector, specialty, active, query } = req.query;
    
    // Construir filtro de busca
    const filter: any = {};
    
    // Se for admin, filtrar por entidade (se especificada)
    if (req.user.role === 'admin') {
      if (req.user.entityId) {
        filter.entityId = req.user.entityId;
      }
    } else {
      // Para não-admin, mostrar apenas pareceristas da mesma entidade
      if (!req.user.entityId) {
        return res.status(403).json({ message: 'Acesso negado' });
      }
      filter.entityId = req.user.entityId;
    }
    
    // Filtrar por setor cultural
    if (culturalSector) {
      filter.culturalSector = culturalSector;
    }

    // Filtrar por especialidade
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
    // Verificar se o usuário está autenticado e tem permissão
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'Não autorizado' });
    }

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
    // Verificar se o usuário está autenticado e tem permissão
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'Não autorizado' });
    }

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
      email, // Email do novo parecerista
      name, // Nome do novo parecerista
      culturalSector,
      specialties,
      biography,
      education,
      experience
    } = req.body;
    
    // Se não especificou entidade, usar a entidade do admin
    const entityId = req.user.entityId;
    if (!entityId) {
      return res.status(400).json({ message: 'Entidade não especificada' });
    }
    
    // Verificar se a entidade existe
    const entity = await Entity.findById(entityId);
    if (!entity) {
      return res.status(400).json({ message: 'Entidade não encontrada' });
    }
    
    // Verificar se já existe um usuário com este email
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Este email já está em uso' });
    }
    
    // Gerar senha aleatória
    const password = generateRandomPassword();
    
    // Criar novo usuário
    user = new User({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: 'evaluator',
      entityId
    });
    
    await user.save();
    
    // Criar o novo parecerista
    const evaluator = new Evaluator({
      userId: user._id,
      entityId,
      culturalSector,
      specialties,
      biography,
      education,
      experience
    });
    
    await evaluator.save();

    // TODO: Enviar email com as credenciais
    // Aqui você deve implementar o envio de email com o email e senha gerada
    
    res.status(201).json({
      message: 'Parecerista criado com sucesso',
      evaluator,
      credentials: {
        email,
        password, // Enviar a senha apenas na resposta inicial
        message: 'Um email foi enviado com as credenciais de acesso'
      }
    });
  }),
  
  // Atualizar parecerista (apenas admin ou o próprio parecerista)
  updateEvaluator: handleAsync(async (req: Request, res: Response) => {
    // Verificar se o usuário está autenticado e tem permissão
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'Não autorizado' });
    }

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
      delete req.body.culturalSector; // Apenas admin pode mudar o setor cultural
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
    // Verificar se o usuário está autenticado e tem permissão
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'Não autorizado' });
    }

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
  })
}; 