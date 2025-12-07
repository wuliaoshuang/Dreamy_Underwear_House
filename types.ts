export enum Rarity {
  COMMON = '普通可爱',
  RARE = '超级可爱',
  EPIC = '无敌可爱',
  LEGENDARY = '至臻可爱'
}

export interface GachaItem {
  id: string;
  name: string;
  rarity: Rarity;
  imageUrl: string;
  description: string;
  timestamp: number;
  // New properties
  scent: string;
  owner: string;
  magicValue: number;
}

export const RarityColors = {
  [Rarity.COMMON]: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    border: 'border-blue-300',
    shadow: 'shadow-blue-200'
  },
  [Rarity.RARE]: {
    bg: 'bg-pink-100',
    text: 'text-pink-600',
    border: 'border-pink-300',
    shadow: 'shadow-pink-200'
  },
  [Rarity.EPIC]: {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
    border: 'border-purple-300',
    shadow: 'shadow-purple-200'
  },
  [Rarity.LEGENDARY]: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-600',
    border: 'border-yellow-300',
    shadow: 'shadow-yellow-200'
  }
};

// Cost to pull one card
export const GACHA_COST = 100;

// Value when selling/releasing a card
export const RECYCLE_VALUES = {
  [Rarity.COMMON]: 20,
  [Rarity.RARE]: 50,
  [Rarity.EPIC]: 150,
  [Rarity.LEGENDARY]: 500
};