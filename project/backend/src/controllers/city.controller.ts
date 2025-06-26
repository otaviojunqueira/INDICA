import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { City } from '../models';
import { handleAsync } from '../utils/errorHandler';

// Controller para cidades
export const cityController = {
  // Listar todas as cidades
  listCities: handleAsync(async (req: Request, res: Response) => {
    const { state, query, active } = req.query;
    
    // Construir filtro de busca
    const filter: any = {};
    
    if (state) {
      filter.stateCode = state.toString().toUpperCase();
    }
    
    if (query) {
      filter.name = { $regex: query.toString(), $options: 'i' };
    }
    
    if (active !== undefined) {
      filter.isActive = active === 'true';
    }
    
    const cities = await City.find(filter)
      .sort({ state: 1, name: 1 })
      .select('name state stateCode ibgeCode isCapital');
    
    res.json(cities);
  }),
  
  // Obter cidade por ID
  getCityById: handleAsync(async (req: Request, res: Response) => {
    const city = await City.findById(req.params.id);
    
    if (!city) {
      return res.status(404).json({ message: 'Cidade não encontrada' });
    }
    
    res.json(city);
  }),
  
  // Criar nova cidade (apenas admin)
  createCity: handleAsync(async (req: Request, res: Response) => {
    // Verificar se o usuário tem permissão (admin)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    
    // Validar os dados da requisição
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, state, stateCode, ibgeCode, isCapital } = req.body;
    
    // Verificar se a cidade já existe
    const existingCity = await City.findOne({ ibgeCode });
    if (existingCity) {
      return res.status(400).json({ message: 'Cidade já cadastrada com este código IBGE' });
    }
    
    // Criar a nova cidade
    const city = new City({
      name,
      state,
      stateCode: stateCode.toUpperCase(),
      ibgeCode,
      isCapital: isCapital || false
    });
    
    await city.save();
    
    res.status(201).json({
      message: 'Cidade criada com sucesso',
      city
    });
  }),
  
  // Atualizar cidade (apenas admin)
  updateCity: handleAsync(async (req: Request, res: Response) => {
    // Verificar se o usuário tem permissão (admin)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    
    // Validar os dados da requisição
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, state, stateCode, ibgeCode, isCapital, isActive } = req.body;
    
    // Verificar se a cidade existe
    const city = await City.findById(req.params.id);
    if (!city) {
      return res.status(404).json({ message: 'Cidade não encontrada' });
    }
    
    // Verificar se o código IBGE já está em uso por outra cidade
    if (ibgeCode && ibgeCode !== city.ibgeCode) {
      const existingCity = await City.findOne({ ibgeCode });
      if (existingCity && existingCity._id.toString() !== req.params.id) {
        return res.status(400).json({ message: 'Código IBGE já está em uso por outra cidade' });
      }
    }
    
    // Atualizar os dados da cidade
    if (name) city.name = name;
    if (state) city.state = state;
    if (stateCode) city.stateCode = stateCode.toUpperCase();
    if (ibgeCode) city.ibgeCode = ibgeCode;
    if (isCapital !== undefined) city.isCapital = isCapital;
    if (isActive !== undefined) city.isActive = isActive;
    
    await city.save();
    
    res.json({
      message: 'Cidade atualizada com sucesso',
      city
    });
  }),
  
  // Excluir cidade (apenas admin)
  deleteCity: handleAsync(async (req: Request, res: Response) => {
    // Verificar se o usuário tem permissão (admin)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    
    // Verificar se a cidade existe
    const city = await City.findById(req.params.id);
    if (!city) {
      return res.status(404).json({ message: 'Cidade não encontrada' });
    }
    
    // Em vez de excluir, apenas desativar
    city.isActive = false;
    await city.save();
    
    res.json({
      message: 'Cidade desativada com sucesso'
    });
  }),
  
  // Importar cidades em lote (apenas admin)
  importCities: handleAsync(async (req: Request, res: Response) => {
    // Verificar se o usuário tem permissão (admin)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    
    // Validar os dados da requisição
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { cities } = req.body;
    
    if (!Array.isArray(cities) || cities.length === 0) {
      return res.status(400).json({ message: 'Lista de cidades inválida' });
    }
    
    const results = {
      total: cities.length,
      created: 0,
      errors: [] as Array<{ index: number; message: string }>
    };
    
    // Processar cada cidade
    for (let i = 0; i < cities.length; i++) {
      const cityData = cities[i];
      
      try {
        // Verificar se a cidade já existe
        const existingCity = await City.findOne({ ibgeCode: cityData.ibgeCode });
        if (existingCity) {
          results.errors.push({
            index: i,
            message: `Cidade com código IBGE ${cityData.ibgeCode} já existe`
          });
          continue;
        }
        
        // Criar a nova cidade
        const city = new City({
          name: cityData.name,
          state: cityData.state,
          stateCode: cityData.stateCode.toUpperCase(),
          ibgeCode: cityData.ibgeCode,
          isCapital: cityData.isCapital || false
        });
        
        await city.save();
        results.created++;
      } catch (error: any) {
        results.errors.push({
          index: i,
          message: error.message
        });
      }
    }
    
    res.status(201).json({
      message: 'Importação concluída',
      results
    });
  })
}; 