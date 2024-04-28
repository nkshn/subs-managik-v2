import { IsString, MaxLength, MinLength } from "class-validator"
import { AuthDto } from "./auth.dto"

export class RegisterDto extends AuthDto {
	@IsString()
	@MinLength(2, {
		message: "Name is too short, please provide a real one"
	})
	@MaxLength(50, {
		message: "Name is too long, please provide a real one"
	})
	name: string
}
