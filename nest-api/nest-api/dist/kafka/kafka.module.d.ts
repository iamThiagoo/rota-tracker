import { OnModuleInit } from '@nestjs/common';
import * as kafkaLib from '@confluentinc/kafka-javascript';
export declare class KafkaModule implements OnModuleInit {
    private kafkaProducer;
    constructor(kafkaProducer: kafkaLib.KafkaJS.Producer);
    onModuleInit(): Promise<void>;
}
