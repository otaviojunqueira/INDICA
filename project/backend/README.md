# Backend do INDICA - Sistema Integrado de Informações e Indicadores Culturais

Este é o backend do sistema INDICA, uma plataforma para gestão de editais culturais, inscrições, avaliações e acompanhamento de projetos culturais.

## Requisitos

- Node.js 14+
- MongoDB (local ou Atlas)

## Configuração

1. Clone o repositório
2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

Crie um arquivo `.env` na raiz do projeto backend com o seguinte conteúdo:

```
# Porta do servidor
PORT=5000

# Configuração do JWT
JWT_SECRET=indica_secret_key
JWT_EXPIRES_IN=24h

# Conexão com MongoDB Atlas (substitua pelos seus dados reais de conexão)
# MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/indica?retryWrites=true&w=majority

# Para desenvolvimento local com MongoDB
MONGODB_URI=mongodb://localhost:27017/indica

# Ambiente
NODE_ENV=development
```

## MongoDB

### Opção 1: MongoDB Local

1. Instale o MongoDB Community Edition:
   - [Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)
   - [macOS](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)
   - [Linux](https://docs.mongodb.com/manual/administration/install-on-linux/)

2. Inicie o serviço MongoDB:
   - Windows: `mongod`
   - macOS/Linux: `sudo systemctl start mongod`

### Opção 2: MongoDB Atlas (Nuvem)

1. Crie uma conta em [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie um cluster gratuito
3. Configure um usuário e senha para o banco de dados
4. Adicione seu IP atual à lista de IPs permitidos
5. Obtenha a string de conexão e substitua no arquivo `.env`

## Executando o Projeto

1. Teste a conexão com o banco de dados:

```bash
npm run db:test
```

2. Popule o banco de dados com dados fictícios:

```bash
npm run seed
```

3. Inicie o servidor em modo de desenvolvimento:

```bash
npm run dev
```

O servidor estará disponível em: http://localhost:5000

## Dados de Teste

Após executar o script de seed, os seguintes usuários estarão disponíveis para teste:

### Administrador (Ente Federativo)
- Email: admin.federal@cultura.gov.br
- CPF/CNPJ: 123.456.789-01
- Senha: senha123

### Parecerista
- Email: parecerista.musica@exemplo.com
- CPF/CNPJ: 456.789.012-34
- Senha: senha123

### Agente Cultural
- Email: musico@exemplo.com
- CPF/CNPJ: 789.012.345-67
- Senha: senha123

## Estrutura do Projeto

```
src/
  ├── config/         # Configurações (banco de dados, etc)
  ├── controllers/    # Controladores da API
  ├── middleware/     # Middlewares (autenticação, etc)
  ├── models/         # Modelos do MongoDB
  ├── routes/         # Rotas da API
  ├── services/       # Serviços de negócio
  ├── utils/          # Utilitários
  └── index.ts        # Ponto de entrada da aplicação
```

## Modelos de Dados

- **User**: Usuários do sistema (admin, agente cultural, parecerista)
- **Entity**: Entes federados (municipal, estadual, federal)
- **Notice**: Editais culturais
- **Application**: Inscrições em editais
- **Evaluation**: Avaliações de inscrições
- **Attachment**: Documentos anexados
- **Notification**: Notificações do sistema

## API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login de usuário
- `GET /api/auth/profile` - Obter perfil do usuário autenticado
- `PUT /api/auth/password` - Atualizar senha

### Entidades
- `GET /api/entities` - Listar todas as entidades
- `GET /api/entities/:id` - Obter uma entidade específica
- `POST /api/entities` - Criar uma nova entidade (admin)
- `PUT /api/entities/:id` - Atualizar uma entidade (admin)
- `DELETE /api/entities/:id` - Desativar uma entidade (admin)

### Usuários
- `GET /api/users` - Listar todos os usuários (admin)
- `GET /api/users/:id` - Obter um usuário específico
- `PUT /api/users/:id` - Atualizar um usuário
- `DELETE /api/users/:id` - Desativar um usuário (admin)

### Editais
- `GET /api/notices` - Listar todos os editais
- `GET /api/notices/:id` - Obter um edital específico
- `POST /api/notices` - Criar um novo edital (admin)
- `PUT /api/notices/:id` - Atualizar um edital (admin)
- `DELETE /api/notices/:id` - Desativar um edital (admin)

### Inscrições
- `GET /api/applications` - Listar inscrições
- `GET /api/applications/:id` - Obter uma inscrição específica
- `POST /api/applications` - Criar uma nova inscrição
- `PUT /api/applications/:id` - Atualizar uma inscrição
- `DELETE /api/applications/:id` - Cancelar uma inscrição

## Instalação e Execução

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Configure o arquivo `.env` com as variáveis de ambiente necessárias
4. Execute as migrações do banco de dados: `npm run migrate`
5. Inicie o servidor: `npm run dev`

## Scripts Disponíveis

- `npm start` - Inicia o servidor em produção
- `npm run dev` - Inicia o servidor em modo de desenvolvimento
- `npm run build` - Compila o TypeScript para JavaScript
- `npm test` - Executa os testes 