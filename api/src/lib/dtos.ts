import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsEmpty, isNotEmpty, IsNotEmpty, Max, ValidateNested } from "class-validator";

export class CreateEmployeeDTO {
    
    @IsNotEmpty()
    readonly firstName: string;

    @IsNotEmpty()
    readonly lastName: string;
}

export class UpdateEmployeeAsAdminDTO extends PartialType(CreateEmployeeDTO) {
    @IsNotEmpty()
    readonly userId: number;
}

export class UpdateEmployeeAsUserDTO {
    @IsNotEmpty()
    // @ValidateNested()
    // @Type(() => FormResponseDTO)
    readonly formResponse: string;

    @IsNotEmpty()
    readonly userId: number;

    @IsNotEmpty()
    readonly secretKey: string;

    readonly submitted: boolean;
}

export class SectionResponseDTO {
    readonly questionOne: string;
    readonly questionTwo: string;
    readonly questionThree: string;
    readonly summary: string;
}

// export class FormResponseDTO {
//     readonly signatureid: string;

//     @ValidateNested()
//     @Type(() => SectionResponseDTO)
//     readonly selectionResponses: SectionResponseDTO[];

//     readonly date: string
// }