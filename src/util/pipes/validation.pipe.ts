import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodSchema  } from 'zod';

@Injectable()
export class ValidatePositiveIntPipe implements PipeTransform {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	transform(value: any, _metadata: ArgumentMetadata) {
		const id = parseInt(value, 10);

		if (isNaN(id) || id < 1) {
			throw new BadRequestException('Invalid ID. ID must be a positive number.');
		}

		return id;
	}
}

export class ZodValidationPipe implements PipeTransform {
	constructor(private schema: ZodSchema) {}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	transform(value: unknown, _metadata: ArgumentMetadata) {
		try {
			const parsedValue = this.schema.parse(value);
			return parsedValue;
		}
		catch (error) {
			throw new BadRequestException('Validation failed');
		}
	}
}
