import { Test, TestingModule } from '@nestjs/testing';
import { TatuadorService } from './tatuador.service';

describe('TatuadorService', () => {
  let service: TatuadorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TatuadorService],
    }).compile();

    service = module.get<TatuadorService>(TatuadorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
