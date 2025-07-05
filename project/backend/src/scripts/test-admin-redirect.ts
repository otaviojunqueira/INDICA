import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.model';
import bcrypt from 'bcryptjs';

// Carregar variáveis de ambiente
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/indica';

// Lista de emails permitidos para super admins
const SUPER_ADMIN_EMAILS = [
  'admin1@indica.com.br',
  'admin2@indica.com.br'
];

// Função principal
async function testAdminRedirect() {
  try {
    console.log('Conectando ao MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Conectado ao MongoDB com sucesso!');

    // Verificar super admins
    const admins = await User.find({ 
      role: 'admin',
      email: { $in: SUPER_ADMIN_EMAILS }
    });
    
    console.log(`\nTotal de super admins encontrados: ${admins.length}`);
    
    if (admins.length === 0) {
      console.log('Nenhum super admin encontrado no banco de dados.');
      console.log('Verifique se os emails configurados estão corretos:');
      console.log(SUPER_ADMIN_EMAILS);
    } else {
      console.log('\nLista de super admins:');
      admins.forEach((admin, index) => {
        console.log(`\n--- Super Admin ${index + 1} ---`);
        console.log(`ID: ${admin._id}`);
        console.log(`Nome: ${admin.name}`);
        console.log(`Email: ${admin.email}`);
        console.log(`CPF/CNPJ: ${admin.cpfCnpj}`);
        console.log(`Status: ${admin.isActive ? 'Ativo' : 'Inativo'}`);
      });

      // Verificar se os super admins têm a senha correta
      console.log('\nTestando autenticação para super admins:');
      const testPassword = 'IndicaCultura@2025';
      
      for (const admin of admins) {
        try {
          const isMatch = await admin.comparePassword(testPassword);
          console.log(`Autenticação para ${admin.email}: ${isMatch ? 'Sucesso ✅' : 'Falha ❌'}`);
          
          if (!isMatch) {
            console.log('Senha incorreta. Deseja atualizar a senha? (Este é apenas um teste, não será atualizada realmente)');
          }
        } catch (error) {
          console.error(`Erro ao verificar senha para ${admin.email}:`, error);
        }
      }
    }

    // Verificar outros usuários admin que não são super admins
    const otherAdmins = await User.find({ 
      role: 'admin',
      email: { $nin: SUPER_ADMIN_EMAILS }
    });
    
    if (otherAdmins.length > 0) {
      console.log(`\nEncontrados ${otherAdmins.length} administradores que NÃO são super admins:`);
      otherAdmins.forEach((admin, index) => {
        console.log(`\n--- Admin Regular ${index + 1} ---`);
        console.log(`ID: ${admin._id}`);
        console.log(`Nome: ${admin.name}`);
        console.log(`Email: ${admin.email}`);
      });
      console.log('\nEstes usuários não terão acesso às funcionalidades de super admin.');
    }

  } catch (error) {
    console.error('Erro ao testar redirecionamento de admin:', error);
  } finally {
    // Fechar conexão com o MongoDB
    await mongoose.connection.close();
    console.log('\nConexão com o MongoDB fechada.');
  }
}

// Executar função principal
testAdminRedirect(); 