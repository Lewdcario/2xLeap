import { Test } from '@nestjs/testing';
import { ItemResolver } from './item.resolver';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ItemService } from './item.service';
import { Item } from './item.entity';
import { ITEM_REPOSITORY } from '../util/Constants';
import { CreateItemDTO, CreateItemSchema } from './create-item.dto';
import { BadRequestException } from '@nestjs/common';
import { ValidatePositiveIntPipe, ZodValidationPipe } from '../util/pipes/validation.pipe';
import { GraphQLModule } from '@nestjs/graphql';
import { Cache } from 'cache-manager';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

describe('ItemResolver', () => {
	let itemResolver: ItemResolver;
	let itemService: ItemService;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	let cacheManager: Cache;

	const mockCacheManager = {
		get: jest.fn(),
		set: jest.fn(),
		del: jest.fn()
	};

	beforeEach(async () => {
		const mockRepository = {
			find: jest.fn(),
			findOne: jest.fn()
		};

		const moduleRef = await Test.createTestingModule({
			imports: [
				GraphQLModule.forRoot<ApolloDriverConfig>({
					driver: ApolloDriver,
					autoSchemaFile: true
				})
			],
			providers: [
				ItemResolver,
				ItemService,
				{
					provide: ITEM_REPOSITORY,
					useValue: mockRepository
				},
				{
					provide: CACHE_MANAGER,
					useValue: mockCacheManager
				}
			]
		}).compile();

		itemService = moduleRef.get<ItemService>(ItemService);
		itemResolver = moduleRef.get<ItemResolver>(ItemResolver);
		cacheManager = moduleRef.get(CACHE_MANAGER);
	});

	describe('getItems', () => {
		it('should return an array of items', async () => {
			const result = [new Item(), new Item()];
			jest.spyOn(itemService, 'findAll').mockImplementation(() => Promise.resolve(result));

			expect(await itemResolver.getItems()).toBe(result);
		});

		it('should handle empty result', async () => {
			jest.spyOn(itemService, 'findAll').mockResolvedValue([]);
			const result = await itemResolver.getItems();
			expect(result).toEqual([]);
		});
	});

	describe('getItem', () => {
		it('should return a single item', async () => {
			const item = new Item();
			jest.spyOn(itemService, 'find').mockResolvedValue(item);

			expect(await itemResolver.getItem(1)).toBe(item);
		});

		it('should handle a non-existing item', async () => {
			jest.spyOn(itemService, 'find').mockResolvedValue(null);
			await expect(itemResolver.getItem(999)).resolves.toBeNull();
		});

		it('should handle negative ID', async () => {
			const validatePipe = new ValidatePositiveIntPipe();

			try {
				validatePipe.transform(-1, { type: 'param', metatype: Number, data: 'id' });
			} catch (error) {
				expect(error).toBeInstanceOf(BadRequestException);
			}
		});
	});

	describe('createItem', () => {
		it('should create and return an item', async () => {
			const item = new Item();
			const createItemDTO = new CreateItemDTO('title', 'description', 'high');
			jest.spyOn(itemService, 'create').mockResolvedValue(item);

			expect(await itemResolver.createItem(createItemDTO)).toBe(item);
		});

		it('should handle invalid createItemDTO', async () => {
			const validationPipe = new ZodValidationPipe(CreateItemSchema);
			const invalidDto = new CreateItemDTO('', '', ''); // Provide invalid data here
			try {
				validationPipe.transform(invalidDto, { metatype: CreateItemDTO, type: 'body' });
				fail('Validation did not throw an error');
			} catch (error) {
				expect(error).toBeInstanceOf(BadRequestException);
			}
		});

		it('should handle database save failure', async () => {
			const itemDTO = new CreateItemDTO('title', 'description', 'high');
			jest.spyOn(itemService, 'create').mockRejectedValue(new Error('Database failure'));
			await expect(itemResolver.createItem(itemDTO)).rejects.toThrow('Database failure');
		});

		it('should handle duplicate item creation', async () => {
			const duplicateItemDTO = new CreateItemDTO('Existing Title', 'description', 'high');
			jest.spyOn(itemService, 'create').mockRejectedValue(new Error('Duplicate item'));
			await expect(itemResolver.createItem(duplicateItemDTO)).rejects.toThrow('Duplicate item');
		});
	});

	describe('completeItem', () => {
		it('should mark an item as complete and return it', async () => {
			const item = new Item();
			jest.spyOn(itemService, 'complete').mockResolvedValue(item);

			expect(await itemResolver.completeItem(1)).toBe(item);
		});

		it('should handle completion of a non-existing item', async () => {
			jest.spyOn(itemService, 'complete').mockResolvedValue(null);
			await expect(itemResolver.completeItem(999)).resolves.toBeNull();
		});
	});

	describe('deleteItem', () => {
		it('should mark an item as deleted and return it', async () => {
			const item = new Item();
			jest.spyOn(itemService, 'delete').mockResolvedValue(item);

			expect(await itemResolver.deleteItem(1)).toBe(item);
		});

		it('should handle deletion of a non-existing item', async () => {
			jest.spyOn(itemService, 'delete').mockResolvedValue(null);
			await expect(itemResolver.deleteItem(999)).resolves.toBeNull();
		});
	});

	describe('concurrency', () => {
		it('should handle concurrent update requests', async () => {
			const id = 1;
			jest.spyOn(itemService, 'complete').mockImplementation(async () => {
				await new Promise((resolve) => setTimeout(resolve, 100));
				return new Item();
			});
			const firstCall = itemResolver.completeItem(id);
			const secondCall = itemResolver.completeItem(id);
			await expect(Promise.all([firstCall, secondCall])).resolves.toBeDefined();
		});
	});
});
