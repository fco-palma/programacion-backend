import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsDateString, IsOptional, IsBoolean } from "class-validator";

export class CreateDisenoDto {
    @ApiProperty({ example: 'https://mi-bucket.s3.amazonaws.com/bocetos/dragon.jpg o Boceto de Plantita' })
    @IsString()
    @IsNotEmpty()
    boceto: string;

    @ApiProperty({ example: 'Diseño de dragón japonés oriental para la espalda completa' })
    @IsString()
    @IsNotEmpty()
    comentarios: string;

    @ApiProperty({ example: 'Mauricio Tatuajes' })
    @IsString()
    @IsNotEmpty()
    autor: string;

    @ApiProperty({ example: 'Derechos exclusivos compartidos con el cliente' })
    @IsString()
    @IsNotEmpty()
    derechos_uso: string;

    @ApiProperty({ example: '2026-05-18' })
    @IsDateString()
    @IsNotEmpty()
    fecha_creacion: string;

    @ApiProperty({ example: true })
    @IsBoolean()
    @IsNotEmpty()
    disponible: boolean;

}
