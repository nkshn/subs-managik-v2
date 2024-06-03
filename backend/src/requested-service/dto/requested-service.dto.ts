import {
	IsString,
	IsUrl,
	MinLength
} from "class-validator"

export class CreateRequestedServiceDto {
	@IsString()
	@MinLength(2, {
		message: "Service name is too short, at least 2 characters required"
	})
	name: string

	@IsString()
	@IsUrl({}, { message: "Enter please valid URL of service" })
	url: string
}
