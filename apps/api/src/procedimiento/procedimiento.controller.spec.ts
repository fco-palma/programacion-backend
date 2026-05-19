import { Test, TestingModule } from '@nestjs/testing';
import { ProcedimientoController } from './procedimiento.controller';
import { ProcedimientoService } from './procedimiento.service';

describe('ProcedimientoController', () => {
  let controller: ProcedimientoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProcedimientoController],
      providers: [ProcedimientoService],
    }).compile();

    controller = module.get<ProcedimientoController>(ProcedimientoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
