import {
	IsEmail,
	IsOptional,
	IsPhoneNumber,
	IsString,
	IsUrl,
	MaxLength,
	MinLength
} from "class-validator"

export class CreateUserDto {
	@IsOptional()
	@IsString()
	@MinLength(2, {
		message: "Name is too short, at least 2 characters required"
	})
	@MaxLength(100, {
		message: "Name is too long, use real name"
	})
	name?: string

	@IsEmail()
	email: string

	@MinLength(6, {
		message: "Password is too short, at least 6 characters required"
	})
	@IsString()
	password: string

	@IsOptional()
	@IsString()
	@IsUrl()
	logo?: string

	@IsOptional()
	@IsString()
	@IsPhoneNumber()
	phone?: string
}

export class UpdateUserDto {
	@IsOptional()
	@IsString()
	@MinLength(2, {
		message: "Name is too short, at least 2 characters required"
	})
	@MaxLength(100, {
		message: "Name is too long, use real name"
	})
	name?: string

	@IsOptional()
	@IsEmail()
	email?: string

	@IsOptional()
	@IsString()
	@MinLength(6, {
		message: "Password is too short, at least 6 characters required"
	})
	password?: string

	@IsOptional()
	@IsString()
	@IsUrl()
	logo?: string

	@IsOptional()
	@IsString()
	@IsPhoneNumber()
	phone?: string
}
