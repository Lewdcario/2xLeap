import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CacheModule, CacheInterceptor  } from '@nestjs/cache-manager';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemModule } from './item/item.module';
import { Item } from './item/item.entity';
import { AuthGuard } from './auth/auth.guard';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'sqlite',
			database: ':memory:',
			synchronize: process.env.ENV === 'local',
			entities: [Item]
		}),
		ItemModule,
		CacheModule.register(),
		ThrottlerModule.forRoot([{
			ttl: 60000,
			limit: 10
		}])
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_INTERCEPTOR,
			useClass: CacheInterceptor
		},
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard
		},
		{
			provide: APP_GUARD,
			useClass: AuthGuard
		}
	]
})
export class AppModule {}
