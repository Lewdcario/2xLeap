import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { ItemModule } from '../src/item/item.module';
import { ItemService } from '../src/item/item.service';
import { INestApplication } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

describe('Items', () => {
	let app: INestApplication;
	const itemService = {
		findAll: () => ['test'],
		find: jest.fn().mockImplementation((id) => id >= 0 ? { id, name: 'Item' } : undefined),
		create: jest.fn().mockImplementation((dto) => dto.title ? { ...dto, id: Date.now() } : undefined),
		complete: jest.fn().mockImplementation((id) => id >= 0 ? { id, completed: true } : undefined),
		delete: jest.fn().mockImplementation((id) => id >= 0 ? { id, deleted: true } : undefined)
	};

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [ItemModule]
		})
			.overrideProvider(ItemService)
			.useValue(itemService)
			.compile();

		app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
		await app.init();
		await app.getHttpAdapter().getInstance().ready();
	});

	it('/GET items', () => {
		return request(app.getHttpServer())
			.get('/items')
			.expect(200)
			.expect(itemService.findAll());
	});

	it('/GET items/1', () => {
		return request(app.getHttpServer())
			.get('/items/1')
			.expect(200)
			.expect({ id: 1, name: 'Item' });
	});

	it('/GET items with negative ID', () => {
		return request(app.getHttpServer())
			.get('/items/-1')
			.expect(400);
	});

	it('/POST items', () => {
		return request(app.getHttpServer())
			.post('/items')
			.send({ title: 'New Item', description: 'Description', priority: 'high' })
			.expect(201);
	});

	it('/POST items with invalid data', () => {
		return request(app.getHttpServer())
			.post('/items')
			.send({ description: 'Missing title' })
			.expect(400);
	});

	it('/PATCH items/1/complete', () => {
		return request(app.getHttpServer())
			.patch('/items/1/complete')
			.expect(200)
			.expect({ id: 1, completed: true });
	});

	it('/PATCH items with negative ID', () => {
		return request(app.getHttpServer())
			.patch('/items/-1/complete')
			.expect(400);
	});

	it('/DELETE items/1', () => {
		return request(app.getHttpServer())
			.delete('/items/1')
			.expect(200)
			.expect({ id: 1, deleted: true });
	});

	it('/DELETE items with negative ID', () => {
		return request(app.getHttpServer())
			.delete('/items/-1')
			.expect(400);
	});

	afterAll(async () => {
		await app.close();
	});
});