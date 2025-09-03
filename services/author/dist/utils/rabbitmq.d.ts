export declare const connectRabbitMQ: () => Promise<void>;
export declare const publishToQueue: (queueName: string, message: any) => Promise<void>;
export declare const invalidateCacheJob: (cacheKeys: string[]) => Promise<void>;
//# sourceMappingURL=rabbitmq.d.ts.map