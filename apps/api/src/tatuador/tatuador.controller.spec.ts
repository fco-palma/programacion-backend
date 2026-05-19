import { Test, TestingModule } from '@nestjs/testing';
import { TatuadorController } from './tatuador.controller';
import { TatuadorService } from './tatuador.service';

describe('TatuadorController', () => {
  let controller: TatuadorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TatuadorController],
      providers: [TatuadorService],
    }).compile();

    controller = module.get<TatuadorController>(TatuadorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
