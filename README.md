# ClubHub

**Tudo sobre o teu clube, à distância de um clique.**

ClubHub é uma aplicação mobile para adeptos acompanharem o seu clube de futebol em tempo real - jogos, plantel, classificações, notícias e muito mais.

---

## Visão Geral

ClubHub é composta por duas partes:

- **ClubHub-backend** - API REST em Node.js/TypeScript com Express, PostgreSQL (Sequelize) e Redis
- **ClubHub-frontend** - Aplicação mobile em React Native (Expo) com Socket.IO client

---

## Funcionalidades

- **Jogos** - Listagem de jogos passados e futuros, com detalhes de cada jogo
- **Eventos em tempo real** - Golos, cartões e outros eventos via WebSocket (Socket.IO)
- **Multi-escalão** - Suporte a vários escalões do clube (Seniores, Sub-19, Sub-17, Sub-15, Sub-13), cada um com o seu próprio plantel, jogos e classificação
- **Plantel** - Consulta do plantel e perfis de jogadores
- **Estatísticas** - Stats individuais e da equipa por época
- **Classificações** - Tabela classificativa da competição
- **Notícias** - Feed de notícias do clube com gestão de conteúdo
- **Comunicados** - Avisos/comunicados ativos do clube
- **Notificações push** - Lembretes de jogos e alertas via Firebase Cloud Messaging
- **Feedback** - Os utilizadores podem enviar feedback (com imagem opcional) para a equipa do clube
- **Autenticação** - Login de administradores com JWT (access + refresh token) e roles
- **Upload de imagens** - Supabase Storage para imagens de notícias, jogadores e feedback
- **Web Scraping** - Importação automática de dados do ZeroZero (jogos, plantel, classificações, stats) com Puppeteer/Cheerio
- **Painel de administração** - Gestão de jogos, escalações, notícias, comunicados e definições da app

---

## Estrutura do Projeto

```
ClubHub/
├── ClubHub-backend/        # API REST (Node.js + TypeScript)
│   └── src/
│       ├── controllers/    # Lógica de cada recurso
│       ├── models/         # Modelos Sequelize (PostgreSQL)
│       ├── routes/         # Definição de endpoints
│       ├── middlewares/    # Auth, roles, upload, error handling
│       ├── services/       # Lógica de negócio e serviços externos (Supabase, Firebase, etc.)
│       ├── scrapers/       # Scraping do ZeroZero (jogos, plantel, classificações, stats)
│       ├── jobs/           # Cron jobs (lembretes de jogos, wake-up)
│       ├── queues/         # Filas Bull (notificações)
│       ├── cache/          # Invalidação e keys do Redis
│       ├── errors/         # Classe de erro de aplicação (AppError)
│       └── config/         # Database, Redis, Firebase, Socket.IO, configuração do clube
│
└── ClubHub-frontend/       # App mobile (React Native + Expo)
    └── src/
        ├── screens/        # Ecrãs da app (Home, Jogos, Plantel, Notícias, Admin...)
        ├── navigation/     # Stack e Tab navigators
        ├── services/       # Chamadas à API
        ├── models/         # Tipos TypeScript
        ├── components/     # Componentes reutilizáveis
        ├── contexts/       # Contextos React (Auth, Socket, Época, Transição de escalão)
        ├── hooks/          # Custom hooks
        ├── theme/          # Cores e estilos globais
        └── utils/          # Utilitários (datas, notificações, posições)
```

---

## Tecnologias

### Backend
| Tecnologia | Uso |
|---|---|
| Node.js + TypeScript | Runtime e linguagem |
| Express 5 | Framework HTTP |
| Sequelize + PostgreSQL | ORM e base de dados |
| Socket.IO | Eventos em tempo real |
| Redis | Cache |
| Bull | Filas (notificações) |
| Firebase Admin | Push notifications |
| Supabase Storage | Armazenamento de imagens |
| Puppeteer + Cheerio | Web scraping (ZeroZero) |
| node-cron | Cron jobs |
| Helmet + express-rate-limit | Segurança e limitação de pedidos |
| Pino | Logging estruturado |

