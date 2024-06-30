import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class GqlCacheInterceptor implements NestInterceptor {
	constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

	async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
		const ctx = GqlExecutionContext.create(context);
		const key = this.generateCacheKey(ctx);
		const cachedResponse = await this.cacheManager.get(key);

		if (cachedResponse) {
			return of(cachedResponse);
		}

		return next.handle().pipe(
			tap((response) => {
				this.cacheManager.set(key, response, 300);
			})
		);
	}

	generateCacheKey(ctx: GqlExecutionContext): string {
		const info = ctx.getInfo();
		const parentTypeName = info.parentType.name;
		const fieldName = info.fieldName;
		const args = JSON.stringify(ctx.getArgs());

		return `${parentTypeName}-${fieldName}-${args}`;
	}
}
