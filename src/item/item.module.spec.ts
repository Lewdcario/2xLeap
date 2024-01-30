import { Test } from '@nestjs/testing';
import { ItemModule } from './item.module';
import { ItemService } from './item.service';

describe('ItemModule', () => {
	it('should compile the module', async () => {
		const module = await Test.createTestingModule({
			imports: [ItemModule]
		}).compile();

		expect(module).toBeDefined();
		expect(module.get(ItemService)).toBeInstanceOf(ItemService);
	});
});