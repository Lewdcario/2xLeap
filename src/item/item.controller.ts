import { Body, Controller, Delete, Get, UseInterceptors, UsePipes, Patch, Post, Param } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ItemService } from './item.service';
import { Item } from './item.entity';
import { CreateItemDTO, CreateItemSchema } from './create-item.dto';
import { ValidatePositiveIntPipe, ZodValidationPipe } from '../util/pipes/validation.pipe';

@Controller('items')
export class ItemController {
	constructor(private readonly itemService: ItemService) {}

	@UseInterceptors(CacheInterceptor)
	@Get()
	getItems(): Promise<Item[]> {
		return this.itemService.findAll();
	}

	@UseInterceptors(CacheInterceptor)
	@Get(':id')
	getItem(@Param('id', ValidatePositiveIntPipe) id: number): Promise<Item | null> {
		return this.itemService.find(id);
	}

	@Post()
	@UsePipes(new ZodValidationPipe(CreateItemSchema))
	createItem(@Body() createItemDTO: CreateItemDTO): Promise<Item> {
		return this.itemService.create(createItemDTO);
	}

	@Patch(':id/complete')
	complete(@Param('id', ValidatePositiveIntPipe) id: number): Promise<Item | null> {
		return this.itemService.complete(id);
	}

	@Delete(':id')
	deleteItem(@Param('id', ValidatePositiveIntPipe) id: number): Promise<Item | null> {
		return this.itemService.delete(id);
	}
}
