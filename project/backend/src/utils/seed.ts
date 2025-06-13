import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/database';
import User from '../models/User.model';
import Entity from '../models/Entity.model';

// Carregar variáveis de ambiente
dotenv.config();

// Função para limpar e popular o banco de dados
async function seedDatabase() {
  try {
    console.log('🔄 Conectando ao banco de dados...');
    await connectDB();
    
    // Limpar coleções existentes
    console.log('🧹 Limpando coleções existentes...');
    await User.deleteMany({});
    await Entity.deleteMany({});
    
    // Criar entidades
    console.log('🏢 Criando entidades...');
    const entities = await Entity.insertMany([
      {
        name: 'Ministério da Cultura',
        type: 'federal',
        cnpj: '01.264.142/0001-29',
        address: 'Esplanada dos Ministérios, Bloco B, Brasília - DF',
        contactEmail: 'contato@cultura.gov.br',
        contactPhone: '(61) 3316-2121',
        isActive: true
      },
      {
        name: 'Secretaria de Cultura do Estado de São Paulo',
        type: 'state',
        cnpj: '51.531.043/0001-78',
        address: 'Rua Mauá, 51, São Paulo - SP',
        contactEmail: 'contato@cultura.sp.gov.br',
        contactPhone: '(11) 3339-8000',
        isActive: true
      },
      {
        name: 'Secretaria Municipal de Cultura do Rio de Janeiro',
        type: 'municipal',
        cnpj: '42.498.733/0001-48',
        address: 'Rua da Imprensa, 16, Centro, Rio de Janeiro - RJ',
        contactEmail: 'contato@cultura.rio.rj.gov.br',
        contactPhone: '(21) 2976-7624',
        isActive: true
      }
    ]);
    
    console.log(`✅ ${entities.length} entidades criadas com sucesso!`);
    
    // Criar usuários
    console.log('👥 Criando usuários...');
    
    // Administradores (um para cada entidade)
    const admins = await User.create([
      {
        cpfCnpj: '123.456.789-01',
        name: 'Admin Federal',
        email: 'admin.federal@cultura.gov.br',
        password: 'senha123',
        phone: '(61) 98765-4321',
        role: 'admin',
        entityId: entities[0]._id,
        isActive: true
      },
      {
        cpfCnpj: '234.567.890-12',
        name: 'Admin Estadual',
        email: 'admin.estadual@cultura.sp.gov.br',
        password: 'senha123',
        phone: '(11) 98765-4321',
        role: 'admin',
        entityId: entities[1]._id,
        isActive: true
      },
      {
        cpfCnpj: '345.678.901-23',
        name: 'Admin Municipal',
        email: 'admin.municipal@cultura.rio.rj.gov.br',
        password: 'senha123',
        phone: '(21) 98765-4321',
        role: 'admin',
        entityId: entities[2]._id,
        isActive: true
      }
    ]);
    
    console.log(`✅ ${admins.length} administradores criados com sucesso!`);
    
    // Pareceristas
    const evaluators = await User.create([
      {
        cpfCnpj: '456.789.012-34',
        name: 'Parecerista de Música',
        email: 'parecerista.musica@exemplo.com',
        password: 'senha123',
        phone: '(11) 91234-5678',
        role: 'evaluator',
        isActive: true
      },
      {
        cpfCnpj: '567.890.123-45',
        name: 'Parecerista de Teatro',
        email: 'parecerista.teatro@exemplo.com',
        password: 'senha123',
        phone: '(21) 92345-6789',
        role: 'evaluator',
        isActive: true
      },
      {
        cpfCnpj: '678.901.234-56',
        name: 'Parecerista de Artes Visuais',
        email: 'parecerista.artes@exemplo.com',
        password: 'senha123',
        phone: '(31) 93456-7890',
        role: 'evaluator',
        isActive: true
      }
    ]);
    
    console.log(`✅ ${evaluators.length} pareceristas criados com sucesso!`);
    
    // Agentes culturais
    const agents = await User.create([
      {
        cpfCnpj: '789.012.345-67',
        name: 'Músico Independente',
        email: 'musico@exemplo.com',
        password: 'senha123',
        phone: '(11) 94567-8901',
        role: 'agent',
        isActive: true
      },
      {
        cpfCnpj: '890.123.456-78',
        name: 'Grupo Teatral',
        email: 'teatro@exemplo.com',
        password: 'senha123',
        phone: '(21) 95678-9012',
        role: 'agent',
        isActive: true
      },
      {
        cpfCnpj: '901.234.567-89',
        name: 'Artista Visual',
        email: 'artista@exemplo.com',
        password: 'senha123',
        phone: '(31) 96789-0123',
        role: 'agent',
        isActive: true
      },
      {
        cpfCnpj: '012.345.678-90',
        name: 'Produtor Cultural',
        email: 'produtor@exemplo.com',
        password: 'senha123',
        phone: '(41) 97890-1234',
        role: 'agent',
        isActive: true
      },
      {
        cpfCnpj: '111.222.333-44',
        name: 'Coletivo Cultural',
        email: 'coletivo@exemplo.com',
        password: 'senha123',
        phone: '(51) 98901-2345',
        role: 'agent',
        isActive: true
      }
    ]);
    
    console.log(`✅ ${agents.length} agentes culturais criados com sucesso!`);
    
    // Resumo
    console.log('\n📊 Resumo da população do banco de dados:');
    console.log(`- ${entities.length} entidades`);
    console.log(`- ${admins.length} administradores`);
    console.log(`- ${evaluators.length} pareceristas`);
    console.log(`- ${agents.length} agentes culturais`);
    console.log(`- ${admins.length + evaluators.length + agents.length} usuários no total`);
    
    // Dados de acesso
    console.log('\n🔑 Dados de acesso para teste:');
    console.log('- Admin Federal: admin.federal@cultura.gov.br / senha123 / CPF: 123.456.789-01');
    console.log('- Parecerista: parecerista.musica@exemplo.com / senha123 / CPF: 456.789.012-34');
    console.log('- Agente Cultural: musico@exemplo.com / senha123 / CPF: 789.012.345-67');
    
    console.log('\n✅ Banco de dados populado com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao popular o banco de dados:', error);
  } finally {
    // Fechar conexão
    await mongoose.connection.close();
    console.log('🔌 Conexão com o banco de dados fechada.');
    process.exit(0);
  }
}

// Executar a função de seed
seedDatabase(); 