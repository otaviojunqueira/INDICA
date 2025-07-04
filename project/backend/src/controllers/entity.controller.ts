import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Entity from '../models/Entity.model';
import { handleAsync } from '../utils/errorHandler';
import { formatCNPJ } from '../utils/validators';
import mongoose from 'mongoose';

/**
 * Listar todas as entidades
 */
export const getAllEntities = async (req: Request, res: Response) => {
  try {
    const entities = await Entity.find({ isActive: true }).sort({ name: 1 });

    return res.status(200).json({ entities });
  } catch (error) {
    console.error('Erro ao listar entidades:', error);
    return res.status(500).json({ message: 'Erro ao listar entidades.' });
  }
};

/**
 * Obter uma entidade pelo ID
 */
export const getEntityById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const entity = await Entity.findById(id);

    if (!entity) {
      return res.status(404).json({ message: 'Entidade não encontrada.' });
    }

    return res.status(200).json({ entity });
  } catch (error) {
    console.error('Erro ao obter entidade:', error);
    return res.status(500).json({ message: 'Erro ao obter entidade.' });
  }
};

/**
 * Criar uma nova entidade
 */
export const createEntity = async (req: Request, res: Response) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, type, cnpj, address, contactEmail, contactPhone } = req.body;

    // Verificar se já existe uma entidade com o mesmo CNPJ
    const existingEntity = await Entity.findOne({ cnpj });

    if (existingEntity) {
      return res.status(400).json({
        message: 'Já existe uma entidade cadastrada com este CNPJ.',
      });
    }

    // Criar a entidade
    const entity = await Entity.create({
      name,
      type,
      cnpj,
      address,
      contactEmail,
      contactPhone,
      isActive: true,
    });

    return res.status(201).json({
      message: 'Entidade criada com sucesso',
      entity,
    });
  } catch (error) {
    console.error('Erro ao criar entidade:', error);
    return res.status(500).json({ message: 'Erro ao criar entidade.' });
  }
};

/**
 * Atualizar uma entidade existente
 */
export const updateEntity = async (req: Request, res: Response) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, type, address, contactEmail, contactPhone } = req.body;

    // Buscar a entidade pelo ID
    const entity = await Entity.findById(id);

    if (!entity) {
      return res.status(404).json({ message: 'Entidade não encontrada.' });
    }

    // Atualizar os dados da entidade
    const updatedEntity = await Entity.findByIdAndUpdate(
      id,
      {
        name,
        type,
        address,
        contactEmail,
        contactPhone
      },
      { new: true }
    );

    return res.status(200).json({
      message: 'Entidade atualizada com sucesso',
      entity: updatedEntity,
    });
  } catch (error) {
    console.error('Erro ao atualizar entidade:', error);
    return res.status(500).json({ message: 'Erro ao atualizar entidade.' });
  }
};

/**
 * Desativar uma entidade (soft delete)
 */
export const deleteEntity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Buscar a entidade pelo ID
    const entity = await Entity.findById(id);

    if (!entity) {
      return res.status(404).json({ message: 'Entidade não encontrada.' });
    }

    // Desativar a entidade (soft delete)
    await Entity.findByIdAndUpdate(id, { isActive: false });

    return res.status(200).json({
      message: 'Entidade desativada com sucesso',
    });
  } catch (error) {
    console.error('Erro ao desativar entidade:', error);
    return res.status(500).json({ message: 'Erro ao desativar entidade.' });
  }
};

