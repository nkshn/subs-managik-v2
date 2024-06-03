import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import * as cookieParser from "cookie-parser"

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

  app.getHttpAdapter().getInstance().disable("x-powered-by")
  app.setGlobalPrefix("api")
  app.use(cookieParser())
  app.enableCors({
    origin: ["http://localhost:3000"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })

	await app.listen(5000)
}

bootstrap()
