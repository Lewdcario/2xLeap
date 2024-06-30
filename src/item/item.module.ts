import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { itemProviders } from './item.providers';
import { ItemService } from './item.service';
import { ItemResolver } from './item.resolver';
import { DatabaseModule } from '../database/database.module';

@Module({
	imports: [DatabaseModule, CacheModule.register()],
	providers: [...itemProviders, ItemService, ItemResolver]
})
export class ItemModule {}
