import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateItemDTO {
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
