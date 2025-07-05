import { User } from '../models';
import bcrypt from 'bcrypt';
import { connectDB, disconnectDB } from '../config/database';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente
dotenv.config();

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

async function updateAdminCredentials() {
  try {
    console.log('Conectando ao banco de dados...');
    await connectDB();
    console.log('Conexão estabelecida!');
    
    for (const cred of SUPER_ADMIN_CREDENTIALS) {
      console.log(`\n--- Atualizando credenciais para ${cred.email} ---`);
      
      // Buscar o usuário pelo email
      const user = await User.findOne({ email: cred.email });
      
      if (!user) {
        console.log(`Usuário com email ${cred.email} não encontrado.`);
        continue;
      }
      
      console.log('Usuário encontrado:');
      console.log('ID:', user._id);
      console.log('Nome:', user.name);
      console.log('CPF/CNPJ atual:', user.cpfCnpj);
      
      // Atualizar CPF/CNPJ
      user.cpfCnpj = cred.cpfCnpj;
      
      // Atualizar senha
      const hashedPassword = await bcrypt.hash(cred.password, 10);
      user.password = hashedPassword;
      
      // Salvar alterações
      await user.save();
      
      console.log('Credenciais atualizadas:');
      console.log('Novo CPF/CNPJ:', cred.cpfCnpj);
      console.log('Nova senha:', cred.password);
    }
    
    console.log('\nCredenciais dos super admins atualizadas com sucesso!');
    
  } catch (error) {
    console.error('Erro ao atualizar credenciais:', error);
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
updateAdminCredentials(); 