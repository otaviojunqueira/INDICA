import { User } from '../models';
import bcrypt from 'bcrypt';
import { connectDB, disconnectDB } from '../config/database';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente
dotenv.config();

const SUPER_ADMIN_USERS = [
  {
    name: 'Admin 1',
    email: 'admin1@indica.com.br',
    password: 'Admin@123!',
    cpfCnpj: '123.456.789-00', // Manter a formatação para compatibilidade com o frontend
    phone: '(11) 99999-9999',
  },
  {
    name: 'Admin 2',
    email: 'admin2@indica.com.br',
    password: 'Admin@123!',
    cpfCnpj: '987.654.321-00', // Manter a formatação para compatibilidade com o frontend
    phone: '(11) 98888-8888',
  }
];

async function createSuperAdmins() {
  try {
    console.log('Conectando ao banco de dados...');
    await connectDB();
    console.log('Conexão estabelecida!');
    
    for (const adminData of SUPER_ADMIN_USERS) {
      try {
        // Verifica se o usuário já existe
        const existingUser = await User.findOne({ email: adminData.email });
        
        if (!existingUser) {
          // Cria o hash da senha
          const hashedPassword = await bcrypt.hash(adminData.password, 10);
          
          // Cria o usuário admin
          await User.create({
            ...adminData,
            password: hashedPassword,
            role: 'admin',
            isActive: true
          });
          
          console.log(`Super admin criado: ${adminData.email} (CPF: ${adminData.cpfCnpj})`);
        } else {
          console.log(`Super admin já existe: ${adminData.email}`);
          
          // Atualiza o CPF/CNPJ e senha se necessário
          existingUser.cpfCnpj = adminData.cpfCnpj;
          existingUser.password = await bcrypt.hash(adminData.password, 10);
          await existingUser.save();
          
          console.log(`Credenciais atualizadas para: ${adminData.email} (CPF: ${adminData.cpfCnpj})`);
        }
      } catch (err) {
        console.error(`Erro ao processar usuário ${adminData.email}:`, err);
      }
    }
    
    console.log('Script finalizado com sucesso!');
  } catch (error) {
    console.error('Erro ao criar super admins:', error);
  } finally {
    // Desconecta do banco de dados
    try {
      await disconnectDB();
      console.log('Desconectado do banco de dados.');
    } catch (err) {
      console.error('Erro ao desconectar do banco de dados:', err);
    }
    process.exit(0);
  }
}

// Executa o script
createSuperAdmins(); 