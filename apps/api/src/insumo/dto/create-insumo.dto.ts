import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsNotEmpty, IsOptional, IsDateString, Min, IsEnum, IsBoolean } from 'class-validator';
import { TipoValues } from "./tipo";
import type { Tipo } from "./tipo";

export class CreateInsumoDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsEnum(TipoValues)
    tipo: Tipo = '--------';

    @ApiProperty()
    @IsNumber()
    @Min(1)
    cantidad: number;

    @ApiProperty()
    @IsDateString()
    @IsNotEmpty()
    fecha_ingreso: string;

    @ApiProperty()
    @IsDateString()
    @IsOptional()
    fecha_vencimiento?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    responsable_uso: string;

    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    perecible: boolean;
}

