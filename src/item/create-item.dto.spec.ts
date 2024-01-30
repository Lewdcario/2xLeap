import { CreateItemDTO } from './create-item.dto';

describe('CreateItemDTO', () => {
	it('should work', async () => {
		const item = new CreateItemDTO('Item 1', 'Description 1', 'High');
		expect(item.title).toEqual('Item 1');
		expect(item.description).toEqual('Description 1');
		expect(item.priority).toEqual('High');
	});
});