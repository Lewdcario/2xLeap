import type { Config } from 'jest';

import baseConfig from '../jest.config';

export default async (): Promise<Config> => {
	return {
		...baseConfig,
		rootDir: '.',
		testRegex: '.e2e-spec.ts$'
	};
};
