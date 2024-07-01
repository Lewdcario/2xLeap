import { join } from 'path';

import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemModule } from './item/item.module';
// import { Item } from './item/item.entity';
import { AuthGuard } from './auth/auth.guard';
import { GqlCacheInterceptor } from './util/interceptors/gql-cache.interceptor';
import { GqlThrottlerGuard } from './util/guards/throttler.guard';

import configuration from './config/env';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
		/*
		TypeOrmModule.forRoot({
			type: 'sqlite',
			database: ':memory:',
			synchronize: process.env.ENV === 'local',
			entities: [Item]
		}),
		*/
		ItemModule,
		CacheModule.register(),
		ThrottlerModule.forRoot([
			{
				ttl: 60000,
				limit: 10
			}
		]),
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			typePaths: ['./**/*.graphql'],
			definitions: {
				path: join(process.cwd(), 'src/graphql.ts'),
				outputAs: 'class'
			},
			// https://github.com/nestjs/throttler/issues/1437#issuecomment-1495784158
			context: (request, reply) => ({ req: request, res: reply })
		})
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_INTERCEPTOR,
			useClass: GqlCacheInterceptor
		},
		{
			provide: APP_GUARD,
			useClass: GqlThrottlerGuard
		},
		{
			provide: APP_GUARD,
			useClass: AuthGuard
		}
	]
})
export class AppModule {}
