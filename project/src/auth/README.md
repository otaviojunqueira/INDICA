# Autenticação

Este diretório estava contendo a implementação de autenticação baseada em Context API, mas agora foi substituída pelo gerenciamento de estado com Zustand.

A lógica de autenticação atual está implementada no arquivo `src/store/authStore.ts` utilizando Zustand.

## Uso

```tsx
import { useAuthStore } from '../store/authStore';

function MinhaComponente() {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  
  // Utilizar os estados e funções de autenticação
}
```

## API de Autenticação

- `login(cpfCnpj: string, password: string)`: Realiza o login
- `logout()`: Realiza o logout
- `register(userData: ...)`: Registra um novo usuário 
- `checkAuth()`: Verifica autenticação atual

## Estado

- `user`: Objeto com dados do usuário atual ou null
- `isAuthenticated`: Boolean indicando se o usuário está autenticado
- `isLoading`: Boolean indicando se uma operação de autenticação está em curso 