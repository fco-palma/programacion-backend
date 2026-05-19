import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsDecimal, IsDateString, IsNotEmpty, IsEnum, MaxLength } from "class-validator";
import { MetodoPagoValues } from "./metodo_pago";
import { EstadoValue } from "./estado";
import type { MetodoPago } from "./metodo_pago";
import type { Estado } from "./estado";

export class CreatePagoDto {
    @ApiProperty({ example: 45000.00, description: 'Monto del pago realizado' })
    @IsDecimal()
    @IsNotEmpty()
    monto: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(MetodoPagoValues)
    metodo_pago: MetodoPago = '--------';

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(EstadoValue)
    estado: Estado = '--------';

    @ApiProperty({ example: '2026-05-18', description: 'Fecha en la que se efectuó el pago' })
    @IsDateString()
    @IsNotEmpty()
    fecha: string;

    @ApiProperty({ example: 'CITA-2026-001', description: 'ID de la cita asociada a este pago' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    id_cita: string; // TIENE QUE SER EL MISMO ID QUE EN EL MODEL
}
