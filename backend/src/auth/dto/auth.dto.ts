import { IsEmail, IsString, MinLength } from "class-validator"

export class AuthDto {
	@IsEmail()
	email: string

	@MinLength(6, {
		message: "Password is too short, at least 6 characters required"
	})
	@IsString()
	password: string
}