### Frontend
| Tecnologia | Uso |
|---|---|
| React Native 0.83 + Expo 55 | Framework mobile |
| TypeScript | Linguagem |
| React Navigation | Navegação entre ecrãs |
| TanStack Query | Data fetching e cache |
| Socket.IO Client | Eventos em tempo real |
| Firebase Messaging + Expo Notifications | Push notifications |

---

## Instalação e Setup

### Pré-requisitos

- Node.js 18+
- PostgreSQL
- Redis
- Conta Supabase (Storage)
- Projeto Firebase com FCM
- Expo CLI (`npm install -g expo-cli`)

---

### Backend

```bash
cd ClubHub-backend
npm install
```

Cria um ficheiro `.env` na raiz do backend com as seguintes variáveis:

```env
PORT=3000
NODE_ENV=development

DATABASE_URL=postgresql://user:password@localhost:5432/clubhub
REDIS_URL=redis://localhost:6379

JWT_ACCESS_SECRET=...   # mínimo 32 caracteres
JWT_REFRESH_SECRET=...  # mínimo 32 caracteres

SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_BUCKET=uploads

FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...

ALLOWED_ORIGINS=https://exemplo.com
LOG_LEVEL=info
```

> `JWT_ACCESS_SECRET` e `JWT_REFRESH_SECRET` têm de ter pelo menos 32 caracteres - o servidor recusa-se a arrancar caso contrário.

Inicia o servidor:

```bash
npm run dev       # desenvolvimento (ts-node-dev)
npm run build     # compilar para produção (tsc)
npm start         # produção (dist/server.js)
```

> Não existem migrações automatizadas - o esquema da base de dados é criado/atualizado manualmente (ver modelos em `src/models/`).

---

### Frontend

```bash
cd ClubHub-frontend
npm install
```

A URL do backend está definida em `src/config/teamConfig.ts` (`backend_URL`) e em `app.json` (`extra.BACKEND_URI`) - atualiza ambos para o ambiente desejado.

Para notificações push é necessário colocar o `google-services.json` (Firebase) na raiz do frontend antes de gerar builds Android - este ficheiro não está no repositório por ser sensível.

Inicia a app:

```bash
npm start          # Metro bundler
npm run android    # Emulador/dispositivo Android
npm run ios        # Simulador iOS
```

#### Builds com EAS

```bash
# Build de desenvolvimento (Android)
eas build --profile development --platform android

# Build APK de preview
eas build -p android --profile preview --clear-cache

# Build de produção
eas build --platform android --profile production
```

---