export const entityController = {
  // Criar um novo ente federado
  create: handleAsync(async (req: Request, res: Response) => {
    const entityData = req.body;

    // Formatar CNPJs
    entityData.cnpj = formatCNPJ(entityData.cnpj);
    if (entityData.culturalFund?.cnpj) {
      entityData.culturalFund.cnpj = formatCNPJ(entityData.culturalFund.cnpj);
    }

    // Criar o ente federado
    const entity = new Entity(entityData);
    await entity.save();

    // Se temos informações da cidade, atualizamos o entityId da cidade
    if (entityData.address && entityData.address.city && entityData.address.state) {
      try {
        const City = mongoose.model('City');
        // Buscar cidade pelo nome e estado
        const city = await City.findOne({
          name: { $regex: new RegExp(`^${entityData.address.city}$`, 'i') },
          state: entityData.address.state.toUpperCase()
        });

        // Se encontrou a cidade, atualiza o entityId
        if (city) {
          city.entityId = entity._id;
          await city.save();
        } else {
          // Se não encontrou, cria uma nova cidade
          await City.create({
            name: entityData.address.city,
            state: entityData.address.state.toUpperCase(),
            entityId: entity._id,
            isCapital: false
          });
        }
      } catch (error) {
        console.error('Erro ao atualizar cidade:', error);
        // Não retornamos erro aqui para não interromper o fluxo principal
      }
    }

    res.status(201).json({
      message: 'Ente federado cadastrado com sucesso',
      entity
    });
  }),

  // Listar todos os entes federados
  list: handleAsync(async (req: Request, res: Response) => {
    const { type, status, isActive } = req.query;
    
    const filter: any = {};
    
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const entities = await Entity.find(filter)
      .select('-documents') // Não retorna os documentos na listagem
      .sort({ createdAt: -1 });

    res.json(entities);
  }),

  // Obter um ente federado específico
  getOne: handleAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const entity = await Entity.findById(id);
    if (!entity) {
      return res.status(404).json({ message: 'Ente federado não encontrado' });
    }

    res.json(entity);
  }),

  // Atualizar um ente federado
  update: handleAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    // Formatar CNPJs se fornecidos
    if (updateData.cnpj) {
      updateData.cnpj = formatCNPJ(updateData.cnpj);
    }
    if (updateData.culturalFund?.cnpj) {
      updateData.culturalFund.cnpj = formatCNPJ(updateData.culturalFund.cnpj);
    }

    const entity = await Entity.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!entity) {
      return res.status(404).json({ message: 'Ente federado não encontrado' });
    }

    res.json({
      message: 'Ente federado atualizado com sucesso',
      entity
    });
  }),

  // Aprovar um ente federado
  approve: handleAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const entity = await Entity.findByIdAndUpdate(
      id,
      {
        status: 'approved',
        approvalDate: new Date()
      },
      { new: true }
    );

    if (!entity) {
      return res.status(404).json({ message: 'Ente federado não encontrado' });
    }

    res.json({
      message: 'Ente federado aprovado com sucesso',
      entity
    });
  }),

  // Rejeitar um ente federado
  reject: handleAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: 'É necessário fornecer um motivo para a rejeição' });
    }

    const entity = await Entity.findByIdAndUpdate(
      id,
      {
        status: 'rejected',
        rejectionReason: reason
      },
      { new: true }
    );

    if (!entity) {
      return res.status(404).json({ message: 'Ente federado não encontrado' });
    }

    res.json({
      message: 'Ente federado rejeitado',
      entity
    });
  }),

  // Ativar/Desativar um ente federado
  toggleActive: handleAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const entity = await Entity.findById(id);
    if (!entity) {
      return res.status(404).json({ message: 'Ente federado não encontrado' });
    }

    entity.isActive = !entity.isActive;
    await entity.save();

    res.json({
      message: `Ente federado ${entity.isActive ? 'ativado' : 'desativado'} com sucesso`,
      entity
    });
  }),

  // Atualizar documentos
  updateDocuments: handleAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const documents = req.body;

    const entity = await Entity.findByIdAndUpdate(
      id,
      { $set: { documents } },
      { new: true, runValidators: true }
    );

    if (!entity) {
      return res.status(404).json({ message: 'Ente federado não encontrado' });
    }

    res.json({
      message: 'Documentos atualizados com sucesso',
      entity
    });
  }),

  // Buscar entes federados por CNPJ
  findByCNPJ: handleAsync(async (req: Request, res: Response) => {
    const { cnpj } = req.params;
    const formattedCNPJ = formatCNPJ(cnpj);

    const entity = await Entity.findOne({ cnpj: formattedCNPJ });
    if (!entity) {
      return res.status(404).json({ message: 'Ente federado não encontrado' });
    }

    res.json(entity);
  }),

  // Listar entes federados por estado
  listByState: handleAsync(async (req: Request, res: Response) => {
    const { state } = req.params;

    const entities = await Entity.find({
      'address.state': state.toUpperCase(),
      isActive: true
    }).select('-documents');

    res.json(entities);
  })
}; 