# INDICA - Sistema Integrado de Informações e Indicadores Culturais

Sistema para gestão de editais culturais, inscrições, avaliações e acompanhamento de projetos culturais.

## Estrutura do Projeto

Este é um projeto monorepo com:
- Frontend React (diretório raiz)
- Backend Node.js/Express (diretório `/backend`)

## Requisitos

- Node.js 14+
- MongoDB (local ou Atlas)

## Configuração e Execução

### 1. Backend

Primeiro, configure e inicie o backend:

```bash
# Navegue para o diretório do backend
cd backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
# Crie um arquivo .env seguindo o exemplo do .env.example

# Teste a conexão com o MongoDB
npm run db:test

# Popule o banco de dados com dados fictícios para teste
npm run seed

# Inicie o servidor de desenvolvimento
npm run dev
```

O backend estará disponível em: http://localhost:5000

### 2. Frontend

Em um novo terminal, configure e inicie o frontend:

```bash
# Na raiz do projeto
npm install

# Inicie o servidor de desenvolvimento do frontend
npm run dev
```

O frontend estará disponível em: http://localhost:5173

### 3. Executar ambos simultaneamente

```bash
# Na raiz do projeto
npm run dev:all
```

## Usuários de Teste

Após executar o script de seed no backend, os seguintes usuários estarão disponíveis para teste:

### Administrador (Ente Federativo)
- CPF/CNPJ: 123.456.789-01
- Senha: senha123

### Parecerista
- CPF/CNPJ: 456.789.012-34
- Senha: senha123

### Agente Cultural
- CPF/CNPJ: 789.012.345-67
- Senha: senha123

## Funcionalidades

- **Administradores (Entes Federativos)**
  - Gerenciamento de editais
  - Aprovação de inscrições
  - Designação de pareceristas
  - Relatórios e estatísticas

- **Pareceristas**
  - Avaliação de projetos
  - Emissão de pareceres
  - Acompanhamento de prazos

- **Agentes Culturais**
  - Inscrição em editais
  - Acompanhamento de inscrições
  - Gestão de projetos aprovados

## Tecnologias

### Frontend
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- React Router
- Zustand (gerenciamento de estado)
- Axios

### Backend
- Node.js
- Express
- TypeScript
- MongoDB/Mongoose
- JWT para autenticação
- Express Validator

## Desenvolvimento

### Scripts Disponíveis

#### Frontend (raiz)
- `npm run dev` - Inicia o servidor de desenvolvimento do frontend
- `npm run build` - Compila o frontend para produção
- `npm run lint` - Executa o linter no código
- `npm run preview` - Visualiza a build de produção localmente

#### Backend (/backend)
- `npm run dev` - Inicia o servidor de desenvolvimento do backend
- `npm run build` - Compila o backend para produção
- `npm run start` - Inicia o servidor em modo de produção
- `npm run seed` - Popula o banco de dados com dados fictícios
- `npm run db:test` - Testa a conexão com o banco de dados 