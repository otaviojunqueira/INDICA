import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Entity from '../models/Entity.model';

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