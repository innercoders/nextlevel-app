export interface QueueStatsResponse {
    success: boolean;
    data: {
        waitingQueueSize: number;
        processingQueueSize: number;
        deadLetterQueueSize: number;
    };
}