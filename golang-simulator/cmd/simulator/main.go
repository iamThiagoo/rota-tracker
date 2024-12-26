package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/iamThiagoo/rota-tracker/internal"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/segmentio/kafka-go"
)

func main() {
	mongoURI := getEnv("MONGO_URI", "mongodb://root:root@mongo:27017/routes?authSource=admin")
	kafkaBroker := getEnv("KAFKA_BROKER", "kafka:9092")
	kafkaRouteTopic := getEnv("KAFKA_ROUTE_TOPIC", "route")
	kafkaFreightTopic := getEnv("KAFKA_FREIGHT_TOPIC", "freight")
	kafkaSimulationTopic := getEnv("KAFKA_SIMULATION_TOPIC", "simulation")
	kafkaGroupID := getEnv("KAFKA_GROUP_ID", "route-group")

	mongoConnection, err := mongo.Connect(context.Background(), options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}

	freightService := internal.NewFreightService()
	routeService := internal.NewRouteService(mongoConnection, freightService)

	chDriverMoved := make(chan *internal.DriverMovedEvent)
	chFreightCalculated := make(chan *internal.FreightCalculatedEvent)

	freightWriter := &kafka.Writer{
		Addr:     kafka.TCP(kafkaBroker),
		Topic:    kafkaFreightTopic,
		Balancer: &kafka.LeastBytes{},
	}
	simulationWriter := &kafka.Writer{
		Addr:     kafka.TCP(kafkaBroker),
		Topic:    kafkaSimulationTopic,
		Balancer: &kafka.LeastBytes{},
	}

	hub := internal.NewEventHub(
		routeService,
		mongoConnection,
		chDriverMoved,
		chFreightCalculated,
		freightWriter,
		simulationWriter,
	)

	routeReader := kafka.NewReader(kafka.ReaderConfig{
		Brokers: []string{kafkaBroker},
		Topic:   kafkaRouteTopic,
		GroupID: kafkaGroupID,
	})

	fmt.Println("Consuming events from 'route' topic...")

	for {
		m, err := routeReader.ReadMessage(context.Background())
		if err != nil {
			log.Printf("Error reading message: %v\n", err)
			continue
		}

		go func(msg []byte) {
			if err := hub.HandleEvent(msg); err != nil {
				log.Printf("Error handling event: %v\n", err)
			}
		}(m.Value)
	}
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
