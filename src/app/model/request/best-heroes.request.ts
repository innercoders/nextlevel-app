export interface BestHeroesRequest {
    days?: number;
    minMatches?: number;
    position?: string;
    page: number;
    limit: number;
}