import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import * as dbUtils from './test-utils/prisma-connect'; // TODO: Distinguish between testing one and main one, and delete old db files

import { version } from '../package.json';

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
	const configService = app.get(ConfigService);
	const DB_NAME = configService.get('DB_NAME');
	const PORT = configService.get('PORT') ?? 3000; // TODO: Defaults
	const HOST = configService.get('HOST') ?? '127.0.0.1';

	await dbUtils.newDB(DB_NAME); // SQlite memory db

	await app.listen(PORT, HOST);

	console.log(`Listening on port ${PORT}... | Version: ${version}`);
}

bootstrap();
