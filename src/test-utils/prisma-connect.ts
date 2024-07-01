// https://github.com/prisma/prisma/issues/732#issuecomment-1936574234

import { PrismaClient } from '@prisma/client';

// https://github.com/sindresorhus/execa/issues/489
// import { $ } from 'execa';
import execa from 'execa';
import { env } from 'process';

export async function newDB(name) {
	const dbUrl = `file:${name}?mode=memory&cache=shared`;
	env.DATABASE_URL = dbUrl;
	const prisma = new PrismaClient();
	await execa.command(`prisma db push --schema ./src/database/schema.prisma --skip-generate --force-reset --accept-data-loss`);
	return prisma;
}

/*
const prisma = await newDB('test');
const prisma2 = await newDB('test2');

export async function main() {
	await prisma.user.create({
		data: {
			name: 'Bob',
			email: 'bob@prisma.io'
		}
	});
	const users = await prisma.user.findMany();
	console.log(users);
	const users2 = await prisma2.user.findMany();
	console.log(users2);
}

main()
	.then(async () => {
		await prisma.$disconnect();
		await prisma2.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		await prisma2.$disconnect();
		process.exit(1);
	});
*/
