import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente
dotenv.config();

// URI de conexão com o MongoDB (use variável de ambiente ou fallback)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/indica';

// Opções de conexão avançadas para MongoDB
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4, // Use IPv4, skip trying IPv6
  maxPoolSize: 10,
  connectTimeoutMS: 10000,
  retryWrites: true,
  w: 'majority'
} as mongoose.ConnectOptions;

// Função para conectar ao MongoDB
export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI, options);
    console.log('✅ Conexão com MongoDB estabelecida com sucesso!');
    
    // Configurar listeners para eventos de conexão
    mongoose.connection.on('error', (err) => {
      console.error(`❌ Erro na conexão com MongoDB: ${err.message}`);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB desconectado! Tentando reconectar...');
      setTimeout(() => connectDB(), 5000);
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconectado!');
    });
    
    // Capturar sinais de encerramento do processo
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB desconectado por término da aplicação');
        process.exit(0);
      } catch (err) {
        console.error(`Erro ao fechar conexão: ${err}`);
        process.exit(1);
      }
    });
    
  } catch (error: any) {
    console.error(`❌ Falha ao conectar com MongoDB: ${error.message}`);
    console.error('Verifique se a URI de conexão está correta e se o servidor está disponível.');
    
    // Tentar reconectar após 10 segundos em caso de falha
    console.log('⏳ Tentando reconectar em 10 segundos...');
    setTimeout(() => connectDB(), 10000);
  }
};

// Função para desconectar do MongoDB
export const disconnectDB = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('✅ Desconexão do MongoDB realizada com sucesso!');
    }
  } catch (error: any) {
    console.error(`❌ Erro ao desconectar do MongoDB: ${error.message}`);
    throw error;
  }
};

// Função para testar a conexão
export const testConnection = async (): Promise<boolean> => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('✅ Conexão já estabelecida!');
      return true;
    }
    
    console.log('🔄 Testando conexão com MongoDB...');
    await mongoose.connect(MONGODB_URI, options);
    console.log('✅ Teste de conexão bem-sucedido!');
    await mongoose.connection.close();
    return true;
  } catch (error: any) {
    console.error(`❌ Falha no teste de conexão: ${error.message}`);
    return false;
  }
};

export default { connectDB, testConnection }; 