import { Injectable } from "@nestjs/common"
import { PrismaService } from "src/prisma.service"

@Injectable()
export class ServiceService {
	constructor(private prisma: PrismaService) {}

	async getAll() {
		return this.prisma.service.findMany({
			select: {
				id: true,
				fullName: true,
				shortName: true,
				backgroundColor: true,
			}
		})
	}
}
