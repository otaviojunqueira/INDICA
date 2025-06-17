import { Request, Response } from 'express';
import { CulturalGroup } from '../models';
import { handleAsync } from '../utils/errorHandler';
import mongoose from 'mongoose';

// Interface do documento para tipagem correta
interface Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  type: string;
  path: string;
  uploadedAt: Date;
  uploadedBy: mongoose.Types.ObjectId;
}

export const culturalGroupController = {
  // Criar novo coletivo cultural
  createGroup: handleAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;
    
    const groupData = {
      ...req.body,
      members: [{
        userId,
        role: 'admin',
        joinedAt: new Date()
      }]
    };
    
    const group = await CulturalGroup.create(groupData);
    
    res.status(201).json({
      success: true,
      data: group
    });
  }),
  
  // Atualizar coletivo cultural
  updateGroup: handleAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Verificar se o usuário é admin do grupo
    const group = await CulturalGroup.findOne({
      _id: id,
      'members': {
        $elemMatch: {
          userId,
          role: 'admin'
        }
      }
    });
    
    if (!group) {
      return res.status(404).json({
        success: false,
        error: 'Coletivo não encontrado ou você não tem permissão para editá-lo'
      });
    }
    
    // Não permitir alteração direta dos membros por esta rota
    delete req.body.members;
    
    const updatedGroup = await CulturalGroup.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: updatedGroup
    });
  }),
  
  // Obter coletivo cultural
  getGroup: handleAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    const group = await CulturalGroup.findById(id)
      .populate('members.userId', 'name email');
    
    if (!group) {
      return res.status(404).json({
        success: false,
        error: 'Coletivo não encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: group
    });
  }),
  
  // Listar coletivos culturais
  listGroups: handleAsync(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ]
        }
      : {};
    
    const groups = await CulturalGroup.find(query)
      .populate('members.userId', 'name email')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });
    
    const total = await CulturalGroup.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: groups,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  }),
  
  // Adicionar membro ao coletivo
  addMember: handleAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId: newMemberId, role = 'member' } = req.body;
    const adminId = req.user.id;
    
    // Verificar se o usuário é admin do grupo
    const group = await CulturalGroup.findOne({
      _id: id,
      'members': {
        $elemMatch: {
          userId: adminId,
          role: 'admin'
        }
      }
    });
    
    if (!group) {
      return res.status(404).json({
        success: false,
        error: 'Coletivo não encontrado ou você não tem permissão para adicionar membros'
      });
    }
    
    // Verificar se o usuário já é membro
    const isMember = group.members.some(member => 
      member.userId.toString() === newMemberId
    );
    
    if (isMember) {
      return res.status(400).json({
        success: false,
        error: 'Usuário já é membro do coletivo'
      });
    }
    
    group.members.push({
      userId: newMemberId,
      role,
      joinedAt: new Date()
    });
    
    await group.save();
    
    res.status(200).json({
      success: true,
      data: group
    });
  }),
  
  // Remover membro do coletivo
  removeMember: handleAsync(async (req: Request, res: Response) => {
    const { id, memberId } = req.params;
    const userId = req.user.id;
    
    // Verificar se o usuário é admin do grupo
    const group = await CulturalGroup.findOne({
      _id: id,
      'members': {
        $elemMatch: {
          userId,
          role: 'admin'
        }
      }
    });
    
    if (!group) {
      return res.status(404).json({
        success: false,
        error: 'Coletivo não encontrado ou você não tem permissão para remover membros'
      });
    }
    
    // Não permitir remover o último admin
    const adminCount = group.members.filter(member => member.role === 'admin').length;
    const memberToRemove = group.members.find(member => member.userId.toString() === memberId);
    
    if (memberToRemove?.role === 'admin' && adminCount <= 1) {
      return res.status(400).json({
        success: false,
        error: 'Não é possível remover o último administrador do coletivo'
      });
    }
    
    group.members = group.members.filter(member => 
      member.userId.toString() !== memberId
    );
    
    await group.save();
    
    res.status(200).json({
      success: true,
      data: group
    });
  }),
  
  // Atualizar papel de um membro
  updateMemberRole: handleAsync(async (req: Request, res: Response) => {
    const { id, memberId } = req.params;
    const { role } = req.body;
    const userId = req.user.id;
    
    // Verificar se o usuário é admin do grupo
    const group = await CulturalGroup.findOne({
      _id: id,
      'members': {
        $elemMatch: {
          userId,
          role: 'admin'
        }
      }
    });
    
    if (!group) {
      return res.status(404).json({
        success: false,
        error: 'Coletivo não encontrado ou você não tem permissão para atualizar papéis'
      });
    }
    
    // Não permitir remover o último admin
    if (role !== 'admin') {
      const adminCount = group.members.filter(member => member.role === 'admin').length;
      const memberToUpdate = group.members.find(member => member.userId.toString() === memberId);
      
      if (memberToUpdate?.role === 'admin' && adminCount <= 1) {
        return res.status(400).json({
          success: false,
          error: 'Não é possível remover o último administrador do coletivo'
        });
      }
    }
    
    const memberIndex = group.members.findIndex(member => 
      member.userId.toString() === memberId
    );
    
    if (memberIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Membro não encontrado'
      });
    }
    
    group.members[memberIndex].role = role;
    await group.save();
    
    res.status(200).json({
      success: true,
      data: group
    });
  }),
  
  // Adicionar documento ao coletivo
  addDocument: handleAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user.id;
    const { name, type, path } = req.body;
    
    // Verificar se o usuário é membro do grupo
    const group = await CulturalGroup.findOne({
      _id: id,
      'members.userId': userId
    });
    
    if (!group) {
      return res.status(404).json({
        success: false,
        error: 'Coletivo não encontrado ou você não é membro'
      });
    }
    
    group.documents = group.documents || [];
    
    const newDocument = {
      name,
      type,
      path,
      uploadedAt: new Date(),
      uploadedBy: userId
    } as Document;
    
    group.documents.push(newDocument);
    
    await group.save();
    
    res.status(200).json({
      success: true,
      data: group
    });
  }),
  
  // Remover documento do coletivo
  removeDocument: handleAsync(async (req: Request, res: Response) => {
    const { id, documentId } = req.params;
    const userId = req.user.id;
    
    // Verificar se o usuário é admin ou quem fez o upload
    const group = await CulturalGroup.findOne({
      _id: id,
      $or: [
        {
          'members': {
            $elemMatch: {
              userId,
              role: 'admin'
            }
          }
        },
        {
          'documents': {
            $elemMatch: {
              _id: documentId,
              uploadedBy: userId
            }
          }
        }
      ]
    });
    
    if (!group) {
      return res.status(404).json({
        success: false,
        error: 'Coletivo não encontrado ou você não tem permissão para remover este documento'
      });
    }
    
    // Usando cast para garantir que o TypeScript reconheça o _id
    group.documents = group.documents?.filter(doc => 
      (doc as Document)._id.toString() !== documentId
    ) || [];
    
    await group.save();
    
    res.status(200).json({
      success: true,
      data: group
    });
  })
}; 