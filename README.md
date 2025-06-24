# INDICA - Sistema Integrado de Informações e Indicadores Culturais

O INDICA é uma plataforma completa para gestão de editais culturais, inscrições, avaliações e acompanhamento de projetos. O sistema permite que entidades culturais publiquem editais, agentes culturais realizem inscrições, avaliadores analisem os projetos e administradores acompanhem todo o processo.

## Funcionalidades Principais

### Para Entidades e Administradores
- Cadastro e gerenciamento de editais culturais
- Definição de critérios de avaliação
- Designação de avaliadores para projetos
- Acompanhamento de inscrições e avaliações
- Relatórios e estatísticas detalhadas
- Gestão de usuários e permissões

### Para Agentes Culturais
- Visualização de editais disponíveis
- Inscrição de projetos em editais
- Upload de documentos
- Acompanhamento do status das inscrições
- Visualização de resultados e pareceres

### Para Avaliadores
- Acesso aos projetos designados para avaliação
- Interface para pontuação por critérios
- Registro de pareceres
- Acompanhamento de avaliações realizadas

## Tecnologias Utilizadas

### Backend
- Node.js com Express
- TypeScript
- MongoDB para banco de dados
- JWT para autenticação
- Multer para upload de arquivos

### Frontend
- React com TypeScript
- Material UI para interface
- React Router para navegação
- Context API para gerenciamento de estado
- Axios para requisições HTTP
- Recharts para visualização de dados

## Estrutura do Projeto

```
indica/
├── project/
│   ├── backend/              # Servidor Node.js/Express
│   │   ├── src/
│   │   │   ├── config/       # Configurações (banco de dados, etc)
│   │   │   ├── controllers/  # Controladores da API
│   │   │   ├── middleware/   # Middlewares (autenticação, etc)
│   │   │   ├── models/       # Modelos do MongoDB
│   │   │   ├── routes/       # Rotas da API
│   │   │   ├── types/        # Definições de tipos TypeScript
│   │   │   └── index.ts      # Ponto de entrada do servidor
│   │   └── package.json
│   │
│   └── frontend/             # Aplicação React
│       ├── public/
│       ├── src/
│       │   ├── components/   # Componentes reutilizáveis
│       │   ├── contexts/     # Contextos React (autenticação, etc)
│       │   ├── layouts/      # Layouts da aplicação
│       │   ├── pages/        # Páginas da aplicação
│       │   ├── services/     # Serviços (API, etc)
│       │   ├── utils/        # Utilitários
│       │   └── App.tsx       # Componente principal
│       └── package.json
```

## Fluxo do Sistema

1. **Administrador** cria um edital com critérios de avaliação
2. **Agente Cultural** visualiza o edital e realiza uma inscrição
3. **Administrador** designa avaliadores para as inscrições
4. **Avaliador** analisa e pontua os projetos conforme critérios
5. **Sistema** calcula as notas finais e determina projetos aprovados
6. **Agente Cultural** visualiza o resultado e pareceres
7. **Administrador** gera relatórios e estatísticas

## Instalação e Execução

### Requisitos
- Node.js (v14+)
- MongoDB
- NPM ou Yarn

### Backend
```bash
cd project/backend
npm install
npm run dev
```

### Frontend
```bash
cd project/frontend
npm install
npm start
```

## Licença
Este projeto está sob a licença MIT. 
