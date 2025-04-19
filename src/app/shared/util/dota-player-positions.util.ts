export class DotaPlayerPositions {
    public static all = { label: 'Todas', value: null };
    public static carry = { label: 'Carry', value: 'POSITION_1' };
    public static mid = { label: 'Mid', value: 'POSITION_2' };
    public static off = { label: 'Off', value: 'POSITION_3' };
    public static support4 = { label: 'Suporte 4', value: 'POSITION_4' };
    public static support5 = { label: 'Suporte 5', value: 'POSITION_5' };

    public static positions = [
        this.all,
        this.carry,
        this.mid,
        this.off,
        this.support4,
        this.support5
    ];

    public static getPositionImage(position: string) {
        switch (position) {
            case 'POSITION_1':
                return '/assets/images/roles/carry.png';
            case 'POSITION_2':
                return '/assets/images/roles/mid.png';
            case 'POSITION_3':
                return '/assets/images/roles/off.png';
            case 'POSITION_4':
                return '/assets/images/roles/support4.png';
            case 'POSITION_5':
                return '/assets/images/roles/support5.png';
            default:
                return '';
        }
    }

    public static getPositionLabel(position: string) {
        switch (position) {
            case 'POSITION_1':
                return 'Carry';
            case 'POSITION_2':
                return 'Mid';
            case 'POSITION_3':
                return 'Off';
            case 'POSITION_4':
                return 'Suporte 4';
            case 'POSITION_5':
                return 'Suporte 5';
            default:
                return '';
        }
    }
}
