// project/backend/src/utils/db-test.ts
import { connectDB, disconnectDB } from '../config/database';

async function testConnection() {
  try {
    console.log('Testando conexão com o MongoDB Atlas...');
    await connectDB();
    console.log('Conexão bem-sucedida!');
    
    // Aguardar 3 segundos antes de desconectar
    setTimeout(async () => {
      await disconnectDB();
      console.log('Teste concluído.');
      process.exit(0);
    }, 3000);
    
  } catch (error) {
    console.error('Falha na conexão:', error);
    process.exit(1);
  }
}

testConnection();