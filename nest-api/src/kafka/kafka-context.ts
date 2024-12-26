import * as kafkaLib from '@confluentinc/kafka-javascript';

export class KafkaContext {
  constructor(
    readonly message: kafkaLib.KafkaJS.Message,
    readonly messageValue: any,
    readonly topic: string,
    readonly partition: number,
    readonly consumer: kafkaLib.KafkaJS.Consumer,
  ) {}
}