export interface Character {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'never';
  packageId: string;
  images: Record<string, string>;
}

export interface CardDegree {
  multiplier: number;
  color: string;
  glow: string;
  border: string;
}

export interface CardConfig {
  rarityScores: Record<string, number>;
  rarityOrder: string[];
  degrees: Record<string, CardDegree>;
  degreeOrder: string[];
  combineRecipe: number;
}

export interface CollectionEntry {
  characterId: string;
  degree?: string;
  count?: number;
}

export interface Member {
  id: string;
  name: string;
  icon: string;
  wabi: number;
  spice: number;
  exp: number;
  teamId: string;
  role: 'leader' | 'normal';
  collection: CollectionEntry[];
  skills: Record<string, number>;
  restricted?: boolean;
  restrictedUntil?: string | null;
  sportEventScore?: number;
  statistics?: { label: string; value: number }[];
}

export interface HistoryEntry {
  id: string;
  type: 'trade' | 'craft' | 'purchase';
  date: string;
  description: string;
  details?: {
    fromMemberId?: string;
    toMemberId?: string;
    cardId?: string;
    spiceAmount?: number;
    packId?: string;
  };
}

export interface Team {
  id: string;
  name: string;
  history?: HistoryEntry[];
}

export interface EventOutcome {
  characterId: string;
  chance: string;
}

export interface CardPack {
  packageId: string;
  name: string;
  banner: string;
  score: number;
  cost: { wabi: number; spice: number };
  outcomes: EventOutcome[];
}

export interface Training {
  name: string;
  description: string;
  spice_price: number;
  wabi_price?: number;
  pdf_link?: string;
  providedBy?: string;
}

export interface SpiceDeal {
  spice: number;
  egp: number;
  highlight: boolean;
}

export interface ProjectLeaderboardEntry {
  name: string;
  days: number;
}

export interface Project {
  id: string;
  teamId: string;
  name: string;
  members: string[];
  description: string;
  minimumWork: string;
  baseSalary: number;
  startDate: string;
  active: boolean;
  projectManagerId?: string;
  maxMembers: number;
  rules?: string[];
  bonusSystem: { work: string; salary: number }[];
  waitingList?: string[];
  lastCycleLeaderboard?: ProjectLeaderboardEntry[];
}

export interface TeamShopItem {
  id: string;
  teamId: string;
  name: string;
  image: string;
  wabiCost: number;
  description: string;
}

export interface Match {
  id: string;
  team1: string;
  team2: string;
  active: boolean;
  date?: string;
}

export interface SportEvent {
  id: string;
  name: string;
  description: string;
  type: 'distance' | 'points';
  startDate: string;
  endDate: string;
  visible: boolean;
  upcomingMatches?: Match[];
  prizes?: Record<string, { characterId: string; degree?: string }>;
  winners?: { place: number; memberId: string; score: number }[];
}

export interface CraftingRecipe {
  id: string;
  recipe: {
    inputs: { card_id: string; degree: string }[];
    output: { card_id: string; degree: string };
  };
}

export interface CraftingSet {
  id: string;
  start_date: string;
  end_date: string;
  crafts: CraftingRecipe[];
}

export interface PackSale {
  id: string;
  start_date: string;
  end_date: string;
  packs: string[];
}

export interface WasabiData {
  version: string;
  cardConfig: CardConfig;
  characters: Character[];
  members: Member[];
  teams: Team[];
  packs: CardPack[];
  trainings: Training[];
  spiceDeals: SpiceDeal[];
  projects: Project[];
  tss: TeamShopItem[];
  sportEvents: SportEvent[];
  crafting_sets: CraftingSet[];
  pack_sales: PackSale[];
}
