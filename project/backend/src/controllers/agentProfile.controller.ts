import { Request, Response } from 'express';
import { AgentProfile } from '../models';
import { handleAsync } from '../utils/errorHandler';

export const agentProfileController = {
  // Criar ou atualizar perfil do agente
  createOrUpdateProfile: handleAsync(async (req: Request, res: Response) => {
    const userId = req.user.id; // Assumindo que o middleware de autenticação adiciona o usuário à requisição
    
    const profile = await AgentProfile.findOneAndUpdate(
      { userId },
      { ...req.body, userId },
      { new: true, upsert: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: profile
    });
  }),
  
  // Obter perfil do agente
  getProfile: handleAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;
    console.log('Buscando perfil para o usuário:', userId);
    
    try {
      // Tentativa de buscar perfil existente
      let profile = await AgentProfile.findOne({ userId });
      
      if (!profile) {
        console.log('Perfil não encontrado para o usuário:', userId);
        
        // Criar um perfil vazio (esqueleto) se não existir
        const emptyProfile = {
          userId,
          // Valores padrão mínimos para o perfil
          dateOfBirth: new Date('2000-01-01'), // Data padrão
          gender: 'prefiro_nao_informar',
          raceEthnicity: 'prefiro_nao_informar',
          education: 'medio_completo',
          address: {
            street: '',
            number: '',
            neighborhood: '',
            city: '',
            state: '',
            zipCode: '00000-000'
          },
          monthlyIncome: 0,
          householdIncome: 0,
          householdMembers: 1,
          occupation: '',
          workRegime: '',
          culturalArea: ['outro'],
          yearsOfExperience: 0,
          biography: '',
          hasDisability: false
        };
        
        // Retornar o perfil vazio sem salvar no banco de dados
        return res.status(200).json({
          success: true,
          data: emptyProfile,
          isNewProfile: true
        });
      }
      
      console.log('Perfil encontrado:', profile);
      
      // Retornar o perfil existente
      res.status(200).json({
        success: true,
        data: profile,
        isNewProfile: false
      });
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao buscar perfil do agente cultural'
      });
    }
  }),
  
  // Obter perfil por ID do usuário
  getProfileByUserId: handleAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    
    const profile = await AgentProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Perfil não encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: profile
    });
  }),
  
  // Obter perfil de outro agente (público)
  getPublicProfile: handleAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    
    const profile = await AgentProfile.findOne({ userId })
      .select('-monthlyIncome -householdIncome -householdMembers -hasDisability -disabilityDetails -accessibilityNeeds');
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Perfil não encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: profile
    });
  }),
  
  // Excluir perfil
  deleteProfile: handleAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;
    
    const profile = await AgentProfile.findOneAndDelete({ userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Perfil não encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Perfil excluído com sucesso'
    });
  })
}; 