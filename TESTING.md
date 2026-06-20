# Testes do ClubHub

O projeto usa uma pirâmide de testes com três níveis:

- Backend: Vitest para unitários e Supertest para integração HTTP.
- Frontend: Jest Expo e React Native Testing Library para lógica, componentes e contratos dos serviços.
- E2E Android: Maestro para os fluxos principais de navegação na aplicação instalada.

## Comandos

### Backend

```bash
cd ClubHub-backend
npm test
npm run test:unit
npm run test:integration
npm run test:coverage
npm run test:watch
```

### Frontend

```bash
cd ClubHub-frontend
npm test
npm run test:unit
npm run test:integration
npm run test:coverage
npm run test:watch
```

### E2E Android

Os testes E2E precisam de um emulador ou dispositivo com o build Android instalado e do
[Maestro](https://maestro.mobile.dev/) disponível no `PATH`.

```bash
cd ClubHub-frontend
npm run android
npm run test:e2e
```

Os cenários ficam em `ClubHub-frontend/.maestro/`.

## Automação

A pipeline executa automaticamente:

1. testes unitários e de integração do backend;
2. testes unitários e de integração do frontend;
3. cobertura com limites mínimos de regressão;
4. validação TypeScript e builds;
5. auditoria de dependências, secret scanning, SAST e DAST.

Os limites de cobertura representam a linha de base atual e devem subir à medida que
novos módulos forem cobertos. Código novo deve chegar acompanhado dos respetivos testes.

## Isolamento

Os testes rápidos não usam serviços reais. PostgreSQL, Redis, Firebase, Supabase,
AsyncStorage e chamadas HTTP são isolados ou simulados conforme o nível do teste.
Isto mantém a execução determinística e permite correr a suite sem credenciais.
