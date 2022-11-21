import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, Max } from "class-validator";

export class CreateEmployeeDTO {
    
    @IsNotEmpty()
    @Max(20)
    firstName: string;

    @IsNotEmpty()
    @Max(20)
    lastName: string;

    @IsNotEmpty()
    @Max(20)
    position: string;
}

export class UpdateEmployeeAsAdminDTO extends PartialType(CreateEmployeeDTO) {
    @IsNotEmpty()
    @Max(20)
    userId: string;
}

export class UpdateEmployeeAsUserDTO {
    @IsNotEmpty()
    formResponse: FormResponseDTO;

    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    secretKey: string;
}

export class SectionResponseDTO {
    questionOne: string;
    questionTwo: string;
    questionThree: string;
    summary: string;
}

export class FormResponseDTO {
    date: string;
    signatureid: string;
    selectionResponses: SectionResponseDTO[];
}