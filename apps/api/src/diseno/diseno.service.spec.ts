import { Test, TestingModule } from '@nestjs/testing';
import { DisenoService } from './diseno.service';

describe('DisenoService', () => {
  let service: DisenoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DisenoService],
    }).compile();

    service = module.get<DisenoService>(DisenoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
