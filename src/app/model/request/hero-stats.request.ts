export interface HeroStatsRequest {
    leagueId?: number,
    heroName?: string,
    position?: string,
    period?: string | number,
    page?: number,
    limit?: number
}