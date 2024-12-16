import { RoutesService } from '../routes.service';
export declare class RoutesDriverGateway {
    private routesService;
    constructor(routesService: RoutesService);
    handleMessage(client: any, payload: any): Promise<void>;
}