## API - Endpoints Principais

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/matches` | Lista de jogos (filtros: `/season/:seasonId`, `/current`, `/by-competition/:competitionId`) |
| PATCH | `/api/matches/:id` | Atualizar jogo (admin) - também `/date-time`, `/score`, `/location`, `/events`, `/status`, `/outcome` |
| GET | `/api/players` | Lista de jogadores |
| GET | `/api/squads` | Plantel da equipa |
| GET | `/api/standings` | Classificação |
| GET | `/api/stats` | Estatísticas |
| GET | `/api/news` | Notícias (`/last10` para as mais recentes) |
| GET | `/api/statements` | Comunicados ativos |
| GET | `/api/competitions` | Competições |
| GET | `/api/seasons` | Épocas |
| GET | `/api/helper/categories` | Escalões disponíveis (configurados em `teamConfig`) |
| POST | `/api/auth/login` | Login de administrador |
| POST | `/api/auth/refresh` | Renovar access token |
| GET | `/api/auth/me` | Dados do utilizador autenticado |
| POST | `/api/device` | Registar dispositivo para push notifications |
| POST | `/api/match-events` | Adicionar evento a um jogo (admin) |
| POST | `/api/notifications/send` | Enviar notificação push (admin) |
| POST | `/api/feedback` | Enviar feedback (com imagem opcional) |
| POST | `/api/scrape/allInfo` | Correr o scraper para todos os escalões ativos (admin) |
| POST | `/api/scrape/category/:category` | Correr o scraper para um escalão específico (admin) |

Todos os endpoints de escrita (POST/PUT/PATCH/DELETE) que afetam dados do clube exigem autenticação e a role `admin`, exceto `/api/feedback` e `/api/device` (públicos, mas limitados por rate-limit).

---

## Autenticação e Roles

A autenticação é feita via JWT (`access token`, 15 min + `refresh token`, 7 dias). O refresh token é guardado na base de dados e invalidado no logout. Existem diferentes roles que controlam quem pode gerir conteúdo, jogos e definições da app - aplicadas através do middleware `authorizeRoles`.

---

## Eventos em Tempo Real

O backend expõe um servidor Socket.IO. O frontend subscreve eventos de jogos em direto (golos, cartões, etc.) e atualizações de dados (após scraping) sem necessidade de polling.

---

## Cache e Filas

- **Redis** é usado para cache de respostas (ver `src/cache/`); a cache é invalidada automaticamente após operações de escrita e depois de cada execução do scraper.
- **Bull** (sobre Redis) gere a fila de envio de notificações push.

---

## Cron Jobs

| Job | Ficheiro | Função |
|---|---|---|
| Lembrete de jogos | `src/jobs/matchReminder.job.ts` | Envia notificações push antes dos jogos |
| Wake-up | `src/jobs/wake-up.ts` | Faz ping periódico ao próprio backend para evitar cold-starts em hosts como o Render |

O scraping (`src/scrapers/`) não corre automaticamente por cron neste momento - é disparado manualmente através dos endpoints `/api/scrape/*` (admin).

---

## Comandos Úteis

```bash
# Formatar código
npx prettier --write .

# Verificar dependências Expo
npx expo-doctor

# Atualizar dependências Expo
npx expo install --check
```

---

## 🔧 Adaptar para outro Clube

O ClubHub foi desenhado para ser facilmente reutilizável para qualquer clube. Para o adaptar:

1. **Configurar os escalões** em `ClubHub-backend/src/config/teamConfig.ts`. Cada escalão é um objeto independente em `categories`, com os respetivos URLs do ZeroZero:

```typescript
export const teamConfig = {
  name: "Nome do Clube",
  updateSchedule: "0 2 * * 0",              // cron de referência para atualização
  teamLocation: "Nome do Estádio, Localidade",
  currentSeason: getCurrentSeason(),

  categories: [
    {
      category: "over19",                    // identificador interno do escalão
      label: "Seniores",                      // nome apresentado na app
      enabled: true,                          // ativa/desativa o escalão
      teamName: "Nome do Clube",
      players_url: "https://www.zerozero.pt/...",
      matches_url: "https://www.zerozero.pt/...",
      standings_url: "https://www.zerozero.pt/...",
      stats_url: "https://www.zerozero.pt/...",
      teams_urls: ["https://www.zerozero.pt/..."],  // equipas da competição (classificação)
    },
    // ... outros escalões (sub19, sub17, sub15, sub13)
  ],
};
```

2. **Atualizar a URL do backend** em `ClubHub-frontend/src/config/teamConfig.ts` (`backend_URL`) e em `ClubHub-frontend/app.json` (`extra.BACKEND_URI`).
3. **Mudar o nome e ícone da app** em `ClubHub-frontend/app.json`:
   - `name` - nome da app
   - `slug` - identificador único
   - `icon` - caminho para o ícone (1024×1024 px)
   - `splash.image` - imagem de splash screen
   - `android.package` - identificador do pacote Android
4. **Atualizar as cores** em `ClubHub-frontend/src/theme/colors.ts` para as cores do clube.
5. **Substituir `google-services.json`** pelo ficheiro do novo projeto Firebase.

O scraper vai buscar automaticamente jogos, plantel, classificações e estatísticas ao ZeroZero com base nos URLs configurados em cada escalão.

> **Nota:** A utilização de dados do [ZeroZero.pt](https://www.zerozero.pt) foi autorizada por email pela equipa do ZeroZero.

---

## Roadmap

- [ ] Histórico de épocas
- [ ] Votação em MVP da época
- [ ] Agendamento automático do scraper (atualmente é manual via endpoint admin)
- [ ] Widget para ecrã inicial do telemóvel

---