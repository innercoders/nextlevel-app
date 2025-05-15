import { Injectable } from "@angular/core";
import { NlService } from "./nl.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { QueueStatsResponse } from "../model/response/queue-stats.response";

@Injectable({
	providedIn: 'root'
})
export class RabbitMQService extends NlService {


    private readonly DOTA_MATCH_PROCESSING_QUEUE = 'dota.match.processing'; // main queue
    private readonly DOTA_MATCH_WAITING_QUEUE = 'dota.match.waiting'; // waiting queue
    private readonly DEAD_LETTER_QUEUE = 'dota.match.dlq'; // dead letter queue

	constructor(private http: HttpClient) {
		super();
	}

    getQueueStats(): Observable<QueueStatsResponse> {
        return this.http.get<QueueStatsResponse>(`${this.baseAPI}/api/v1/rabbitmq/queue-stats`);
    }

    purgeProcessingQueue() {
        return this.http.post(`${this.baseAPI}/api/v1/rabbitmq/purge-processing-queue`, {});
    }

    purgeDlq() {
        return this.http.post(`${this.baseAPI}/api/v1/rabbitmq/purge-dlq`, {});
    }

    getDetailedStats() {
        return this.http.get(`${this.baseAPI}/api/v1/rabbitmq/detailed-stats`);
    }

    peekMessages(queueName: string, count: number = 10) {
        return this.http.get(`${this.baseAPI}/api/v1/rabbitmq/peek/${queueName}?count=${count}`);
    }
}