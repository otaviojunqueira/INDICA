import { Request, Response } from 'express';
import City from '../models/City.model';
import { handleAsync, ApiError } from '../utils/errorHandler';

// Listar todas as cidades
export const getCities = async (req: Request, res: Response) => {
  try {
    const cities = await City.find().populate('entityId');
    res.json(cities);
  } catch (error) {
    console.error('Erro ao listar cidades:', error);
    res.status(500).json({ message: 'Erro ao listar cidades' });
  }
};

// Buscar cidade por ID
export const getCityById = async (req: Request, res: Response) => {
  try {
    const city = await City.findById(req.params.id).populate('entityId');
    
    if (!city) {
      return res.status(404).json({ message: 'Cidade não encontrada' });
    }
    
    res.json(city);
  } catch (error) {
    console.error('Erro ao buscar cidade:', error);
    res.status(500).json({ message: 'Erro ao buscar cidade' });
  }
};

// Buscar cidades por estado
export const getCitiesByState = async (req: Request, res: Response) => {
  try {
    const { state } = req.params;
    const cities = await City.find({ state }).populate('entityId');
    res.json(cities);
  } catch (error) {
    console.error('Erro ao buscar cidades por estado:', error);
    res.status(500).json({ message: 'Erro ao buscar cidades por estado' });
  }
};

// Buscar cidade por nome e estado
export const getCityByNameAndState = async (req: Request, res: Response) => {
  try {
    const { name, state } = req.query;
    
    if (!name || !state) {
      return res.status(400).json({ message: 'Nome da cidade e estado são obrigatórios' });
    }
    
    // Busca case-insensitive
    const city = await City.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      state: state.toString().toUpperCase()
    }).populate('entityId');
    
    if (!city) {
      return res.status(404).json({ message: 'Cidade não encontrada' });
    }
    
    res.json(city);
  } catch (error) {
    console.error('Erro ao buscar cidade por nome e estado:', error);
    res.status(500).json({ message: 'Erro ao buscar cidade por nome e estado' });
  }
};

// Criar uma nova cidade
export const createCity = async (req: Request, res: Response) => {
  try {
    const { name, state, entityId } = req.body;
    
    if (!name || !state) {
      return res.status(400).json({ message: 'Nome da cidade e estado são obrigatórios' });
    }
    
    // Verificar se a cidade já existe
    const existingCity = await City.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      state: state.toUpperCase()
    });
    
    if (existingCity) {
      return res.status(400).json({ 
        message: 'Cidade já cadastrada',
        city: existingCity
      });
    }
    
    // Criar nova cidade
    const newCity = new City({
      name,
      state: state.toUpperCase(),
      entityId: entityId || req.body.entityId,
      isCapital: false // Por padrão, não é capital
    });
    
    await newCity.save();
    
    res.status(201).json({
      message: 'Cidade criada com sucesso',
      city: newCity
    });
  } catch (error) {
    console.error('Erro ao criar cidade:', error);
    res.status(500).json({ message: 'Erro ao criar cidade' });
  }
};

// Buscar ou criar cidade
export const findOrCreateCity = async (req: Request, res: Response) => {
  try {
    console.log('Requisição findOrCreateCity recebida:', req.body);
    const { name, state, entityId } = req.body;
    
    if (!name || !state) {
      console.log('Erro: Nome da cidade ou estado não fornecidos');
      return res.status(400).json({ message: 'Nome da cidade e estado são obrigatórios' });
    }
    
    // Buscar cidade existente
    let city = await City.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      state: state.toUpperCase()
    });
    
    console.log('Cidade encontrada:', city);
    
    // Se não existir, criar nova cidade
    if (!city) {
      console.log('Cidade não encontrada, criando nova cidade');
      // Se não temos um entityId, usamos um valor padrão temporário
      // Isso será atualizado quando um ente federado for associado à cidade
      const defaultEntityId = '000000000000000000000000'; // ID temporário
      
      city = new City({
        name,
        state: state.toUpperCase(),
        entityId: entityId || defaultEntityId,
        isCapital: false
      });
      
      await city.save();
      console.log('Nova cidade criada:', city);
    }
    
    res.json(city);
  } catch (error) {
    console.error('Erro ao buscar ou criar cidade:', error);
    res.status(500).json({ message: 'Erro ao buscar ou criar cidade' });
  }
}; 