import { PartialType } from '@nestjs/swagger';
import { CreateTatuadorDto } from './create-tatuador.dto';

export class UpdateTatuadorDto extends PartialType(CreateTatuadorDto) {}
