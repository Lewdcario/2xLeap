// import { getConnection } from 'typeorm';
// import { Item } from '../item/item.entity';

import { readFileSync } from 'fs';
import { join } from 'path';
import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client/core';
import fetch from 'cross-fetch';

const client = new ApolloClient({
	link: new HttpLink({ uri: 'http://localhost:3000/graphql', fetch, headers: { Authorization: `Bearer ${process.env.API_KEY}` } }),
	cache: new InMemoryCache()
});

const readGraphQLFile = (filePath: string): string => {
	return readFileSync(join(__dirname, filePath), 'utf-8');
};

const createItem = async (variables: Record<string, any>) => {
	const mutation = gql`
		${readGraphQLFile('../item/create-item.graphql')}
	`;
	const response = await client.mutate({ mutation, variables });
	console.log('Seeding complete', response.data);
};

const seed = async () => {
	await createItem({
		input: {
			title: 'Test Item 1',
			description: 'Test Description 1',
			priority: 'low',
			completed: false,
			deleted: false
		}
	});

	await createItem({
		input: {
			title: 'Test Item 2',
			description: 'Test Description 2',
			priority: 'medium',
			completed: false,
			deleted: false
		}
	});

	await createItem({
		input: {
			title: 'Test Item 3',
			description: 'Test Description 3',
			priority: 'high',
			completed: false,
			deleted: false
		}
	});

	await createItem({
		input: {
			title: 'Test Item 4',
			description: 'Test Description 4',
			priority: 'low',
			completed: false,
			deleted: true
		}
	});

	await createItem({
		input: {
			title: 'Test Item 5',
			description: 'Test Description 5',
			priority: 'medium',
			completed: true,
			deleted: false
		}
	});
};

seed();
