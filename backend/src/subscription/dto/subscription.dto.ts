import { IsOptional, IsString, IsNumber, Min, Max } from "class-validator"

export class CreateSubscriptionDto {
	@IsString()
	serviceId: string

	@IsNumber()
	@Min(0.01)
	@Max(9999.99)
	price: number

	@IsOptional()
	@IsString()
	note?: string = ""
}

export class UpdateSubscriptionDto {
	@IsOptional()
	@IsString()
	serviceId?: string

	@IsOptional()
	@IsNumber()
	@Min(0.01)
	@Max(9999.99)
	price?: number

	@IsOptional()
	@IsString()
	note?: string
}
