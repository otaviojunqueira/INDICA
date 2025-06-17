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