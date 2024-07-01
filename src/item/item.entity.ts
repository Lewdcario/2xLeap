import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';

@ObjectType()
export class Item {
	@Field(() => ID)
	id: number;

	@Field()
	title: string;

	@Field()
	description: string;

	@Field()
	completed: boolean;

	@Field()
	deleted: boolean;

	@Field()
	priority: string;
}

@InputType()
export class CreateItemInput {
	@Field()
	title: string;

	@Field()
	description: string;

	@Field()
	completed: boolean;

	@Field()
	deleted: boolean;

	@Field()
	priority: string;
}

@InputType()
export class UpdateItemInput {
	@Field({ nullable: true })
	title?: string;

	@Field({ nullable: true })
	description?: string;

	@Field({ nullable: true })
	completed?: boolean;

	@Field({ nullable: true })
	deleted?: boolean;

	@Field({ nullable: true })
	priority?: string;
}
