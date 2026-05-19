import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEnum, IsEmail } from "class-validator";
import { EspecialidadValues } from "./especialidad";
import { DisponibilidadValues } from "./disponibilidad";
import type { Especialidad } from "./especialidad";
import type { Disponibilidad } from "./disponibilidad";

export class CreateTatuadorDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    telefono: string;

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    nombre_artistico: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsEnum(EspecialidadValues)
    especialidad: Especialidad = '--------';

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    portafolio_web: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsEnum(DisponibilidadValues)
    disponibilidad: Disponibilidad = '--------';
}
