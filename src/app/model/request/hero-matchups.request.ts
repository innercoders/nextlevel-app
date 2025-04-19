export interface HeroMatchupsRequest {
    heroId: string;
    days?: number;
    minMatches?: number;
    position?: string | null;
}