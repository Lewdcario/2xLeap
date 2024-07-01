import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

import { version } from '../package.json';

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

	await app.listen(process.env.PORT ?? 3000, process.env.HOST ?? '127.0.0.1');

	console.log(`Listening on port ${process.env.PORT ?? 3000}... | Version: ${version}`);
}

bootstrap();
