export interface BestHeroItemsRequest {
    heroId: string;
    days?: number;
    minMatches?: number;
    position?: string | null;
}
