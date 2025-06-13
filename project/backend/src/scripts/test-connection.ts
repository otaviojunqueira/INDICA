import { testConnection } from '../config/database';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente
dotenv.config();

// Função para exibir informações da conexão
const showConnectionInfo = (): void => {
  console.log('\n======== INFORMAÇÕES DE CONEXÃO MONGODB ========');
  console.log(`URI: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/indica'}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log('================================================\n');
};

// Função principal
const main = async (): Promise<void> => {
  try {
    showConnectionInfo();
    console.log('🔄 Testando conexão com MongoDB...');
    
    const isConnected = await testConnection();
    
    if (isConnected) {
      console.log('✅ Conexão com MongoDB funcionando corretamente!');
      process.exit(0);
    } else {
      console.error('❌ Não foi possível estabelecer conexão com MongoDB');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
    process.exit(1);
  }
};

// Executar o script
main(); 