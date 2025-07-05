import { User } from '../models';
import bcrypt from 'bcrypt';
import { connectDB, disconnectDB } from '../config/database';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente
dotenv.config();

async function testLogin() {
  try {
    console.log('Conectando ao banco de dados...');
    await connectDB();
    console.log('Conexão estabelecida!');
    
    // Credenciais para teste
    const testCredentials = [
      { cpfCnpj: '123.456.789-00', password: 'Admin@123!' },
      { cpfCnpj: '987.654.321-00', password: 'Admin@123!' },
      // Versões sem formatação
      { cpfCnpj: '12345678900', password: 'Admin@123!' },
      { cpfCnpj: '98765432100', password: 'Admin@123!' }
    ];
    
    for (const cred of testCredentials) {
      console.log(`\n--- Testando login com CPF/CNPJ: ${cred.cpfCnpj} ---`);
      
      // Buscar o usuário pelo CPF/CNPJ
      const user = await User.findOne({ cpfCnpj: cred.cpfCnpj });
      
      if (!user) {
        console.log(`Usuário com CPF/CNPJ ${cred.cpfCnpj} não encontrado.`);
        
        // Tentar buscar com CPF/CNPJ limpo
        const cleanCpfCnpj = cred.cpfCnpj.replace(/\D/g, '');
        console.log(`Tentando com CPF/CNPJ limpo: ${cleanCpfCnpj}`);
        
        // Buscar todos os usuários e filtrar manualmente
        const allUsers = await User.find();
        
        const userByCleanCpf = allUsers.find(u => {
          const cleanUserCpf = u.cpfCnpj.replace(/\D/g, '');
          return cleanUserCpf === cleanCpfCnpj;
        });
        
        if (userByCleanCpf) {
          console.log('Usuário encontrado com CPF/CNPJ limpo:');
          console.log('ID:', userByCleanCpf._id);
          console.log('Nome:', userByCleanCpf.name);
          console.log('Email:', userByCleanCpf.email);
          console.log('CPF/CNPJ no banco:', userByCleanCpf.cpfCnpj);
          
          // Verificar a senha
          const isMatch = await bcrypt.compare(cred.password, userByCleanCpf.password);
          console.log('Senha correta:', isMatch ? 'Sim' : 'Não');
          
          if (isMatch) {
            console.log('Login seria bem-sucedido!');
          } else {
            console.log('Senha incorreta. Login falharia.');
            
            // Atualizar a senha para a senha de teste
            const hashedPassword = await bcrypt.hash(cred.password, 10);
            userByCleanCpf.password = hashedPassword;
            await userByCleanCpf.save();
            console.log('Senha atualizada para:', cred.password);
          }
        } else {
          console.log('Usuário não encontrado mesmo com CPF/CNPJ limpo.');
        }
      } else {
        console.log('Usuário encontrado:');
        console.log('ID:', user._id);
        console.log('Nome:', user.name);
        console.log('Email:', user.email);
        console.log('CPF/CNPJ:', user.cpfCnpj);
        
        // Verificar a senha
        const isMatch = await bcrypt.compare(cred.password, user.password);
        console.log('Senha correta:', isMatch ? 'Sim' : 'Não');
        
        if (isMatch) {
          console.log('Login seria bem-sucedido!');
        } else {
          console.log('Senha incorreta. Login falharia.');
          
          // Atualizar a senha para a senha de teste
          const hashedPassword = await bcrypt.hash(cred.password, 10);
          user.password = hashedPassword;
          await user.save();
          console.log('Senha atualizada para:', cred.password);
        }
      }
    }
    
  } catch (error) {
    console.error('Erro ao testar login:', error);
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

// Executar o teste
testLogin(); 