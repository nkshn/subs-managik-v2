import {
	IsOptional,
	IsString,
	IsUrl,
	MinLength
} from "class-validator"

export class CreateRequestedServiceDto {
	// @IsString()
	// userId: string

	@IsString()
	@MinLength(2, {
		message: "Service name is too short, at least 2 characters required"
	})
	name: string

	@IsString()
	@IsUrl()
	url: string
}

export class UpdateRequestedServiceDto {
	@IsOptional()
	@IsString()
	userId?: string

	@IsOptional()
	@IsString()
	@MinLength(2, {
		message: "Service name is too short, at least 2 characters required"
	})
	name?: string

	@IsOptional()
	@IsString()
	@IsUrl()
	url?: string
}
