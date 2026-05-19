import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsDateString, IsBoolean, IsEnum, MaxLength, IsInt, Min, IsArray, ValidateNested } from "class-validator";
import { AreaCorporalValue } from "./area-corporal";
import type { AreaCorporal } from "./area-corporal";
import { Type } from "class-transformer";

class InsumoUtilizadoDto {
    @ApiProperty({ example: 'INS-001', description: 'ID del insumo utilizado' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    id_insumo: string;

    @ApiProperty({ example: 3, description: 'Cantidad utilizada de este insumo' })
    @IsInt()
    @Min(1)
    @IsNotEmpty()
    cantidad_utilizada: number;
}

export class CreateProcedimientoDto {
    @ApiProperty()
    @IsEnum(AreaCorporalValue)
    @IsNotEmpty()
    area_corporal: AreaCorporal = '--------';

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @ApiProperty()
    @IsDateString()
    @IsNotEmpty()
    fecha_ejecucion: string;

    @ApiProperty()
    @IsDateString()
    @IsNotEmpty()
    fecha_creacion: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    usuario_creador: string;

    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    completado: boolean;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id_cita: string;

    @ApiProperty({
        type: [InsumoUtilizadoDto],
        description: 'Lista de insumos y cantidades consumidas en este procedimiento'
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => InsumoUtilizadoDto)
    insumos_utilizados: InsumoUtilizadoDto[];
}
