import { Injectable } from "@nestjs/common"

@Injectable()
export class TestRouteService {
	findAll() {
		return {
			msg: "This action returns all testRoute"
		}
	}
}
