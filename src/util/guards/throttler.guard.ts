import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';

// Source: https://stackoverflow.com/questions/70626423/nest-js-throttler-with-graphql-is-not-working-as-expected
@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
	getRequestResponse(context: ExecutionContext) {
		const ctx = GqlExecutionContext.create(context).getContext();
		return { req: ctx.req, res: ctx.req?.res ?? ctx.res };
	}

	protected async getTracker(req: Record<string, any>): Promise<string> {
		return req.ip;
	}
}
