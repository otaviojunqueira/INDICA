# Autenticação

A autenticação neste projeto é gerenciada pelo Zustand (store/authStore.ts) em vez de usar Context API.

O código original que usava Context API foi migrado para uma solução baseada em Zustand para:
1. Melhor performance
2. Menor acoplamento
3. Facilidade de teste
4. Melhor portabilidade

Para usar a autenticação, importe useAuthStore:

```tsx
import { useAuthStore } from '../store/authStore';

// No seu componente
const { user, isAuthenticated, login, logout } = useAuthStore();
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