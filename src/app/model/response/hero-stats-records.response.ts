export interface HeroStatsRecordsResponse {
    timeFrame: {
        days: number;
        startDate: string;
        position: string;
    };
    records: {
        winRate: {
            heroId: number;
            position: string;
            value: number;
            matches: number;
        }
        kills: {
            heroId: number;
            position: string;
            value: number;
            matches: number;
        }   
        assists: {
            heroId: number;
            position: string;
            value: number;
            matches: number;
        }   
        deaths: {
            heroId: number;
            position: string;
            value: number;
            matches: number;
        }
        gpm: {
            heroId: number;
            position: string;
            value: number;
            matches: number;
        }
        xpm: {
            heroId: number;
            position: string;
            value: number;
            matches: number;
        }
        heroDamage: {
            heroId: number;
            position: string;
            value: number;
            matches: number;
        }
        heroHealing: {
            heroId: number;
            position: string;
            value: number;
            matches: number;
        }
        towerDamage: {
            heroId: number;
            position: string;
            value: number;
            matches: number;
        }
    }
}