import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ItemService } from './item.service';
import { Item } from './item.entity';
import { CreateItemDTO, CreateItemSchema, CreateItemSchemaType } from './create-item.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, UseInterceptors, UsePipes } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ValidatePositiveIntPipe, ZodValidationPipe } from '../util/pipes/validation.pipe';
import { Public } from '../util/Constants';
import { GqlCacheInterceptor } from '../util/interceptors/gql-cache.interceptor';

@Resolver('Item')
export class ItemResolver {
	constructor(
		private itemService: ItemService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache
	) {}

	@Query(() => [Item])
	@Public()
	@UseInterceptors(GqlCacheInterceptor)
	async getItems() {
		return this.itemService.findAll();
	}

	@Query(() => Item, { nullable: true })
	@Public()
	@UseInterceptors(GqlCacheInterceptor)
	async getItem(@Args('id', ValidatePositiveIntPipe) id: number) {
		return this.itemService.find(id);
	}

	@Mutation(() => Item)
	@Public()
	@UsePipes(new ZodValidationPipe(CreateItemSchema))
	async createItem(@Args('input') input: CreateItemSchemaType) {
		const createItemDto = new CreateItemDTO(input.title, input.description, input.priority);
		const newItem = await this.itemService.create(createItemDto);

		await this.cacheManager.del('items'); // Invalidate cache
		return newItem;
	}

	@Mutation(() => Item, { nullable: true })
	@Public() // TODO: Remove these
	async completeItem(@Args('id', ValidatePositiveIntPipe) id: number) {
		const updatedItem = await this.itemService.complete(id);

		if (updatedItem) {
			await this.cacheManager.set(`item-${id}`, updatedItem, 300);
			await this.cacheManager.del('items'); // Invalidate cache
		}

		return updatedItem;
	}

	@Mutation(() => Item, { nullable: true })
	@Public()
	async deleteItem(@Args('id', ValidatePositiveIntPipe) id: number) {
		const deletedItem = await this.itemService.delete(id);

		if (deletedItem) {
			await this.cacheManager.set(`item-${id}`, deletedItem, 300);
			await this.cacheManager.del('items'); // Invalidate cache
		}

		return deletedItem;
	}
}
