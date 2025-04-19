export interface BestHeroItemsResponse {
    totalMatches: number;
    items: Item[];
}

export interface Item {
    itemId: number;
    count: number;
}