import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateClienteDto {
    @ApiProperty()
    @MaxLength(10)
    @IsNotEmpty()
    rut_cliente: string;

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
    @IsDate()
    @IsNotEmpty()
    fecha_nacimiento: string;
}
