import { Test, TestingModule } from '@nestjs/testing';
import { RoutesDriverGateway } from './routes-driver.gateway';

describe('RoutesDriverGateway', () => {
  let gateway: RoutesDriverGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoutesDriverGateway],
    }).compile();

    gateway = module.get<RoutesDriverGateway>(RoutesDriverGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
