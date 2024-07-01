import type { Config } from 'jest';

import { readFile } from 'fs/promises';

export default async (): Promise<Config> => {
	const config = JSON.parse(await readFile(`${__dirname}/.swcrc`, { encoding: 'utf-8' }));

	return {
		moduleFileExtensions: ['js', 'json', 'ts'],
		rootDir: 'src',
		testRegex: '.*\\.spec\\.ts$',
		transform: {
			'^.+\\.(t|j)s$': [
				'@swc/jest',
				{
					...config
				}
			]
		},
		collectCoverageFrom: ['**/*.(t|j)s'],
		coverageDirectory: '../coverage',
		testEnvironment: 'node',
		moduleNameMapper: {
			'^(\\.{1,2}/.*)\\.js$': '$1'
		}
	};
};
