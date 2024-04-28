import { Injectable } from "@nestjs/common"
import { PrismaService } from "src/prisma.service"
import { CreateServiceDto, UpdateServiceDto } from "./dto/service.dto"

@Injectable()
export class ServiceService {
	constructor(private prisma: PrismaService) {}

	async getAll() {
		return this.prisma.service.findMany()
	}

	async getOneById(serviceId: string) {
		return this.prisma.service.findFirst({
			where: { id: serviceId }
		})
	}

	async create(dto: CreateServiceDto) {
		return this.prisma.service.create({
			data: dto
		})
	}

	async update(serviceId: string, dto: UpdateServiceDto) {
		return this.prisma.service.update({
			where: { id: serviceId },
			data: dto
		})
	}

	async delete(serviceId: string) {
		return this.prisma.service.delete({
			where: { id: serviceId }
		})
	}
}
