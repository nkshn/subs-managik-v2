import { IsString, MaxLength, MinLength, IsPhoneNumber } from "class-validator"
import { AuthDto } from "./auth.dto"

export class RegisterDto extends AuthDto {
	@IsString()
	@MinLength(2, {
		message: "Name is too short, please provide a real one"
	})
	@MaxLength(255, {
		message: "Name is too long, please provide a real one"
	})
	name: string

	@IsString()
	@IsPhoneNumber("UA", {
		message: "Please provide a valid phone number with country code"
	})
	phone: string

	@IsString()
	@MinLength(8, {
		message: "Confirm password is too short, at least 8 characters required",
	})
	repeatPassword: string
}
