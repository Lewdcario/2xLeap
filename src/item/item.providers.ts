
import { DataSource } from 'typeorm';
import { Item } from './item.entity';
import { DATA_SOURCE, ITEM_REPOSITORY } from '../util/Constants';

export const itemProviders = [
	{
		provide: ITEM_REPOSITORY,
		useFactory: (dataSource: DataSource) => dataSource.getRepository(Item),
		inject: [DATA_SOURCE]
	}
];