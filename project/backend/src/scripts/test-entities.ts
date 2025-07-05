import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.model';
import { Document } from 'mongoose';

// Carregar variáveis de ambiente
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://otavio:tempuser25@cluster0.zxchsxd.mongodb.net/indica?retryWrites=true&w=majority';

// Interface para o objeto cityId populado
interface PopulatedCity {
  _id: string;
  name: string;
  state: string;
}

// Interface estendida para o usuário com cityId populado
interface UserWithCity extends Document {
  _id: string;
  name: string;
  email: string;
  cpfCnpj: string;
  phone: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  cityId?: PopulatedCity;
}

// Função principal
async function testEntities() {
  try {
    console.log('Conectando ao MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Conectado ao MongoDB com sucesso!');

    // Verificar entidades existentes
    const entities = await User.find({ role: 'entity' })
      .select('-password')
      .populate('cityId', 'name state');

    console.log(`\nTotal de entes federados encontrados: ${entities.length}`);
    
    if (entities.length === 0) {
      console.log('Nenhum ente federado encontrado no banco de dados.');
    } else {
      console.log('\nLista de entes federados:');
      entities.forEach((entity, index) => {
        const typedEntity = entity as unknown as UserWithCity;
        
        console.log(`\n--- Ente Federado ${index + 1} ---`);
        console.log(`ID: ${typedEntity._id}`);
        console.log(`Nome: ${typedEntity.name}`);
        console.log(`Email: ${typedEntity.email}`);
        console.log(`CPF/CNPJ: ${typedEntity.cpfCnpj}`);
        console.log(`Telefone: ${typedEntity.phone}`);
        console.log(`Status: ${typedEntity.isActive ? 'Ativo' : 'Inativo'}`);
        
        // Verificar se cityId está populado e tem as propriedades necessárias
        if (typedEntity.cityId && 'name' in typedEntity.cityId && 'state' in typedEntity.cityId) {
          console.log(`Cidade: ${typedEntity.cityId.name}/${typedEntity.cityId.state}`);
        } else {
          console.log('Cidade: Não definida');
        }
        
        console.log(`Data de criação: ${typedEntity.createdAt}`);
      });
    }

    // Verificar super admins
    const admins = await User.find({ role: 'admin' }).select('-password');
    
    console.log(`\nTotal de administradores encontrados: ${admins.length}`);
    
    if (admins.length === 0) {
      console.log('Nenhum administrador encontrado no banco de dados.');
    } else {
      console.log('\nLista de administradores:');
      admins.forEach((admin, index) => {
        console.log(`\n--- Administrador ${index + 1} ---`);
        console.log(`ID: ${admin._id}`);
        console.log(`Nome: ${admin.name}`);
        console.log(`Email: ${admin.email}`);
        console.log(`CPF/CNPJ: ${admin.cpfCnpj}`);
        console.log(`Status: ${admin.isActive ? 'Ativo' : 'Inativo'}`);
      });
    }

  } catch (error) {
    console.error('Erro ao testar entidades:', error);
  } finally {
    // Fechar conexão com o MongoDB
    await mongoose.connection.close();
    console.log('\nConexão com o MongoDB fechada.');
  }
}

// Executar função principal
testEntities(); 