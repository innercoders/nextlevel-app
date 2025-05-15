import { Component, OnInit, OnDestroy } from '@angular/core';
import { RabbitMQService } from 'app/service/rabbitmq.service';
import { UserService } from 'app/service/user.service';
import { QueueStatsResponse } from 'app/model/response/queue-stats.response';
import { DotaMatchService } from 'app/service/dota-match.service';

@Component({
	selector: 'app-dashboard',
	standalone: false,
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.less'
})
export class DashboardComponent implements OnInit, OnDestroy {

	queueStats: QueueStatsResponse | null = null;
	dotaMatchStats: any | null = null;
	daysAgo: number = 0;

	queueStatsInterval: any;

	constructor(
		private rabbitMQService: RabbitMQService,
		private dotaMatchService: DotaMatchService,
		private userService: UserService
	) {
		this.daysAgo = this.dotaMatchService.DEFAULT_DAYS_AGO;
	}

	ngOnInit() {
		this.getQueueStats();
		this.getDotaMatchStats();

		this.queueStatsInterval = setInterval(() => {
			this.getQueueStats();
		}, 30000);
	}

	getQueueStats() {
		this.rabbitMQService.getQueueStats().subscribe({
			next: (stats) => {
				this.queueStats = stats;
			},
			error: (error) => {
				console.error('Error getting queue stats:', error);
			}
		});
	}

	getDotaMatchStats() {
		this.dotaMatchService.getStats().subscribe({
			next: (stats) => {
				this.dotaMatchStats = stats;
			}
		});
	}

	ngOnDestroy() {
		clearInterval(this.queueStatsInterval);
	}
}
