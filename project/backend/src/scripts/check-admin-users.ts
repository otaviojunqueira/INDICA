import { User } from '../models';
import { connectDB, disconnectDB } from '../config/database';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente
dotenv.config();

async function checkAdminUsers() {
  try {
    console.log('Conectando ao banco de dados...');
    await connectDB();
    console.log('Conexão estabelecida!');
    
    // Busca todos os usuários admin
    const adminUsers = await User.find({ role: 'admin' }).select('-password');
    
    console.log('Total de usuários admin encontrados:', adminUsers.length);
    
    // Exibe detalhes de cada admin
    adminUsers.forEach((admin, index) => {
      console.log(`\n--- Admin ${index + 1} ---`);
      console.log('ID:', admin._id);
      console.log('Nome:', admin.name);
      console.log('Email:', admin.email);
      console.log('CPF/CNPJ:', admin.cpfCnpj);
      console.log('Telefone:', admin.phone);
      console.log('Ativo:', admin.isActive);
    });
    
    // Tenta encontrar especificamente os super admins que criamos
    console.log('\n--- Buscando super admins específicos ---');
    
    const admin1 = await User.findOne({ email: 'admin1@indica.com.br' }).select('-password');
    const admin2 = await User.findOne({ email: 'admin2@indica.com.br' }).select('-password');
    
    console.log('\nAdmin1 encontrado:', admin1 ? 'Sim' : 'Não');
    if (admin1) {
      console.log('CPF/CNPJ:', admin1.cpfCnpj);
      console.log('Tipo de CPF/CNPJ:', typeof admin1.cpfCnpj);
    }
    
    console.log('\nAdmin2 encontrado:', admin2 ? 'Sim' : 'Não');
    if (admin2) {
      console.log('CPF/CNPJ:', admin2.cpfCnpj);
      console.log('Tipo de CPF/CNPJ:', typeof admin2.cpfCnpj);
    }
    
    // Testa busca por CPF/CNPJ
    console.log('\n--- Testando busca por CPF/CNPJ ---');
    
    const userByCpf1 = await User.findOne({ cpfCnpj: '123.456.789-00' });
    console.log('Usuário encontrado com CPF 123.456.789-00:', userByCpf1 ? 'Sim' : 'Não');
    
    const userByCpf2 = await User.findOne({ cpfCnpj: '12345678900' });
    console.log('Usuário encontrado com CPF 12345678900:', userByCpf2 ? 'Sim' : 'Não');
    
    // Tenta busca com regex
    console.log('\n--- Testando busca com regex ---');
    
    const cleanCpf = '123.456.789-00'.replace(/\D/g, '');
    const userByRegex = await User.findOne({ 
      cpfCnpj: { $regex: cleanCpf } 
    });
    
    console.log('Usuário encontrado com regex para 12345678900:', userByRegex ? 'Sim' : 'Não');
    
  } catch (error) {
    console.error('Erro ao verificar usuários admin:', error);
  } finally {
    // Desconecta do banco de dados
    try {
      await disconnectDB();
      console.log('\nDesconectado do banco de dados.');
    } catch (err) {
      console.error('Erro ao desconectar do banco de dados:', err);
    }
    process.exit(0);
  }
}

// Executa o script
checkAdminUsers(); 