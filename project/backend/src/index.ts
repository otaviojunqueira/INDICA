import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import routes from './routes';
import authRoutes from './routes/auth.routes';

// Configuração das variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Obtenha a URL do frontend da variável de ambiente ou use um valor padrão
const frontendURL = process.env.FRONTEND_URL || 'https://indica-teal.vercel.app';

// Middleware
app.use(cors({
  origin: [
    frontendURL,
    'http://localhost:5173' // Para desenvolvimento local
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Diretório de uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rotas API
app.use('/api', routes);
app.use('/auth', authRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.send('API do Sistema INDICA está funcionando!');
});

// Função para iniciar o servidor
const startServer = async () => {
  try {
    // Conectar ao banco de dados
    await connectDB();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    
    // Iniciar o servidor
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
};

startServer();

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
  console.error('Erro não tratado:', err);
});

export default app; 