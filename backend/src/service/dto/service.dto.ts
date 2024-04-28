import {
	IsNumber,
	IsOptional,
	IsString,
	IsUrl,
	Max,
	Min
} from "class-validator"

export class CreateServiceDto {
	@IsString()
	name: string

	@IsNumber()
	@Min(0.01)
	@Max(9999.99)
	price: number

	@IsString()
	@IsUrl()
	url: string

	@IsString()
	@IsUrl()
	logo: string
}

export class UpdateServiceDto {
  @IsOptional()
	@IsString()
	name?: string

  @IsOptional()
	@IsNumber()
	@Min(0.01)
	@Max(9999.99)
	price?: number

  @IsOptional()
	@IsString()
	@IsUrl()
	url?: string

  @IsOptional()
	@IsString()
	@IsUrl()
	logo?: string
}
