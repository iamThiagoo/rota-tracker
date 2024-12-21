package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/iamThiagoo/rota-tracker/internal"
	"github.com/segmentio/kafka-go"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	mongoStr := "mongodb://admin:admin@mongo:27017/routes?authSource=admin"
	mongoConnection, err := mongo.Connect(context.Background(), options.Client().ApplyURI(mongoStr))
	if err != nil {
		panic(err)
	}

	freightService := internal.NewFreightService()
	routeService := internal.NewRouteService(mongoConnection, freightService)
	chDriverMoved := make(chan *internal.DriverMovedEvent)
	freightWriter := &kafka.Writer{
		Addr:     kafka.TCP("kafka:9092"),
		Topic:    "freight",
		Balancer: &kafka.LeastBytes{},
	}
	simulatorWriter := &kafka.Writer{
		Addr:     kafka.TCP("kafka:9092"),
		Topic:    "simulator",
		Balancer: &kafka.LeastBytes{},
	}
	routeReader := kafka.NewReader(kafka.ReaderConfig{
		Brokers: []string{"kafka:9092"},
		Topic:   "route",
		GroupID: "simulator",
	})

	hub := internal.NewEventHub(routeService, mongoConnection, chDriverMoved, freightWriter, simulatorWriter)

	fmt.Println("Simulator is running...")

	for {
		m, err := routeReader.ReadMessage(context.Background())
		if err != nil {
			log.Printf("error: read message: %v", err)
			continue
		}

		go func(msg []byte) {
			err = hub.HandleEvent(m.Value)
			if err != nil {
				log.Printf("error: handle event: %v", err)
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
