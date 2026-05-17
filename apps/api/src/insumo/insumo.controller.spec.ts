import { Test, TestingModule } from '@nestjs/testing';
import { InsumoController } from './insumo.controller';
import { InsumoService } from './insumo.service';

describe('InsumoController', () => {
  let controller: InsumoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InsumoController],
      providers: [InsumoService],
    }).compile();

    controller = module.get<InsumoController>(InsumoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
