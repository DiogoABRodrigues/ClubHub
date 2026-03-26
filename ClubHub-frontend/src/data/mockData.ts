
export type MatchStatus = 'upcoming' | 'live' | 'finished';
export type TeamCategory = 'Senior' | 'U19' | 'U17' | 'U15';
export type NewsCategory = 'Team' | 'Transfers' | 'Events';
export type EventType = 'goal' | 'yellow_card' | 'red_card' | 'substitution';

export interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
}

export interface SquadPlayer {
  id: string;
  name: string;
  number: number;
  position: string;
  age: number;
  photo: string;
  stats: {
    matchesPlayed: number;
    minutesPlayed: number;
    goalsScored: number;
  };
}

export interface MatchEvent {
  id: string;
  type: EventType;
  minute: number;
  player: string;
  team: 'home' | 'away';
  description?: string;
}

export interface Match {
  id: string;
  category: TeamCategory;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  time: string;
  status: MatchStatus;
  venue: string;
  homeLineup?: Player[];
  events?: MatchEvent[];
}

export interface StandingsTeam {
  id: string;
  position: number;
  name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface Standings {
  category: TeamCategory;
  league: string;
  teams: StandingsTeam[];
}

export interface NewsItem {
  id: string;
  title: string;
  category: NewsCategory;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
}

export interface NotificationPreferences {
  matchStart: boolean;
  goals: boolean;
  finalResult: boolean;
  newsAlerts: boolean;
}

// Full Squad Data with Stats
export const squadPlayers: { [key in TeamCategory]: SquadPlayer[] } = {
  Senior: [
    {
      id: '1',
      name: 'Marco Silva',
      number: 1,
      position: 'GK',
      age: 28,
      photo: 'https://images.unsplash.com/photo-1632300873131-1dd749c83f97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMGdvYWxrZWVwZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzQ1Mjk4NTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      stats: { matchesPlayed: 28, minutesPlayed: 2520, goalsScored: 0 },
    },
    {
      id: '2',
      name: 'João Santos',
      number: 2,
      position: 'RB',
      age: 26,
      photo: 'https://images.unsplash.com/photo-1764842262144-e58d386299ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBwbGF5ZXIlMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzQ1MjAwMTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      stats: { matchesPlayed: 26, minutesPlayed: 2340, goalsScored: 2 },
    },
    {
      id: '3',
      name: 'Pedro Costa',
      number: 5,
      position: 'CB',
      age: 29,
      photo: 'https://images.unsplash.com/photo-1676026367967-464babbca573?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMG1pZGZpZWxkZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzQ1Mjk4NTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      stats: { matchesPlayed: 27, minutesPlayed: 2430, goalsScored: 3 },
    },
    {
      id: '4',
      name: 'Ricardo Alves',
      number: 4,
      position: 'CB',
      age: 30,
      photo: 'https://images.unsplash.com/photo-1757773866965-014fa57ad096?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBzdHJpa2VyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc0NTI5ODU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      stats: { matchesPlayed: 25, minutesPlayed: 2250, goalsScored: 1 },
    },
    {
      id: '5',
      name: 'Miguel Torres',
      number: 3,
      position: 'LB',
      age: 24,
      photo: 'https://images.unsplash.com/photo-1764842262144-e58d386299ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBwbGF5ZXIlMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzQ1MjAwMTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      stats: { matchesPlayed: 24, minutesPlayed: 2160, goalsScored: 1 },
    },
    {
      id: '6',
      name: 'Tiago Ferreira',
      number: 8,
      position: 'CM',
      age: 27,
      photo: 'https://images.unsplash.com/photo-1676026367967-464babbca573?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMG1pZGZpZWxkZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzQ1Mjk4NTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      stats: { matchesPlayed: 28, minutesPlayed: 2520, goalsScored: 4 },
    },
    {
      id: '7',
      name: 'Bruno Martins',
      number: 6,
      position: 'CM',
      age: 25,
      photo: 'https://images.unsplash.com/photo-1764842262144-e58d386299ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBwbGF5ZXIlMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzQ1MjAwMTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      stats: { matchesPlayed: 27, minutesPlayed: 2430, goalsScored: 5 },
    },
    {
      id: '8',
      name: 'André Oliveira',
      number: 7,
      position: 'RW',
      age: 23,
      photo: 'https://images.unsplash.com/photo-1757773866965-014fa57ad096?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBzdHJpa2VyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc0NTI5ODU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      stats: { matchesPlayed: 26, minutesPlayed: 2230, goalsScored: 8 },
    },
    {
      id: '9',
      name: 'Carlos Rodrigues',
      number: 10,
      position: 'CAM',
      age: 28,
      photo: 'https://images.unsplash.com/photo-1676026367967-464babbca573?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMG1pZGZpZWxkZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzQ1Mjk4NTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      stats: { matchesPlayed: 28, minutesPlayed: 2520, goalsScored: 12 },
    },
    {
      id: '10',
      name: 'Daniel Sousa',
      number: 11,
      position: 'LW',
      age: 22,
      photo: 'https://images.unsplash.com/photo-1764842262144-e58d386299ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBwbGF5ZXIlMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzQ1MjAwMTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      stats: { matchesPlayed: 25, minutesPlayed: 2050, goalsScored: 9 },
    },
    {
      id: '11',
      name: 'Fernando Pereira',
      number: 9,
      position: 'ST',
      age: 29,
      photo: 'https://images.unsplash.com/photo-1757773866965-014fa57ad096?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBzdHJpa2VyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc0NTI5ODU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      stats: { matchesPlayed: 27, minutesPlayed: 2380, goalsScored: 18 },
    },
    {
      id: '12',
      name: 'Hugo Ribeiro',
      number: 13,
      position: 'GK',
      age: 24,
      photo: 'https://images.unsplash.com/photo-1632300873131-1dd749c83f97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMGdvYWxrZWVwZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzQ1Mjk4NTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      stats: { matchesPlayed: 5, minutesPlayed: 450, goalsScored: 0 },
    },
    {
      id: '13',
      name: 'Rui Gomes',
      number: 15,
      position: 'CB',
      age: 26,
      photo: 'https://images.unsplash.com/photo-1676026367967-464babbca573?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMG1pZGZpZWxkZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzQ1Mjk4NTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      stats: { matchesPlayed: 18, minutesPlayed: 1620, goalsScored: 2 },
    },
    {
      id: '14',
      name: 'Paulo Mendes',
      number: 17,
      position: 'CM',
      age: 21,
      photo: 'https://images.unsplash.com/photo-1764842262144-e58d386299ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBwbGF5ZXIlMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzQ1MjAwMTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      stats: { matchesPlayed: 15, minutesPlayed: 890, goalsScored: 3 },
    },
    {
      id: '15',
      name: 'Diogo Carvalho',
      number: 20,
      position: 'ST',
      age: 20,
      photo: 'https://images.unsplash.com/photo-1757773866965-014fa57ad096?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBzdHJpa2VyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc0NTI5ODU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      stats: { matchesPlayed: 12, minutesPlayed: 650, goalsScored: 4 },
    },
  ],
  U19: [
    {
      id: '101',
      name: 'Lucas Fernandes',
      number: 1,
      position: 'GK',
      age: 18,
      photo: 'https://images.unsplash.com/photo-1632300873131-1dd749c83f97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMGdvYWxrZWVwZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzQ1Mjk4NTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      stats: { matchesPlayed: 20, minutesPlayed: 1800, goalsScored: 0 },
    },
    {
      id: '102',
      name: 'Tomás Silva',
      number: 2,
      position: 'RB',
      age: 19,
      photo: 'https://images.unsplash.com/photo-1764842262144-e58d386299ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBwbGF5ZXIlMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzQ1MjAwMTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      stats: { matchesPlayed: 19, minutesPlayed: 1710, goalsScored: 2 },
    },
    {
      id: '103',
      name: 'André Costa',
      number: 5,
      position: 'CB',
      age: 18,
      photo: 'https://images.unsplash.com/photo-1676026367967-464babbca573?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMG1pZGZpZWxkZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzQ1Mjk4NTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      stats: { matchesPlayed: 18, minutesPlayed: 1620, goalsScored: 3 },
    },
    {
      id: '104',
      name: 'Gabriel Lopes',
      number: 7,
      position: 'RW',
      age: 17,
      photo: 'https://images.unsplash.com/photo-1757773866965-014fa57ad096?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBzdHJpa2VyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc0NTI5ODU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      stats: { matchesPlayed: 20, minutesPlayed: 1750, goalsScored: 12 },
    },
    {
      id: '105',
      name: 'Rafael Martins',
      number: 10,
      position: 'CAM',
      age: 19,
      photo: 'https://images.unsplash.com/photo-1676026367967-464babbca573?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMG1pZGZpZWxkZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzQ1Mjk4NTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      stats: { matchesPlayed: 19, minutesPlayed: 1710, goalsScored: 10 },
    },
    {
      id: '106',
      name: 'Gonçalo Sousa',
      number: 9,
      position: 'ST',
      age: 18,
      photo: 'https://images.unsplash.com/photo-1757773866965-014fa57ad096?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBzdHJpa2VyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc0NTI5ODU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      stats: { matchesPlayed: 20, minutesPlayed: 1800, goalsScored: 15 },
    },
  ],
  U17: [
    {
      id: '201',
      name: 'João Pedro',
      number: 1,
      position: 'GK',
      age: 16,
      photo: 'https://images.unsplash.com/photo-1632300873131-1dd749c83f97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMGdvYWxrZWVwZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzQ1Mjk4NTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      stats: { matchesPlayed: 15, minutesPlayed: 1350, goalsScored: 0 },
    },
    {
      id: '202',
      name: 'Nuno Alves',
      number: 4,
      position: 'CB',
      age: 17,
      photo: 'https://images.unsplash.com/photo-1676026367967-464babbca573?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMG1pZGZpZWxkZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzQ1Mjk4NTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      stats: { matchesPlayed: 14, minutesPlayed: 1260, goalsScored: 2 },
    },
    {
      id: '203',
      name: 'Bernardo Santos',
      number: 7,
      position: 'RW',
      age: 16,
      photo: 'https://images.unsplash.com/photo-1764842262144-e58d386299ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBwbGF5ZXIlMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzQ1MjAwMTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      stats: { matchesPlayed: 15, minutesPlayed: 1200, goalsScored: 8 },
    },
    {
      id: '204',
      name: 'Francisco Lima',
      number: 9,
      position: 'ST',
      age: 17,
      photo: 'https://images.unsplash.com/photo-1757773866965-014fa57ad096?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBzdHJpa2VyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc0NTI5ODU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      stats: { matchesPlayed: 15, minutesPlayed: 1350, goalsScored: 11 },
    },
  ],
  U15: [
    {
      id: '301',
      name: 'Miguel Rodrigues',
      number: 1,
      position: 'GK',
      age: 15,
      photo: 'https://images.unsplash.com/photo-1632300873131-1dd749c83f97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMGdvYWxrZWVwZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzQ1Mjk4NTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      stats: { matchesPlayed: 12, minutesPlayed: 1080, goalsScored: 0 },
    },
    {
      id: '302',
      name: 'Tiago Pereira',
      number: 5,
      position: 'CB',
      age: 14,
      photo: 'https://images.unsplash.com/photo-1676026367967-464babbca573?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMG1pZGZpZWxkZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzQ1Mjk4NTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      stats: { matchesPlayed: 11, minutesPlayed: 990, goalsScored: 1 },
    },
    {
      id: '303',
      name: 'Afonso Dias',
      number: 10,
      position: 'CAM',
      age: 15,
      photo: 'https://images.unsplash.com/photo-1764842262144-e58d386299ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBwbGF5ZXIlMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzQ1MjAwMTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      stats: { matchesPlayed: 12, minutesPlayed: 1020, goalsScored: 7 },
    },
    {
      id: '304',
      name: 'Rodrigo Neves',
      number: 9,
      position: 'ST',
      age: 14,
      photo: 'https://images.unsplash.com/photo-1757773866965-014fa57ad096?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBzdHJpa2VyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc0NTI5ODU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      stats: { matchesPlayed: 12, minutesPlayed: 1080, goalsScored: 9 },
    },
  ],
};

// Mock Matches
export const mockMatches: Match[] = [
  {
    id: '1',
    category: 'Senior',
    homeTeam: 'FC Titans',
    awayTeam: 'United Sports',
    homeScore: 2,
    awayScore: 1,
    date: '2026-03-22',
    time: '15:45',
    status: 'live',
    venue: 'Titans Stadium',
    homeLineup: squadPlayers.Senior,
    events: [
      { id: 'e1', type: 'goal', minute: 12, player: 'Fernando Pereira', team: 'home', description: 'Assist by Carlos Rodrigues' },
      { id: 'e3', type: 'goal', minute: 34, player: 'Sergio Moreno', team: 'away', description: 'Penalty' },
      { id: 'e4', type: 'goal', minute: 67, player: 'Daniel Sousa', team: 'home', description: 'Assist by André Oliveira' },
    ],
  },
  {
    id: '2',
    category: 'Senior',
    homeTeam: 'FC Titans',
    awayTeam: 'City Warriors',
    date: '2026-03-28',
    time: '19:00',
    status: 'upcoming',
    venue: 'Titans Stadium',
    homeLineup: squadPlayers.Senior,
  },
  {
    id: '3',
    category: 'Senior',
    homeTeam: 'River FC',
    awayTeam: 'FC Titans',
    homeScore: 1,
    awayScore: 3,
    date: '2026-03-15',
    time: '17:30',
    status: 'finished',
    venue: 'River Arena',
    events: [
      { id: 'e5', type: 'goal', minute: 5, player: 'Fernando Pereira', team: 'away' },
      { id: 'e6', type: 'goal', minute: 18, player: 'River Player', team: 'home' },
      { id: 'e7', type: 'goal', minute: 56, player: 'Carlos Rodrigues', team: 'away' },
      { id: 'e8', type: 'goal', minute: 89, player: 'Daniel Sousa', team: 'away' },
    ],
  },
  {
    id: '4',
    category: 'U19',
    homeTeam: 'FC Titans U19',
    awayTeam: 'Academy Stars U19',
    homeScore: 2,
    awayScore: 2,
    date: '2026-03-21',
    time: '14:00',
    status: 'finished',
    venue: 'Training Ground',
  },
  {
    id: '5',
    category: 'U19',
    homeTeam: 'FC Titans U19',
    awayTeam: 'Youth Elite U19',
    date: '2026-03-25',
    time: '16:00',
    status: 'upcoming',
    venue: 'Training Ground',
  },
  {
    id: '6',
    category: 'U17',
    homeTeam: 'FC Titans U17',
    awayTeam: 'Junior Club U17',
    homeScore: 4,
    awayScore: 1,
    date: '2026-03-20',
    time: '11:00',
    status: 'finished',
    venue: 'Training Ground',
  },
];

// Mock Standings
export const mockStandings: Standings[] = [
  {
    category: 'Senior',
    league: 'Premier Division',
    teams: [
      { id: '1', position: 1, name: 'City Warriors', played: 28, won: 20, drawn: 5, lost: 3, goalsFor: 65, goalsAgainst: 22, goalDifference: 43, points: 65 },
      { id: '2', position: 2, name: 'FC Titans', played: 28, won: 19, drawn: 6, lost: 3, goalsFor: 58, goalsAgainst: 25, goalDifference: 33, points: 63 },
      { id: '3', position: 3, name: 'United Sports', played: 28, won: 17, drawn: 7, lost: 4, goalsFor: 52, goalsAgainst: 28, goalDifference: 24, points: 58 },
      { id: '4', position: 4, name: 'River FC', played: 28, won: 15, drawn: 8, lost: 5, goalsFor: 48, goalsAgainst: 30, goalDifference: 18, points: 53 },
      { id: '5', position: 5, name: 'Athletic Union', played: 28, won: 14, drawn: 6, lost: 8, goalsFor: 45, goalsAgainst: 35, goalDifference: 10, points: 48 },
      { id: '6', position: 6, name: 'Metro FC', played: 28, won: 12, drawn: 9, lost: 7, goalsFor: 42, goalsAgainst: 36, goalDifference: 6, points: 45 },
      { id: '7', position: 7, name: 'Coastal Club', played: 28, won: 11, drawn: 7, lost: 10, goalsFor: 38, goalsAgainst: 38, goalDifference: 0, points: 40 },
      { id: '8', position: 8, name: 'Mountain SC', played: 28, won: 10, drawn: 6, lost: 12, goalsFor: 35, goalsAgainst: 42, goalDifference: -7, points: 36 },
      { id: '9', position: 9, name: 'Valley United', played: 28, won: 8, drawn: 8, lost: 12, goalsFor: 32, goalsAgainst: 45, goalDifference: -13, points: 32 },
      { id: '10', position: 10, name: 'Harbor FC', played: 28, won: 7, drawn: 7, lost: 14, goalsFor: 28, goalsAgainst: 48, goalDifference: -20, points: 28 },
      { id: '11', position: 11, name: 'Forest Rangers', played: 28, won: 6, drawn: 6, lost: 16, goalsFor: 25, goalsAgainst: 52, goalDifference: -27, points: 24 },
      { id: '12', position: 12, name: 'Lake Town FC', played: 28, won: 4, drawn: 5, lost: 19, goalsFor: 20, goalsAgainst: 57, goalDifference: -37, points: 17 },
    ],
  },
  {
    category: 'U19',
    league: 'Youth League Division A',
    teams: [
      { id: '13', position: 1, name: 'FC Titans U19', played: 20, won: 15, drawn: 3, lost: 2, goalsFor: 48, goalsAgainst: 18, goalDifference: 30, points: 48 },
      { id: '14', position: 2, name: 'Academy Stars U19', played: 20, won: 14, drawn: 4, lost: 2, goalsFor: 45, goalsAgainst: 20, goalDifference: 25, points: 46 },
      { id: '15', position: 3, name: 'Youth Elite U19', played: 20, won: 12, drawn: 5, lost: 3, goalsFor: 40, goalsAgainst: 22, goalDifference: 18, points: 41 },
      { id: '16', position: 4, name: 'Rising Stars U19', played: 20, won: 10, drawn: 6, lost: 4, goalsFor: 35, goalsAgainst: 25, goalDifference: 10, points: 36 },
      { id: '17', position: 5, name: 'Future FC U19', played: 20, won: 8, drawn: 4, lost: 8, goalsFor: 30, goalsAgainst: 30, goalDifference: 0, points: 28 },
      { id: '18', position: 6, name: 'Junior Pro U19', played: 20, won: 5, drawn: 5, lost: 10, goalsFor: 22, goalsAgainst: 35, goalDifference: -13, points: 20 },
    ],
  },
];

// Mock News
export const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'FC Titans Secure Dramatic Victory in Derby Match',
    category: 'Team',
    excerpt: 'Daniel Sousa scores a late winner as FC Titans defeat United Sports 2-1 in a thrilling encounter.',
    content: 'In what was a tense and exciting derby match, FC Titans came out on top with a 2-1 victory over United Sports. The match saw both teams create numerous chances, but it was Daniel Sousa who emerged as the hero, scoring a stunning goal in the 67th minute to secure all three points for the Titans. Coach praised the team\'s resilience and determination throughout the match.',
    image: '',
    date: '2026-03-22',
    author: 'Sports Desk',
  },
  {
    id: '2',
    title: 'Young Talent João Silva Signs New Three-Year Deal',
    category: 'Transfers',
    excerpt: 'Promising midfielder commits his future to the club with a contract extension.',
    content: 'FC Titans are delighted to announce that young midfielder João Silva has signed a new three-year contract with the club. The 21-year-old has been impressive this season, making 25 appearances and contributing with goals and assists. "I\'m very happy to extend my stay here. This club means everything to me, and I want to help us achieve great things," said Silva.',
    image: '',
    date: '2026-03-20',
    author: 'Club Communications',
  },
  {
    id: '3',
    title: 'Fan Meet & Greet Event This Saturday',
    category: 'Events',
    excerpt: 'First team players will be meeting fans at the stadium this weekend.',
    content: 'FC Titans will be hosting a special fan meet and greet event this Saturday at Titans Stadium. First team players will be available for photos, autographs, and Q&A sessions. The event runs from 2 PM to 5 PM, and entry is free for all season ticket holders. Regular admission tickets are available for €10.',
    image: '',
    date: '2026-03-19',
    author: 'Events Team',
  },
  {
    id: '4',
    title: 'U19 Team Maintains Top Spot in Youth League',
    category: 'Team',
    excerpt: 'Young Titans continue their impressive season with another win.',
    content: 'The FC Titans U19 team continues to impress in the Youth League Division A, maintaining their position at the top of the table. With 48 points from 20 games, the young squad has shown great promise for the future. Academy Director praised the development of the players and the coaching staff\'s excellent work.',
    image: '',
    date: '2026-03-18',
    author: 'Youth Development',
  },
  {
    id: '5',
    title: 'Match Preview: FC Titans vs City Warriors',
    category: 'Team',
    excerpt: 'All you need to know ahead of the crucial top-of-the-table clash.',
    content: 'FC Titans face their biggest test of the season on Friday when they host league leaders City Warriors. Currently sitting second in the table, just two points behind their opponents, a win would see the Titans climb to the summit. Both teams have been in excellent form, making this a highly anticipated encounter. Kickoff is at 7 PM at Titans Stadium.',
    image: '',
    date: '2026-03-23',
    author: 'Match Analysis',
  },
];