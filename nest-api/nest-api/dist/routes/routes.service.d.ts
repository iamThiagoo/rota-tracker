import { CreateRouteDto } from './dto/create-route.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { DirectionsService } from 'src/maps/directions/directions.service';
export declare class RoutesService {
    private prismaService;
    private directionsService;
    constructor(prismaService: PrismaService, directionsService: DirectionsService);
    create(createRouteDto: CreateRouteDto): Promise<{
        name: string;
        directions: import("@prisma/client/runtime/library").JsonValue;
        id: string;
        distance: number;
        duration: number;
        created_at: Date;
        updated_at: Date;
        source: {
            name: string;
        } & {
            location: {
                lat: number;
                lng: number;
            };
        };
        destination: {
            name: string;
        } & {
            location: {
                lat: number;
                lng: number;
            };
        };
    }>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        name: string;
        directions: import("@prisma/client/runtime/library").JsonValue;
        id: string;
        distance: number;
        duration: number;
        created_at: Date;
        updated_at: Date;
        source: {
            name: string;
        } & {
            location: {
                lat: number;
                lng: number;
            };
        };
        destination: {
            name: string;
        } & {
            location: {
                lat: number;
                lng: number;
            };
        };
    }[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__RouteClient<{
        name: string;
        directions: import("@prisma/client/runtime/library").JsonValue;
        id: string;
        distance: number;
        duration: number;
        created_at: Date;
        updated_at: Date;
        source: {
            name: string;
        } & {
            location: {
                lat: number;
                lng: number;
            };
        };
        destination: {
            name: string;
        } & {
            location: {
                lat: number;
                lng: number;
            };
        };
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
