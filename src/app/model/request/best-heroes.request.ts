export interface BestHeroesRequest {
    days?: number;
    minMatches?: number;
    position?: string;
    leagueId?: number;
    page: number;
    limit: number;
}