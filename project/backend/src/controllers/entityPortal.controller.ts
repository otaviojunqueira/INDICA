import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { EntityPortal, Entity } from '../models';
import { handleAsync } from '../utils/errorHandler';
import { IEntityPortal } from '../models/EntityPortal.model';
import mongoose, { Document } from 'mongoose';

// Tipo auxiliar para permitir indexação de string
type EntityPortalDocument = Document<unknown, {}, IEntityPortal> & 
  IEntityPortal & 
  Required<{ _id: unknown }> & 
  { [key: string]: any };

// Controller para o portal de transparência do ente federado
export const entityPortalController = {
  // Obter portal por ID da entidade
  getPortalByEntityId: handleAsync(async (req: Request, res: Response) => {
    const { entityId } = req.params;
    
    // Verificar se o portal existe
    const portal = await EntityPortal.findOne({ entityId });
    
    if (!portal) {
      return res.status(404).json({ message: 'Portal não encontrado' });
    }
    
    res.json(portal);
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
