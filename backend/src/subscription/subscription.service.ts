import { Injectable } from "@nestjs/common"
import { PrismaService } from "src/prisma.service"
import {
	CreateSubscriptionDto,
	UpdateSubscriptionDto
} from "./dto/subscription.dto"

@Injectable()
export class SubscriptionService {
	constructor(private prisma: PrismaService) {}

	// create new subscription for user with service
	async create(userId: string, dto: CreateSubscriptionDto) {
		return this.prisma.subscription.create({
			data: {
				...dto,
				userId: userId
			}
		})
	}

	// update subscription of user
	async update(
		dto: UpdateSubscriptionDto,
		subscriptionId: string,
		userId: string
	) {
		return this.prisma.subscription.update({
			where: {
				userId,
				id: subscriptionId
			},
			data: dto
		})
	}

	// delete user subscription
	async deleteUserSubscription(userId: string, subscriptionId: string) {
		return this.prisma.subscription.delete({
			where: {
				id: subscriptionId,
				userId: userId,
			}
		})
	}

	// get all subscriptions of user
	async getAllByUserId(userId: string) {
		return this.prisma.subscription.findMany({
			where: {
				userId
			}
		})
	}

	// get specific subscription of user by service
	async getByUserIdAndServiceId(userId: string, serviceId: string) {
		return this.prisma.subscription.findFirst({
			where: {
				userId,
				serviceId
			}
		})
	}


	// get specific subscription of user by id
	async getOneByUserId(subscriptionId: string, userId: string) {
		return this.prisma.subscription.findFirst({
			where: {
				id: subscriptionId,
				userId
			}
		})
	}
}
