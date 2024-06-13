import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import * as cookieParser from "cookie-parser"
import { BadRequestException, ValidationPipe } from "@nestjs/common"

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

  // custom error handling for class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          type: error.property,
          message: error.constraints[Object.keys(error.constraints)[0]],
        }));
        return new BadRequestException(result);
      },
      stopAtFirstError: true,
    })
  )

  app.getHttpAdapter().getInstance().disable("x-powered-by")
  app.setGlobalPrefix("api")
  app.use(cookieParser())
  app.enableCors({
    origin: ["http://localhost:3000", "http://89.116.22.179:3000"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })

	await app.listen(5000)
}

bootstrap()
