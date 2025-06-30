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