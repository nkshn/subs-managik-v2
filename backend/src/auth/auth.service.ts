import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { verify } from "argon2"
import { Response } from "express"
import { UserService } from "src/user/user.service"
import { AuthDto } from "./dto/auth.dto"
import { RegisterDto } from "./dto/register.dto"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class AuthService {
	EXPIRE_DAY_REFRESH_TOKEN = 10
	REFRESH_TOKEN_NAME = "refreshToken"

	constructor(
		private jwt: JwtService,
		private userService: UserService,
		private configService: ConfigService
	) { }

	async login(dto: AuthDto) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.validateUser(dto)

		const tokens = this.generateTokens(user.id)

		return {
			user,
			...tokens
		}
	}

	async register(dto: RegisterDto) {
		const foundUserByEmail = await this.userService.getByEmail(dto.email)
		if (foundUserByEmail) throw new BadRequestException({
			type: "email",
			message: "User with such email already exists"
		})

		const foundUserByPhone = await this.userService.getByPhone(dto.phone)
		if (foundUserByPhone) throw new BadRequestException({
			type: "phone",
			message: "User with such phone already exists"
		})

		if (dto.password !== dto.repeatPassword) throw new BadRequestException({
			type: "repeatPassword",
			message: "Passwords must match"
		})

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.userService.create(dto)

		const tokens = this.generateTokens(user.id)

		return {
			user,
			...tokens
		}
	}

	async getNewTokens(refreshToken: string) {
		const result = this.jwt.verify(refreshToken)
		if (!result) throw new UnauthorizedException("Invalid refresh token")

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.userService.getById(result.id)
		if (!user) throw new NotFoundException("User not found")

		const tokens = this.generateTokens(user.id)

		return {
			user,
			...tokens
		}
	}

	addRefreshTokenToResponse(res: Response, refreshToken: string) {
		const expiresIn = new Date()
		expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)

		res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
			httpOnly: true,
			domain: this.configService.get<string>("DOMAIN_NAME"),
			expires: expiresIn,
			secure: true,
			sameSite: this.configService.get<string>("NODE_ENV") === "production" ? "lax": "none"
		})
	}

	removeRefreshTokenFromResponse(res: Response) {
		res.cookie(this.REFRESH_TOKEN_NAME, "", {
			httpOnly: true,
			domain: this.configService.get<string>("DOMAIN_NAME"),
			expires: new Date(0),
			secure: true,
			sameSite: this.configService.get<string>("NODE_ENV") === "production" ? "lax": "none"
		})
	}

	private generateTokens(userId: string) {
		const data = { id: userId }

		const accessToken = this.jwt.sign(data, {
			expiresIn: "1h"
		})

		const refreshToken = this.jwt.sign(data, {
			expiresIn: "14d"
		})

		return { accessToken, refreshToken }
	}

	private async validateUser(dto: AuthDto) {
		const user = await this.userService.getByEmail(dto.email)

		if (!user) throw new NotFoundException({
			type: "email",
			message: "User not found"
		})

		const isValid = await verify(user.password, dto.password)

		if (!isValid) throw new UnauthorizedException({
			type: "password",
			message: "Invalid password",
		})

		return user
	}
}
