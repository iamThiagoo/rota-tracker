import { PrismaService } from 'src/prisma/prisma.service';
export declare class RoutesDriverService {
    private prismaService;
    constructor(prismaService: PrismaService);
    processRoute(dto: {
        route_id: string;
        lat: number;
        lng: number;
    }): import(".prisma/client").Prisma.Prisma__RouteDriverClient<{
        route: {
            name: string;
            directions: import("@prisma/client/runtime/library").JsonValue;
            id: string;
            distance: number;
            duration: number;
            freight: number | null;
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
        };
    } & {
        id: string;
        created_at: Date;
        updated_at: Date;
        route_id: string;
        points: ({
            created_at: Date;
        } & {
            location: {
                lat: number;
                lng: number;
            };
        })[];
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
