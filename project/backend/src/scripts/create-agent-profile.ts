import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/database';
import { User, AgentProfile, CulturalGroup } from '../models';

// Carregar variáveis de ambiente
dotenv.config();

// Função para criar um perfil de agente cultural completo
async function createCompleteAgentProfile() {
  try {
    console.log('🔄 Conectando ao banco de dados...');
    await connectDB();
    
    // Verifica se existe um usuário agente cultural
    console.log('🔍 Buscando um usuário agente cultural...');
    let agent = await User.findOne({ role: 'agent' });
    
    // Se não existir, cria um novo usuário agente cultural
    if (!agent) {
      console.log('👤 Criando um novo usuário agente cultural...');
      agent = await User.create({
        cpfCnpj: '789.012.345-67',
        name: 'Músico Independente',
        email: 'musico@exemplo.com',
        password: 'senha123',
        phone: '(11) 94567-8901',
        role: 'agent',
        isActive: true
      });
      
      console.log('✅ Usuário agente cultural criado com sucesso!');
      console.log('   Nome:', agent.name);
      console.log('   Email:', agent.email);
      console.log('   Senha: senha123');
      console.log('   CPF/CNPJ:', agent.cpfCnpj);
    } else {
      console.log('✅ Usuário agente cultural encontrado:', agent.name);
    }

    // Verifica se o agente já tem um perfil
    const existingProfile = await AgentProfile.findOne({ userId: agent._id });
    if (existingProfile) {
      console.log('❗ Este agente já possui um perfil. Deletando para criar um novo...');
      await AgentProfile.deleteOne({ userId: agent._id });
    }
    
    // Cria um perfil completo para o agente
    console.log('👨‍🎤 Criando um perfil completo para o agente cultural...');
    
    const agentProfile = await AgentProfile.create({
      userId: agent._id,
      
      // Dados Pessoais
      dateOfBirth: new Date('1985-07-15'),
      gender: 'masculino',
      raceEthnicity: 'pardo',
      education: 'superior_completo',
      
      // Endereço
      address: {
        street: 'Rua das Artes',
        number: '123',
        complement: 'Apto 45',
        neighborhood: 'Vila Cultural',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '04567-890'
      },
      
      // Dados Socioeconômicos
      monthlyIncome: 3500,
      householdIncome: 5000,
      householdMembers: 2,
      occupation: 'Músico e Produtor Cultural',
      workRegime: 'autonomo',
      
      // Dados Culturais
      culturalArea: ['musica', 'audiovisual'],
      yearsOfExperience: 12,
      portfolioLinks: [
        'https://soundcloud.com/musico-exemplo',
        'https://youtube.com/musicoexemplo'
      ],
      biography: `Profissional com mais de 12 anos de experiência no mercado musical, 
      especializado em composição, produção e direção musical. Formado em Música pela 
      Universidade Estadual de São Paulo, com pós-graduação em Produção Musical. 
      Já trabalhou em diversos projetos culturais, festivais e tem dois álbuns autorais lançados. 
      Atua também como educador musical em projetos sociais.`,
      
      // Dados de Acessibilidade
      hasDisability: false,
      
      // Para testar os recursos de coletivo cultural
      isCollectiveManager: true
    });
    
    console.log('✅ Perfil do agente cultural criado com sucesso!');
    
    // Cria um coletivo cultural associado ao agente
    console.log('👥 Criando um coletivo cultural...');
    
    const culturalGroup = await CulturalGroup.create({
      name: 'Coletivo Musical Harmonia',
      description: 'Grupo dedicado à fusão de ritmos brasileiros com jazz e música eletrônica, promovendo oficinas e apresentações em comunidades.',
      foundationDate: new Date('2010-03-20'),
      culturalArea: ['musica', 'educacao'],
      cnpj: '12.345.678/0001-90',
      address: {
        street: 'Rua dos Músicos',
        number: '456',
        complement: 'Sala 12',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567'
      },
      contactEmail: 'contato@coletivoharmonia.com.br',
      contactPhone: '(11) 3456-7890',
      website: 'https://coletivoharmonia.com.br',
      socialMedia: {
        instagram: '@coletivoharmonia',
        facebook: 'facebook.com/coletivoharmonia',
        youtube: 'youtube.com/coletivoharmonia'
      },
      representatives: [
        {
          userId: agent._id,
          role: 'coordenador',
          isMainContact: true
        }
      ],
      members: [
        {
          name: 'João Silva',
          role: 'Baterista',
          joinedDate: new Date('2010-03-20')
        },
        {
          name: 'Maria Oliveira',
          role: 'Vocalista',
          joinedDate: new Date('2011-05-15')
        },
        {
          name: 'Carlos Santos',
          role: 'Baixista',
          joinedDate: new Date('2012-07-10')
        }
      ],
      portfolioLinks: [
        'https://youtube.com/coletivoharmonia/video1',
        'https://soundcloud.com/coletivoharmonia/album1'
      ]
    });
    
    console.log('✅ Coletivo cultural criado com sucesso!');
    console.log('   Nome:', culturalGroup.name);
    
    console.log('\n🎉 Dados criados com sucesso! Você pode fazer login com:');
    console.log('   Email:', agent.email);
    console.log('   Senha: senha123');
    console.log('   CPF/CNPJ:', agent.cpfCnpj);
    
  } catch (error) {
    console.error('❌ Erro ao criar dados:', error);
  } finally {
    // Fechar conexão
    await mongoose.connection.close();
    console.log('🔌 Conexão com o banco de dados fechada.');
    process.exit(0);
  }
}

// Executar a função
createCompleteAgentProfile();
