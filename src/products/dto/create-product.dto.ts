import { Type } from "class-transformer"
import { IsNotEmpty, IsNumber,  IsString, Min } from "class-validator"

export class CreateProductDto {

    @IsString()
    @IsNotEmpty({message:"El nombre es requerido"})
    public name: string

    @IsNumber()
    @IsNotEmpty({message:"El precio es requerido"})
    @Min(0,{message:"El precio debe ser un numero positivo"})
    @Type(()=>Number)
    public price: number

}
