# ClubHub

**Tudo sobre o teu clube, à distância de um clique.**

ClubHub é uma aplicação mobile para adeptos acompanharem o seu clube de futebol em tempo real — jogos, plantel, classificações, notícias e muito mais.

---

## Visão Geral

ClubHub é composta por duas partes:

- **ClubHub-backend** — API REST em Node.js/TypeScript com Express, PostgreSQL (Sequelize) e Redis
- **ClubHub-frontend** — Aplicação mobile em React Native com Expo

---

## Funcionalidades

- **Jogos** — Listagem de jogos passados e futuros, com detalhes de cada jogo
- **Eventos em tempo real** — Golos, cartões e outros eventos via WebSocket (Socket.IO)
- **Plantel** — Consulta do plantel e perfis de jogadores
- **Estatísticas** — Stats individuais e da equipa por época
- **Classificações** — Tabela classificativa da competição
- **Notícias** — Feed de notícias do clube com gestão de conteúdo
- **Notificações push** — Lembretes de jogos e alertas via Firebase Cloud Messaging
- **Autenticação** — Login de administradores com roles e permissões
- **Upload de imagens** — Cloudinary para imagens de notícias e jogadores
- **Web Scraping** — Importação automática de dados externos com Puppeteer/Cheerio
- **Painel de administração** — Gestão de jogos, escalações, notícias e definições da app

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
│       ├── services/       # Serviços externos (Cloudinary, Firebase, etc.)
│       ├── jobs/           # Cron jobs (lembretes de jogos)
│       ├── cache/          # Invalidação e keys do Redis
│       └── config/         # Database, Redis, Firebase, Socket.IO
│
└── ClubHub-frontend/       # App mobile (React Native + Expo)
    └── src/
        ├── screens/        # Ecrãs da app (Home, Jogos, Plantel, Notícias, Admin...)
        ├── navigation/     # Stack e Tab navigators
        ├── services/       # Chamadas à API
        ├── models/         # Tipos TypeScript
        ├── components/     # Componentes reutilizáveis
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
| Redis / Upstash | Cache e filas (Bull) |
| Firebase Admin | Push notifications |
| Cloudinary | Armazenamento de imagens |
| Puppeteer + Cheerio | Web scraping |
| node-cron | Cron jobs |

### Frontend
| Tecnologia | Uso |
|---|---|
| React Native 0.83 + Expo 55 | Framework mobile |
| TypeScript | Linguagem |
| React Navigation | Navegação entre ecrãs |
| TanStack Query | Data fetching e cache |
| Socket.IO Client | Eventos em tempo real |
| Firebase Messaging | Push notifications |
| Expo Notifications | Gestão de notificações |

---

## Instalação e Setup

### Pré-requisitos

- Node.js 18+
- PostgreSQL
- Redis
- Expo CLI (`npm install -g expo-cli`)
- Conta Cloudinary
- Projeto Firebase com FCM

---

### Backend

```bash
cd ClubHub-backend
npm install
```

Cria um ficheiro `.env` na raiz do backend:

```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/clubhub
REDIS_URL=redis://localhost:6379
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
JWT_SECRET=...
```

Corre as migrações e inicia o servidor:

```bash
npm run dev       # desenvolvimento (ts-node-dev)
npm run build     # compilar para produção
npm start         # produção (dist/server.js)
```

---

### Frontend

```bash
cd ClubHub-frontend
npm install
```

Cria um ficheiro `.env` (ou `app.config.js`) com a URL da API:

```env
API_URL=http://localhost:3000/api
```

Inicia a app:

```bash
npm start          # Metro bundler
npm run android    # Emulador Android
npm run ios        # Simulador iOS
```

#### Builds com EAS

```bash
# Build de desenvolvimento (Android)
eas build --profile development --platform android

# Build APK de preview
eas build -p android --profile preview --clear-cache
```

---

## API — Endpoints Principais

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/matches` | Lista de jogos |
| GET | `/api/matches/:id` | Detalhe de um jogo |
| GET | `/api/players` | Lista de jogadores |
| GET | `/api/squads` | Plantel da equipa |
| GET | `/api/standings` | Classificação |
| GET | `/api/stats` | Estatísticas |
| GET | `/api/news` | Notícias |
| GET | `/api/competitions` | Competições |
| GET | `/api/seasons` | Épocas |
| POST | `/api/auth/login` | Login de administrador |
| POST | `/api/match-events` | Adicionar evento a um jogo |
| POST | `/api/notifications/send` | Enviar notificação push |

---

## Autenticação e Roles

A autenticação é feita via JWT. Existem diferentes níveis de acesso (roles) que controlam quem pode gerir conteúdo, jogos e definições da app.

---

## Eventos em Tempo Real

O backend expõe um servidor Socket.IO. O frontend subscreve eventos de jogos em direto (golos, cartões, etc.) sem necessidade de polling.

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
 
O ClubHub foi desenhado para ser facilmente reutilizável para qualquer clube. Para o adaptar basta:
 
1. **Mudar o `teamConfig`** em `ClubHub-backend/src/config/teamConfig.ts`:
```typescript
export const teamConfig = {
  name: "Nome do Clube",                          // nome que aparece na app
  players_url: "https://www.zerozero.pt/...",     // URL do plantel no ZeroZero
  matches_url: "https://www.zerozero.pt/...",     // URL dos jogos no ZeroZero
  standings_url: "https://www.zerozero.pt/...",   // URL da classificação
  teams1: "https://www.zerozero.pt/...",          // URL da 1ª divisão
  teams2: "https://www.zerozero.pt/...",          // URL da 2ª divisão (se aplicável)
  stats: "https://www.zerozero.pt/...",           // URL das estatísticas
  nr_teams: 16,                                   // número de equipas na divisão
  teamLocation: "Nome do Estádio, Localidade",    // localização do campo
  updateSchedule: "0 2 * * 0",                    // cron de atualização automática
  currentSeason: getCurrentSeason(),
};

```
 
2. **Mudar o nome e ícone da app** em `ClubHub-frontend/app.json`:
   - `name` — nome da app
   - `slug` — identificador único
   - `icon` — caminho para o ícone (1024×1024 px)
   - `splash.image` — imagem de splash screen
3. **Atualizar as cores** em `ClubHub-frontend/src/theme/colors.ts` para as cores do clube.
O scraper vai buscar automaticamente jogos, plantel e estatísticas ao ZeroZero com base nos URLs configurados.
 
 > **Nota:** A utilização de dados do [ZeroZero.pt](https://www.zerozero.pt) foi autorizada por email pela equipa do ZeroZero.
 
---

## Roadmap

- [ ] Histórico de épocas
- [ ] Votação em MVP da época
- [ ] Escalões (tabelas por escalão, ex: match_u18)
- [ ] Widget para ecrã inicial do telemóvel

---