import { Test, TestingModule } from '@nestjs/testing';
import { DisenoController } from './diseno.controller';
import { DisenoService } from './diseno.service';

describe('DisenoController', () => {
  let controller: DisenoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DisenoController],
      providers: [DisenoService],
    }).compile();

    controller = module.get<DisenoController>(DisenoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
