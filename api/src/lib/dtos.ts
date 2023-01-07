import { PartialType } from "@nestjs/mapped-types";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsEmpty, IsNotEmpty, IsString, ValidateNested } from "class-validator";

export class CreateEmployeeDTO {
    
    @IsNotEmpty()
    @IsString()
    readonly firstName: string;

    @IsNotEmpty()
    @IsString()
    readonly lastName: string;
}

export class SectionResponseDTO {

    @IsString()
    readonly questionOne: string;

    @IsString()
    readonly questionTwo: string;

    @IsString()
    readonly questionThree: string;

    @IsString()
    readonly summary: string;
}
export class FormResponseDTO {
    readonly signatureId: string;

    @ValidateNested()
    @Type(() => SectionResponseDTO)
    readonly selectionResponses: SectionResponseDTO[];

    @IsEmpty()
    readonly date: string
}

export class UpdateEmployeeAsUserDTO {
    @ValidateNested()
    @Type(() => FormResponseDTO)
    readonly formResponses: FormResponseDTO;

    @Transform(({ value }) => !!value )
    readonly submitted: boolean;
}
