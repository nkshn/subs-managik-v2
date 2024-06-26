import { BadRequestException, Injectable } from "@nestjs/common"
import { hash } from "argon2"
import { PrismaService } from "src/prisma.service"
import { UpdateUserDto } from "./dto/user.dto"
import { RegisterDto } from "src/auth/dto/register.dto"

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	getById(id: string) {
		return this.prisma.user.findUnique({
			where: {
				id
			},
			include: {
				subscriptions: {
					include: {
						service: true,
					}
				},
				requestedSerices: true,
			}
		})
	}

	getAllWithSubscriptionsAndService() {
		return this.prisma.user.findMany({
			include: {
        subscriptions: {
					include: {
						service: true,
					}
				}
      },
		})
	}

	getByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: {
				email
			}
		})
	}

	getByPhone(phone: string) {
		return this.prisma.user.findUnique({
			where: {
				phone
			}
		})
	}

	async getProfile(id: string) {
		const userProfile = await this.getById(id)

		const totalSubscriptions = userProfile.subscriptions.length
		const totalRevenue = userProfile.subscriptions.reduce(
			(acc, sub) => acc + sub.price,
			0
		)
		const totalRequestedSerices = userProfile.requestedSerices.length

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, subscriptions, requestedSerices, ...restUser } = userProfile

		return {
			user: restUser,
			stats: {
				totalSubscriptions,
				totalRevenue,
				totalRequestedSerices
			}
		}
	}

	async create(dto: RegisterDto) {
		const user = {
			name: dto.name,
			email: dto.email,
			phone: dto.phone,
			password: await hash(dto.password)
		}

		return this.prisma.user.create({
			data: user
		})
	}

	async update(id: string, dto: UpdateUserDto) {
		let data = dto

		const currentUser = await this.getById(id)

		if (dto.password) {
			data = { ...dto, password: await hash(dto.password) }
		}

		if (dto.email) {
			if (currentUser.email !== dto.email) {
				const foundUserByEmail = await this.getByEmail(dto.email)

				if (foundUserByEmail) throw new BadRequestException({
					type: "email",
					message: "User with such email already exists",
				})
			}
		}

		if (dto.phone) {
			if (currentUser.phone !== dto.phone) {
				const foundUserByPhone = await this.getByPhone(dto.phone)
				if (foundUserByPhone) throw new BadRequestException({
					type: "phone",
					message: "User with such phone already exists",
				})
			}
		}

		return this.prisma.user.update({
			where: {
				id
			},
			data,
			select: {
				id: true,
				name: true,
				email: true,
				phone: true
			}
		})
	}
}
