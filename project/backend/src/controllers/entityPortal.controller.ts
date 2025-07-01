import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { EntityPortal, Entity } from '../models';
import { handleAsync, ApiError } from '../utils/errorHandler';
import { IEntityPortal } from '../models/EntityPortal.model';
import mongoose, { Document } from 'mongoose';

// Tipo auxiliar para permitir indexação de string
type EntityPortalDocument = Document<unknown, {}, IEntityPortal> & 
  IEntityPortal & 
  Required<{ _id: unknown }> & 
  { [key: string]: any };

// Controller para o portal de transparência do ente federado
export const entityPortalController = {
  // Listar todos os portais de entidades
  listEntityPortals: handleAsync(async (req: Request, res: Response) => {
    const { query, isActive } = req.query;
    
    const filter: any = {};
    
    // Filtrar por status (ativo/inativo)
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }
    
    // Buscar portais
    let entityPortals = await EntityPortal.find(filter)
      .populate('entityId', 'name type')
      .sort({ title: 1 });
    
    // Filtrar por título (pós-consulta)
    if (query) {
      const queryStr = query.toString().toLowerCase();
      entityPortals = entityPortals.filter(portal => {
        const portalObj = portal.toObject() as IEntityPortal;
        return portalObj.title?.toLowerCase().includes(queryStr);
      });
    }
    
    res.status(200).json(entityPortals);
  }),

  // Obter um portal de entidade por ID
  getEntityPortalById: handleAsync(async (req: Request, res: Response) => {
    const entityPortal = await EntityPortal.findById(req.params.id)
      .populate('entityId', 'name type');
    
    if (!entityPortal) {
      res.status(404).json({ message: 'Portal de entidade não encontrado' });
      return;
    }
    
    res.status(200).json(entityPortal);
  }),

  // Obter portal de entidade pelo ID da entidade
  getEntityPortalByEntityId: handleAsync(async (req: Request, res: Response) => {
    const entityPortal = await EntityPortal.findOne({ entityId: req.params.entityId })
      .populate('entityId', 'name type');
    
    if (!entityPortal) {
      res.status(404).json({ message: 'Portal de entidade não encontrado' });
      return;
    }
    
    res.status(200).json(entityPortal);
  }),

  // Criar um novo portal de entidade
  createEntityPortal: handleAsync(async (req: Request, res: Response) => {
    const { 
      entityId, 
      title, 
      description, 
      logoUrl, 
      bannerUrl, 
      primaryColor, 
      secondaryColor, 
      contactEmail, 
      contactPhone, 
      address, 
      socialMedia 
    } = req.body;
    
    // Verificar se a entidade existe
    const entity = await Entity.findById(entityId);
    
    if (!entity) {
      res.status(404).json({ message: 'Entidade não encontrada' });
      return;
    }
    
    // Verificar se já existe um portal para esta entidade
    const existingPortal = await EntityPortal.findOne({ entityId });
    
    if (existingPortal) {
      res.status(400).json({ message: 'Esta entidade já possui um portal' });
      return;
    }
    
    // Criar o portal da entidade
    const newEntityPortal = new EntityPortal({
      entityId,
      title,
      description,
      logoUrl,
      bannerUrl,
      primaryColor,
      secondaryColor,
      contactEmail,
      contactPhone,
      address,
      socialMedia,
      isActive: true
    });
    
    await newEntityPortal.save();
    
    // Retornar o portal criado com dados da entidade
    const portalWithEntity = await EntityPortal.findById(newEntityPortal._id)
      .populate('entityId', 'name type');
    
    res.status(201).json(portalWithEntity);
  }),

  // Atualizar um portal de entidade
  updateEntityPortal: handleAsync(async (req: Request, res: Response) => {
    const { 
      title, 
      description, 
      logoUrl, 
      bannerUrl, 
      primaryColor, 
      secondaryColor, 
      contactEmail, 
      contactPhone, 
      address, 
      socialMedia 
    } = req.body;
    
    // Verificar se o portal existe
    const entityPortal = await EntityPortal.findById(req.params.id);
    
    if (!entityPortal) {
      res.status(404).json({ message: 'Portal de entidade não encontrado' });
      return;
    }
    
    // Atualizar o portal (usando cast para any)
    const portalDoc = entityPortal as any;
    if (title) portalDoc.title = title;
    if (description) portalDoc.description = description;
    if (logoUrl !== undefined) portalDoc.logoUrl = logoUrl;
    if (bannerUrl !== undefined) portalDoc.bannerUrl = bannerUrl;
    if (primaryColor !== undefined) portalDoc.primaryColor = primaryColor;
    if (secondaryColor !== undefined) portalDoc.secondaryColor = secondaryColor;
    if (contactEmail) portalDoc.contactEmail = contactEmail;
    if (contactPhone !== undefined) portalDoc.contactPhone = contactPhone;
    if (address !== undefined) portalDoc.address = address;
    if (socialMedia !== undefined) portalDoc.socialMedia = socialMedia;
    
    await entityPortal.save();
    
    // Retornar o portal atualizado com dados da entidade
    const updatedPortal = await EntityPortal.findById(entityPortal._id)
      .populate('entityId', 'name type');
    
    res.status(200).json(updatedPortal);
  }),

  // Alterar o status de um portal de entidade (ativar/desativar)
  updateEntityPortalStatus: handleAsync(async (req: Request, res: Response) => {
    const { isActive } = req.body;
    
    if (isActive === undefined) {
      res.status(400).json({ message: 'O campo isActive é obrigatório' });
      return;
    }
    
    // Verificar se o portal existe
    const entityPortal = await EntityPortal.findById(req.params.id);
    
    if (!entityPortal) {
      res.status(404).json({ message: 'Portal de entidade não encontrado' });
      return;
    }
    
    (entityPortal as any).isActive = isActive;
    await entityPortal.save();
    
    res.status(200).json({ 
      message: `Portal de entidade ${isActive ? 'ativado' : 'desativado'} com sucesso`,
      entityPortal
    });
  }),

  // Excluir um portal de entidade
  deleteEntityPortal: handleAsync(async (req: Request, res: Response) => {
    // Verificar se o portal existe
    const entityPortal = await EntityPortal.findById(req.params.id);
    
    if (!entityPortal) {
      res.status(404).json({ message: 'Portal de entidade não encontrado' });
      return;
    }
    
    // Excluir o portal
    await EntityPortal.deleteOne({ _id: entityPortal._id });
    
    res.status(200).json({ message: 'Portal de entidade excluído com sucesso' });
  }),

  // Obter portal por ID da entidade
  getPortalByEntityId: handleAsync(async (req: Request, res: Response) => {
    const { entityId } = req.params;
    
    // Verificar se o portal existe
    const portal = await EntityPortal.findOne({ entityId });
    
    if (!portal) {
      res.status(404).json({ message: 'Portal de entidade não encontrado' });
      return;
    }
    
    res.status(200).json(portal);
  }),
  
  // Criar ou atualizar portal (apenas admin da entidade)
  updatePortal: handleAsync(async (req: Request, res: Response) => {
    // Validar os dados da requisição
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Verificar se o usuário tem permissão (admin)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    
    const { entityId } = req.params;
    
    // Verificar se o admin pertence à entidade
    if (req.user.entityId?.toString() !== entityId) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    
    // Verificar se a entidade existe
    const entity = await Entity.findById(entityId);
    if (!entity) {
      return res.status(404).json({ message: 'Entidade não encontrada' });
    }
    
    // Verificar se o portal já existe
    let portal = await EntityPortal.findOne({ entityId });
    
    if (portal) {
      // Atualizar portal existente
      const updateData = req.body;
      
      // Atualizar cada seção individualmente para evitar sobrescrever dados não enviados
      Object.keys(updateData).forEach(key => {
        if (key !== '_id' && key !== 'entityId' && key !== 'createdAt' && key !== 'updatedAt') {
          (portal as EntityPortalDocument)[key] = updateData[key];
        }
      });
      
      await portal.save();
      
      res.json({
        message: 'Portal atualizado com sucesso',
        portal
      });
    } else {
      // Criar novo portal
      portal = new EntityPortal({
        entityId,
        ...req.body
      });
      
      await portal.save();
      
      res.status(201).json({
        message: 'Portal criado com sucesso',
        portal
      });
    }
  }),
  
  // Atualizar seção específica do portal (apenas admin da entidade)
  updatePortalSection: handleAsync(async (req: Request, res: Response) => {
    // Validar os dados da requisição
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Verificar se o usuário tem permissão (admin)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    
    const { entityId, section } = req.params;
    
    // Verificar se o admin pertence à entidade
    if (req.user.entityId?.toString() !== entityId) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    
    // Verificar se a seção é válida
    const validSections = [
      'organizationalStructure',
      'finances',
      'procurement',
      'staff',
      'programs',
      'reports',
      'legislation',
      'culturalCalendar',
      'ombudsman',
      'faq',
      'openData'
    ];
    
    if (!validSections.includes(section)) {
      return res.status(400).json({ message: 'Seção inválida' });
    }
    
    // Verificar se o portal existe
    let portal = await EntityPortal.findOne({ entityId }) as EntityPortalDocument;
    
    if (!portal) {
      // Criar novo portal com a seção especificada
      const newPortal: Record<string, any> = { entityId };
      newPortal[section] = req.body;
      
      portal = new EntityPortal(newPortal);
    } else {
      // Atualizar apenas a seção especificada
      portal[section] = req.body;
    }
    
    await portal.save();
    
    res.json({
      message: `Seção ${section} atualizada com sucesso`,
      portal
    });
  }),
  
  // Adicionar item a uma lista em uma seção (apenas admin da entidade)
  addItemToSection: handleAsync(async (req: Request, res: Response) => {
    // Validar os dados da requisição
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Verificar se o usuário tem permissão (admin)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    
    const { entityId, section } = req.params;
    
    // Verificar se o admin pertence à entidade
    if (req.user.entityId?.toString() !== entityId) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    
    // Verificar se a seção é uma lista
    const listSections = [
      'organizationalStructure.departments',
      'finances.revenues',
      'finances.expenses',
      'procurement.bids',
      'procurement.contracts',
      'staff',
      'programs',
      'reports',
      'legislation',
      'culturalCalendar',
      'faq',
      'openData'
    ];
    
    if (!listSections.includes(section)) {
      return res.status(400).json({ message: 'Seção inválida ou não é uma lista' });
    }
    
    // Verificar se o portal existe
    let portal = await EntityPortal.findOne({ entityId }) as EntityPortalDocument;
    
    if (!portal) {
      // Criar novo portal com a lista inicializada
      const newPortal: Record<string, any> = { entityId };
      
      // Inicializar a estrutura de objetos aninhados se necessário
      const sectionParts = section.split('.');
      if (sectionParts.length > 1) {
        newPortal[sectionParts[0]] = {};
        newPortal[sectionParts[0]][sectionParts[1]] = [req.body];
      } else {
        newPortal[section] = [req.body];
      }
      
      portal = new EntityPortal(newPortal);
    } else {
      // Adicionar o item à lista existente
      const sectionParts = section.split('.');
      
      if (sectionParts.length > 1) {
        // Seção aninhada (ex: finances.revenues)
        if (!portal[sectionParts[0]]) {
          portal[sectionParts[0]] = {};
        }
        
        if (!portal[sectionParts[0]][sectionParts[1]]) {
          portal[sectionParts[0]][sectionParts[1]] = [];
        }
        
        portal[sectionParts[0]][sectionParts[1]].push(req.body);
      } else {
        // Seção de nível superior
        if (!portal[section]) {
          portal[section] = [];
        }
        
        portal[section].push(req.body);
      }
    }
    
    await portal.save();
    
    res.status(201).json({
      message: `Item adicionado à seção ${section} com sucesso`,
      portal
    });
  }),
  
  // Remover item de uma lista em uma seção (apenas admin da entidade)
  removeItemFromSection: handleAsync(async (req: Request, res: Response) => {
    // Verificar se o usuário tem permissão (admin)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    
    const { entityId, section, itemId } = req.params;
    
    // Verificar se o admin pertence à entidade
    if (req.user.entityId?.toString() !== entityId) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    
    // Verificar se o portal existe
    const portal = await EntityPortal.findOne({ entityId }) as EntityPortalDocument;
    
    if (!portal) {
      return res.status(404).json({ message: 'Portal não encontrado' });
    }
    
    // Remover o item da lista
    const sectionParts = section.split('.');
    
    if (sectionParts.length > 1) {
      // Seção aninhada (ex: finances.revenues)
      if (!portal[sectionParts[0]] || !portal[sectionParts[0]][sectionParts[1]]) {
        return res.status(404).json({ message: 'Seção não encontrada' });
      }
      
      const index = portal[sectionParts[0]][sectionParts[1]].findIndex((item: any) => 
        item._id.toString() === itemId
      );
      
      if (index === -1) {
        return res.status(404).json({ message: 'Item não encontrado' });
      }
      
      portal[sectionParts[0]][sectionParts[1]].splice(index, 1);
    } else {
      // Seção de nível superior
      if (!portal[section]) {
        return res.status(404).json({ message: 'Seção não encontrada' });
      }
      
      const index = portal[section].findIndex((item: any) => 
        item._id.toString() === itemId
      );
      
      if (index === -1) {
        return res.status(404).json({ message: 'Item não encontrado' });
      }
      
      portal[section].splice(index, 1);
    }
    
    await portal.save();
    
    res.json({
      message: `Item removido da seção ${section} com sucesso`,
      portal
    });
  })
};
