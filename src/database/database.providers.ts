import { DataSource } from 'typeorm';
import { DATA_SOURCE } from '../util/Constants';

export const databaseProviders = [
	{
		provide: DATA_SOURCE,
		useFactory: async () => {
			const dataSource = new DataSource({
				type: 'sqlite',
				database: ':memory:',
				entities: [__dirname + '/../**/*.entity{.ts,.js}'],
				synchronize: process.env.ENV === 'local'
			});

			return dataSource.initialize();
		}
	}
];
