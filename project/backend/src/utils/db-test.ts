import { testConnection } from '../config/database';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

async function testDatabaseConnection() {
  console.log('🔍 Testando conexão com o banco de dados...');
  
  try {
    const isConnected = await testConnection();
    
    if (isConnected) {
      console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
      console.log(`📊 URI de conexão: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/indica'}`);
    } else {
      console.error('❌ Falha ao conectar com o banco de dados.');
      console.error('Por favor, verifique suas credenciais e configurações de conexão.');
    }
  } catch (error) {
    console.error('❌ Erro ao testar conexão:', error);
  } finally {
    process.exit(0);
  }
}

// Executar o teste de conexão
testDatabaseConnection(); 