import request from 'supertest';
import { Test } from '@nestjs/testing';
import { ItemModule } from '../src/item/item.module';
import { ItemService } from '../src/item/item.service';
import { INestApplication } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

// TODO: Put GQL strings in own files

describe('Items', () => {
	let app: INestApplication;
	const itemService = {
		findAll: () => [{ id: 1, title: 'Item', description: 'Description', completed: false, deleted: false, priority: 'high' }],
		find: jest
			.fn()
			.mockImplementation((id) =>
				id >= 0 ? { id, title: 'Item', description: 'Description', completed: false, deleted: false, priority: 'high' } : undefined
			),
		create: jest.fn().mockImplementation((dto) => (dto.title ? { ...dto, id: Date.now() } : undefined)),
		complete: jest.fn().mockImplementation((id) => (id >= 0 ? { id, completed: true } : undefined)),
		delete: jest.fn().mockImplementation((id) => (id >= 0 ? { id, deleted: true } : undefined))
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
			.post('/graphql')
			.send({
				query: `
          {
            getItems {
              id
              title
              description
              completed
              deleted
              priority
            }
          }
        `
			})
			.expect(200)
			.expect(({ body }) => {
				expect(body.data.getItems).toEqual(itemService.findAll());
			});
	});

	it('/GET item/1', () => {
		return request(app.getHttpServer())
			.post('/graphql')
			.send({
				query: `
          {
            getItem(id: 1) {
              id
              title
              description
              completed
              deleted
              priority
            }
          }
        `
			})
			.expect(200)
			.expect(({ body }) => {
				expect(body.data.getItem).toEqual({ id: 1, title: 'Item', description: 'Description', completed: false, deleted: false, priority: 'high' });
			});
	});

	it('/GET item with negative ID', () => {
		return request(app.getHttpServer())
			.post('/graphql')
			.send({
				query: `
          {
            getItem(id: -1) {
              id
              title
              description
              completed
              deleted
              priority
            }
          }
        `
			})
			.expect(400);
	});

	it('/POST item', () => {
		return request(app.getHttpServer())
			.post('/graphql')
			.send({
				query: `
          mutation {
            createItem(input: { title: "New Item", description: "Description", completed: false, deleted: false, priority: "high" }) {
              id
              title
              description
              completed
              deleted
              priority
            }
          }
        `
			})
			.expect(200)
			.expect(({ body }) => {
				expect(body.data.createItem).toMatchObject({
					title: 'New Item',
					description: 'Description',
					completed: false,
					deleted: false,
					priority: 'high'
				});
			});
	});

	it('/POST item with invalid data', () => {
		return request(app.getHttpServer())
			.post('/graphql')
			.send({
				query: `
          mutation {
            createItem(input: { description: "Missing title", completed: false, deleted: false, priority: "high" }) {
              id
              title
              description
              completed
              deleted
              priority
            }
          }
        `
			})
			.expect(400);
	});

	it('/PATCH item/1/complete', () => {
		return request(app.getHttpServer())
			.post('/graphql')
			.send({
				query: `
          mutation {
            completeItem(id: 1) {
              id
              completed
            }
          }
        `
			})
			.expect(200)
			.expect(({ body }) => {
				expect(body.data.completeItem).toEqual({ id: 1, completed: true });
			});
	});

	it('/PATCH item with negative ID', () => {
		return request(app.getHttpServer())
			.post('/graphql')
			.send({
				query: `
          mutation {
            completeItem(id: -1) {
              id
              completed
            }
          }
        `
			})
			.expect(400);
	});

	it('/DELETE item/1', () => {
		return request(app.getHttpServer())
			.post('/graphql')
			.send({
				query: `
          mutation {
            deleteItem(id: 1) {
              id
              deleted
            }
          }
        `
			})
			.expect(200)
			.expect(({ body }) => {
				expect(body.data.deleteItem).toEqual({ id: 1, deleted: true });
			});
	});

	it('/DELETE item with negative ID', () => {
		return request(app.getHttpServer())
			.post('/graphql')
			.send({
				query: `
          mutation {
            deleteItem(id: -1) {
              id
              deleted
            }
          }
        `
			})
			.expect(400);
	});

	afterAll(async () => {
		await app.close();
	});
});
