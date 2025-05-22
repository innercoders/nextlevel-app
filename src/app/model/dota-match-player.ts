import { DotaHero, DotaHeroSummary } from "./dota-hero";
import { DotaHeroAbilities } from "./dota-hero-abilities";
import { DotaItem } from "./dota-item";

export interface DotaMatchPlayer {
    id: string;
    playerSlot: number;
    accountId: number;
    isRadiant: boolean;
    isVictory: boolean;
    heroId: number;
    kills: number;
    deaths: number;
    assists: number;
    numLastHits: number;
    numDenies: number;
    netWorth: number;
    goldPerMinute: number;
    experiencePerMinute: number;
    level: number;
    heroDamage: number;
    heroHealing: number;
    towerDamage: number;
    lane: string;
    position: string;
    role: string;
    imp: number;
    item0Id: number;
    item1Id: number;
    item2Id: number;
    item3Id: number;
    item4Id: number;
    item5Id: number;
    backpack0Id: number;
    backpack1Id: number;
    backpack2Id: number;
    neutral0Id: number;
    intentionalFeeding: number;
    facetId: number;
    abilities: string[];
    goldPerMinuteByMinute: number[];
    lastHitByMinute: number[];
    deniesByMinute: number[];
    actionsByMinute: number[];
    impByMinute: number[];
    networthByMinute: number[];
    campStack: number[];
    playerItemPurchases: any[];

    dotaHero?: DotaHero | DotaHeroSummary;
    selectedFacet?: any;

    items?: DotaItem[];
    purchasedItems?: { time: number, formatedTime: string,item: DotaItem }[];
    dotaHeroAbilities?: any[];
}
