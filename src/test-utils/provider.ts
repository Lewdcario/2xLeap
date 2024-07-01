import { DataSource } from 'typeorm';
import { DATA_SOURCE } from '../util/Constants';
import { Item } from '../item/item.entity';

export const databaseProviders = [
	{
		provide: DATA_SOURCE,
		useFactory: async () => {
			const dataSource = new DataSource({
				type: 'sqlite',
				database: ':memory:',
				entities: [Item],
				synchronize: process.env.ENV === 'local'
			});

			return dataSource.initialize();
		}
	}
];
