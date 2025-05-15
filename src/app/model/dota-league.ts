export interface DotaLeague {
    id: string;
    name: string | null;
    displayName: string | null;
    tier: string | null;
    region: string | null;
    leagueId: number;
    imageUrl?: string | null;
    lastMatchAt?: string | null;
    lastMatchParsedAt?: string | null;
}