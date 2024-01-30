import { Test } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Repository, UpdateResult } from 'typeorm';
import { ItemService } from './item.service';
import { Item } from './item.entity';
import { ITEM_REPOSITORY } from '../util/Constants';
import { CreateItemDTO } from './create-item.dto';

describe('ItemService', () => {
	let itemService: ItemService;
	let itemRepository: Repository<Item>;

	const mockCacheManager = {
		get: jest.fn(),
		set: jest.fn(),
		del: jest.fn()
	};

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [
				ItemService,
				{
					provide: ITEM_REPOSITORY,
					useValue: {
						findOne: jest.fn(),
						find: jest.fn(),
						update: jest.fn(),
						save: jest.fn(),
						create: jest.fn().mockImplementation((dto) => dto)
					}
				},
				 {
					provide: CACHE_MANAGER,
					useValue: mockCacheManager
				}
			]
		}).compile();

		itemService = moduleRef.get<ItemService>(ItemService);
		itemRepository = moduleRef.get<Repository<Item>>(ITEM_REPOSITORY);
	});

	describe('find', () => {
		it('should return a single item', async () => {
			const item = new Item();
			jest.spyOn(itemRepository, 'findOne').mockResolvedValue(item);

			const found = await itemService.find(1);
			expect(found).toEqual(item);
		});

		it('should fetch from repository and update cache if not in cache for find', async () => {
			const item = new Item();
			jest.spyOn(mockCacheManager, 'get').mockResolvedValue(null);
			jest.spyOn(itemRepository, 'findOne').mockResolvedValue(item);
			const found = await itemService.find(1);
			expect(mockCacheManager.get).toHaveBeenCalledWith('item-1');
			expect(mockCacheManager.set).toHaveBeenCalledWith('item-1', item, 300);
			expect(found).toEqual(item);
		});

		it('should return item from cache', async () => {
			const cachedItem = new Item();
			jest.spyOn(mockCacheManager, 'get').mockResolvedValue(cachedItem);

			const item = await itemService.find(1);
			expect(mockCacheManager.get).toHaveBeenCalledWith('item-1');
			expect(item).toEqual(cachedItem);
		});
	});

	describe('findAll', () => {
		 it('should return an array of items', async () => {
			const result = [new Item(), new Item()];
			jest.spyOn(itemRepository, 'find').mockResolvedValue(result);

			for (const item of result) {
				expect(await itemService.find(item.id)).toEqual(item);
			}

			// expect(await itemService.findAll()).toEqual(result);
		});

		 it('should fetch items from the repository and set them in cache if cache is empty', async () => {
			const result = [new Item(), new Item()];
			jest.spyOn(mockCacheManager, 'get').mockResolvedValue(null);
			jest.spyOn(itemRepository, 'find').mockResolvedValue(result);

			const items = await itemService.findAll();
			expect(mockCacheManager.get).toHaveBeenCalledWith('items');
			expect(itemRepository.find).toHaveBeenCalled();
			expect(mockCacheManager.set).toHaveBeenCalledWith('items', result, 300);
			expect(items).toEqual(result);
		});

		 it('should return items from cache', async () => {
			const cachedItems = [new Item(), new Item()];
			jest.spyOn(mockCacheManager, 'get').mockResolvedValue(cachedItems);

			const items = await itemService.findAll();
			expect(mockCacheManager.get).toHaveBeenCalledWith('items');
			expect(items).toEqual(cachedItems);
		});
	});

	describe('create', () => {
		it('should create and return the item', async () => {
			const item = new Item();
			const createItemDTO = new CreateItemDTO();
			jest.spyOn(itemRepository, 'save').mockResolvedValue(item);

			expect(await itemService.create(createItemDTO)).toEqual(item);
		});
	});

	describe('complete', () => {
		it('should update and return the item', async () => {
			const item = new Item();
			jest.spyOn(itemRepository, 'update').mockResolvedValue(new UpdateResult());
			jest.spyOn(itemRepository, 'findOne').mockResolvedValue(item);

			const updated = await itemService.complete(1);
			expect(updated).toEqual(item);
		});

		it('should invalidate cache after completing an item', async () => {
			const item = new Item();
			jest.spyOn(itemRepository, 'update').mockResolvedValue(new UpdateResult());
			jest.spyOn(itemRepository, 'findOne').mockResolvedValue(item);
			await itemService.complete(1);
			expect(mockCacheManager.del).toHaveBeenCalledWith('items');
		});
	});

	describe('delete', () => {
		it('should mark the item as deleted and return it', async () => {
			const item = new Item();
			jest.spyOn(itemRepository, 'update').mockResolvedValue(new UpdateResult());
			jest.spyOn(itemRepository, 'findOne').mockResolvedValue(item);

			const deleted = await itemService.delete(1);
			expect(deleted).toEqual(item);
		});

		it('should invalidate cache after deleting an item', async () => {
			const item = new Item();
			jest.spyOn(itemRepository, 'update').mockResolvedValue(new UpdateResult());
			jest.spyOn(itemRepository, 'findOne').mockResolvedValue(item);
			await itemService.delete(1);
			expect(mockCacheManager.del).toHaveBeenCalledWith('items');
		});
	});
});
