# Contextos

Este diretório estava destinado a conter implementações baseadas em Context API, mas a aplicação migrou para utilizar o Zustand como gerenciador de estado global.

## Migração para Zustand

Os contextos anteriormente implementados aqui foram migrados para stores do Zustand:

- **AuthContext**: Migrado para `store/authStore.ts`

## Vantagens do Zustand

- Menor boilerplate
- Melhor desempenho
- Facilita testes unitários
- Integração mais simples com ferramentas de debug
- Menos re-renders desnecessários 