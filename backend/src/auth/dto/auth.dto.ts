import { IsEmail, IsString, MinLength } from "class-validator"

export class AuthDto {
	@IsString()
	@IsEmail({}, { message: "Please provide a valid email address" })
	email: string

	@IsString()
	@MinLength(8, {
		message: "Password is too short, at least 8 characters required",
	})
	password: string
}
