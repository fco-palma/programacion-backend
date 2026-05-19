import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsDateString, MaxLength, IsEnum } from "class-validator";
import { EstadoValue } from "./estado";
import type { Estado } from "./estado";


export class CreateCitaDto {
    @ApiProperty({ example: '2026-06-20', description: 'Fecha programada para la cita' })
    @IsDateString()
    @IsNotEmpty()
    fecha: string;

    @ApiProperty({ example: '14:30:00', description: 'Hora programada para la cita (formato HH:MM:SS)' })
    @IsString() // Las horas en formato TIME de bases de datos relacionales viajan como texto en el JSON
    @IsNotEmpty()
    hora: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsEnum(EstadoValue)
    estado: Estado = '--------';

    @ApiProperty({ example: '2026-05-18', description: 'Fecha de registro en el sistema' })
    @IsDateString()
    @IsNotEmpty()
    fecha_creacion: string;

    @ApiProperty({ example: 'admin_user', description: 'Usuario del sistema que registró la cita' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    usuario_creador: string;

    @ApiProperty({ example: '12345678-9', description: 'RUT del cliente asociado' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(12)
    rut_cliente: string;

    @ApiProperty({ example: 'TAT-99', description: 'ID del tatuador asignado' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    id_tatuador: string;

    @ApiProperty({ example: 'DIS-452', description: 'ID del diseño que se va a tatuar' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    id_diseno: string;
}
