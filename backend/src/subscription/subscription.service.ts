import { Injectable } from "@nestjs/common"
import { PrismaService } from "src/prisma.service"
import {
	CreateSubscriptionDto,
	UpdateSubscriptionDto
} from "./dto/subscription.dto"

@Injectable()
export class SubscriptionService {
	constructor(private prisma: PrismaService) {}

	// reusable variable for select options
	private selectOptions = {
		id: true,
		isNotifying: true,
		price: true,
		note: true,
		nextPaymentAt: true,
		createdAt: true,
		service: {
			select: {
				id: true,
				fullName: true,
				shortName: true,
				backgroundColor: true,
			}
		}
	};

	// create new subscription for user with service
	async create(userId: string, dto: CreateSubscriptionDto) {
		return this.prisma.subscription.create({
			data: {
				...dto,
				nextPaymentAt: new Date(dto.nextPaymentAt),
				userId: userId
			},
			select: this.selectOptions,
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
			data: {
				...dto,
				nextPaymentAt: new Date(dto.nextPaymentAt),
			},
			select: this.selectOptions,
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
			},
			select: this.selectOptions,
			orderBy: {
				createdAt: 'desc'
			}
		})
	}
}
