import { SetMetadata } from '@nestjs/common';

export const ITEM_REPOSITORY = 'ITEM_REPOSITORY';
export const DATA_SOURCE = 'DATA_SOURCE';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
