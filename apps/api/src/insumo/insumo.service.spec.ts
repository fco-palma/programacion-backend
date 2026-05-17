import { Test, TestingModule } from '@nestjs/testing';
import { InsumoService } from './insumo.service';

describe('InsumoService', () => {
  let service: InsumoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InsumoService],
    }).compile();

    service = module.get<InsumoService>(InsumoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
