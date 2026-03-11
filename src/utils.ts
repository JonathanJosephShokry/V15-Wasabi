import { WasabiData, Member, Character, SportEvent, CraftingSet, PackSale } from './types';

export function calculateLevel(exp: number): number {
  if (exp === 0) return 1;
  let level = 1, req = 0;
  while (req <= exp) {
    level++;
    req = Math.pow(2, level - 2);
  }
  return level - 1;
}

export function calculateExpProgress(exp: number): number {
  const lvl = calculateLevel(exp);
  const cur = lvl === 1 ? 0 : Math.pow(2, lvl - 2);
  const nxt = Math.pow(2, lvl - 1);
  return ((exp - cur) / (nxt - cur)) * 100;
}

export function calcHiddenScore(characterId: string, degree: string, data: WasabiData): number {
  const char = data.characters.find(c => c.id === characterId);
  if (!char) return 0;

  // Find the pack that contains this character to get its score
  const pack = data.packs.find(p => p.packageId === char.packageId);
  const packScore = pack?.score ?? 5; // Fallback to 5 if not found

  const rarityScore = data.cardConfig.rarityScores[char.rarity] || 0;
  const degKey = degree || 'iron';
  const mult = data.cardConfig.degrees[degKey]?.multiplier || 1;

  return packScore * rarityScore * mult;
}

export function getMemberTotalScore(member: Member, data: WasabiData): number {
  if (!member.collection || member.collection.length === 0) return 0;
  return member.collection.reduce((sum, entry) => {
    return sum + calcHiddenScore(entry.characterId, entry.degree || 'iron', data) * (entry.count || 1);
  }, 0);
}

export function getGlobalRank(memberId: string, data: WasabiData): number {
  const ranked = [...data.members].map(m => ({
    id: m.id,
    score: getMemberTotalScore(m, data)
  })).sort((a, b) => b.score - a.score);
  
  return ranked.findIndex(m => m.id === memberId) + 1;
}

export function getActiveSportEvent(data: WasabiData, date: Date): SportEvent | undefined {
  return data.sportEvents.find(event => {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    return date >= start && date <= end && event.visible;
  });
}

export function getLastFinishedSportEvent(data: WasabiData, date: Date): SportEvent | undefined {
  const finished = data.sportEvents
    .filter(event => new Date(event.endDate) < date && event.visible)
    .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
  
  return finished[0];
}

export function getActiveCraftingSet(data: WasabiData, now: Date): CraftingSet | undefined {
  return data.crafting_sets.find(set => {
    const start = new Date(set.start_date);
    const end = new Date(set.end_date);
    return now >= start && now <= end;
  });
}

export function getActivePackSale(data: WasabiData, now: Date): PackSale | undefined {
  return data.pack_sales.find(sale => {
    const start = new Date(sale.start_date);
    const end = new Date(sale.end_date);
    return now >= start && now <= end;
  });
}

export function getTimeRemaining(endDate: string, now: Date): string {
  const end = new Date(endDate);
  const diffMs = end.getTime() - now.getTime();
  if (diffMs <= 0) return "Expired";

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const parts = [];
  if (days > 0) parts.push(`${days} Day${days > 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} Hour${hours > 1 ? 's' : ''}`);
  if (days === 0 && minutes > 0) parts.push(`${minutes} Minute${minutes > 1 ? 's' : ''}`);

  return parts.length > 0 ? parts.join(' ') : "Less than a minute";
}

export function getProjectAge(startDate: string): string {
  const start = new Date(startDate.split('-').reverse().join('-'));
  const now = new Date("2026-03-11T08:34:22-07:00");
  const diffMs = now.getTime() - start.getTime();
  
  if (diffMs < 0) return "Just Born";
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 24) return `${hours}h`;
  
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w`;
  
  const months = Math.floor(days / 30.44);
  if (months < 12) return `${months}mo`;
  
  const years = Math.floor(days / 365.25);
  return `${years}y`;
}

export function getProjectTheme(startDate: string): { theme: string, visual: string } {
  const start = new Date(startDate.split('-').reverse().join('-'));
  const now = new Date("2026-03-11T08:34:22-07:00");
  const diffMs = now.getTime() - start.getTime();
  const days = diffMs / (1000 * 60 * 60 * 24);

  if (days < 1) return { theme: "Just Born", visual: "🐛" };
  if (days < 7) return { theme: "New", visual: "🦎" };
  if (days < 30) return { theme: "Surviving", visual: "🐊" };
  if (days < 365) return { theme: "Old", visual: "🦖" };
  return { theme: "Ancient", visual: "🐉" };
}

export function formatRarity(rarity: string): string {
  if (rarity === 'epic') return 'Epic';
  return rarity.charAt(0).toUpperCase() + rarity.slice(1);
}

export function formatDegree(degree: string): string {
  return degree.charAt(0).toUpperCase() + degree.slice(1);
}

export function calculateDaysRemaining(endDate: string, now: Date): number {
  const end = new Date(endDate);
  const diffMs = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export function getActiveCraftingRecipes(data: WasabiData, now: Date) {
  const activeSet = getActiveCraftingSet(data, now);
  return activeSet ? activeSet.crafts : [];
}
