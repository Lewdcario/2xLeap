import { getConnection } from 'typeorm';
import { Item } from '../item/item.entity';

export const testDatasetSeed = async () => {
	const connection = await getConnection();
	const entityManager = connection.createEntityManager();

	await entityManager.insert<Item>(Item, {
		title: 'Test Item 1',
		description: 'Test Description 1',
		priority: 'low',
		completed: false,
		deleted: false
	});

	await entityManager.insert<Item>(Item, {
		title: 'Test Item 2',
		description: 'Test Description 2',
		priority: 'medium',
		completed: false,
		deleted: false
	});

	await entityManager.insert<Item>(Item, {
		title: 'Test Item 3',
		description: 'Test Description 3',
		priority: 'high',
		completed: false,
		deleted: false
	});

	await entityManager.insert<Item>(Item, {
		title: 'Test Item 4',
		description: 'Test Description 4',
		priority: 'low',
		completed: false,
		deleted: true
	});

	await entityManager.insert<Item>(Item, {
		title: 'Test Item 5',
		description: 'Test Description 5',
		priority: 'medium',
		completed: true,
		deleted: false
	});
};