import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Item } from './item.entity';
import { CreateItemDTO } from './create-item.dto';
import { ITEM_REPOSITORY } from '../util/Constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ItemService {
	constructor(
    	@Inject(ITEM_REPOSITORY) private itemRepository: Repository<Item>,
		@Inject(CACHE_MANAGER) private cacheManager: Cache
	) {}

	async findAll(): Promise<Item[]> {
		const cachedItems = await this.cacheManager.get<Item[]>('items');
		if (cachedItems) {
			return cachedItems;
		}

		const items = await this.itemRepository.find();
		await this.cacheManager.set('items', items, 300);
		return items;
	}

	async find(id: number): Promise<Item | null> {
		const cachedItem = await this.cacheManager.get<Item>(`item-${id}`);
		if (cachedItem) {
			return cachedItem;
		}

		const item = await this.itemRepository.findOne({ where: { id } });
		if (item) {
			await this.cacheManager.set(`item-${id}`, item, 300);
		}
		return item;
	}

	async complete(id: number): Promise<Item | null> {
		await this.itemRepository.update(id, { completed: true });
		const updatedItem = await this.itemRepository.findOne({ where: { id } });
		await this.cacheManager.set(`item-${id}`, updatedItem, 300);
		await this.cacheManager.del('items');
		return updatedItem;
	}

	async delete(id: number): Promise<Item | null> {
		await this.itemRepository.update(id, { deleted: true });
		const deletedItem = await this.itemRepository.findOne({ where: { id } });
		await this.cacheManager.set(`item-${id}`, deletedItem, 300);
		await this.cacheManager.del('items');
		return deletedItem;
	}

	async create(createItemDTO: CreateItemDTO): Promise<Item> {
		const newItem = this.itemRepository.create(createItemDTO);
		const savedItem = await this.itemRepository.save(newItem);
		await this.cacheManager.set(`item-${savedItem.id}`, savedItem, 300);
		await this.cacheManager.del('items');
		return savedItem;
	}
}