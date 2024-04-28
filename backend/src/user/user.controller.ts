import {
	Body,
	Controller,
	Get,
	HttpCode,
	Put,
	UsePipes,
	ValidationPipe
} from "@nestjs/common"
import { UserService } from "./user.service"
import { CurrentUser } from "src/auth/decorators/user.decorator"
import { UpdateUserDto } from "./dto/user.dto"
import { Auth } from "src/auth/decorators/auth.decorator"

@Controller("user")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	@Auth()
	async getMe(@CurrentUser("id") userId: string) {
		return this.userService.getById(userId)
	}

	@Get()
	@Auth()
	async profile(@CurrentUser("id") userId: string) {
		return this.userService.getProfile(userId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put()
	@Auth()
	async update(@CurrentUser("id") userId: string, @Body() dto: UpdateUserDto) {
		return this.userService.update(userId, dto)
	}
}
