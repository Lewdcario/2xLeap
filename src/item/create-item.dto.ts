import { z } from 'zod';

export class CreateItemDTO {
  	title: string;
	description: string;
	priority: string;
	completed = false;
	deleted = false;

	constructor(title?: string, description?: string, priority?: string) {
		if (title) this.title = title;
		if (description) this.description = description;
		if (priority) this.priority = priority;
	}
}

export const CreateItemSchema = z.object({
	title: z.string(),
	description: z.string().optional(),
	priority: z.string(),
	completed: z.boolean().optional(),
	deleted: z.boolean().optional()
});

export type CreateItemSchemaType = z.infer<typeof CreateItemSchema>;
