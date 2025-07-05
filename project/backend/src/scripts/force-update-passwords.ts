import { User } from '../models';
import bcrypt from 'bcrypt';
import { connectDB, disconnectDB } from '../config/database';
import mongoose from 'mongoose';

// Novas credenciais para os super admins
const SUPER_ADMIN_CREDENTIALS = [
  {
    email: 'admin1@indica.com.br',
    cpfCnpj: '808.478.600-86',
    password: 'IndicaCultura@2025'
  },
  {
    email: 'admin2@indica.com.br',
    cpfCnpj: '269.174.960-65',
    password: 'IndicaCultura@2025'
  }
];

async function forceUpdatePasswords() {
  try {
    console.log('Conectando ao banco de dados...');
    await connectDB();
    console.log('Conexão estabelecida!');
    
    for (const cred of SUPER_ADMIN_CREDENTIALS) {
      console.log(`\n--- Atualizando senha para ${cred.email} ---`);
      
      // Buscar o usuário pelo email
      const user = await User.findOne({ email: cred.email });
      
      if (!user) {
        console.log(`Usuário com email ${cred.email} não encontrado.`);
        continue;
      }
      
      console.log('Usuário encontrado:');
      console.log('ID:', user._id);
      console.log('Nome:', user.name);
      console.log('CPF/CNPJ:', user.cpfCnpj);
      
      // Gerar hash da senha usando bcrypt diretamente
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(cred.password, salt);
      
      // Atualizar a senha diretamente no MongoDB
      await mongoose.connection.collection('users').updateOne(
        { _id: user._id },
        { $set: { password: hashedPassword } }
      );
      
      // Verificar se a senha foi atualizada corretamente
      const updatedUser = await User.findById(user._id);
      const isMatch = await bcrypt.compare(cred.password, updatedUser!.password);
      
      console.log('Senha atualizada:', updatedUser!.password);
      console.log('Verificação da senha:', isMatch ? 'SUCESSO' : 'FALHA');
      
      // Testar manualmente o login
      console.log('\nTestando login manualmente:');
      console.log('CPF/CNPJ:', user.cpfCnpj);
      console.log('Senha:', cred.password);
      
      const testUser = await User.findOne({ cpfCnpj: user.cpfCnpj });
      if (testUser) {
        const testMatch = await bcrypt.compare(cred.password, testUser.password);
        console.log('Resultado do teste de login:', testMatch ? 'SUCESSO' : 'FALHA');
      } else {
        console.log('Usuário não encontrado pelo CPF/CNPJ');
      }
    }
    
    console.log('\nSenhas atualizadas com sucesso!');
    
  } catch (error) {
    console.error('Erro ao atualizar senhas:', error);
  } finally {
    try {
      await disconnectDB();
      console.log('\nDesconectado do banco de dados.');
    } catch (err) {
      console.error('Erro ao desconectar do banco de dados:', err);
    }
    process.exit(0);
  }
}

// Executar o script
forceUpdatePasswords(); 