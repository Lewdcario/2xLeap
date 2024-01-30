import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Item {
	@PrimaryGeneratedColumn()
		id: number;

	@Column({ length: 100 })
		title: string;

	@Column('text')
		description: string;

	@Column()
		completed: boolean;

	@Column()
		deleted: boolean;

	@Column({ length: 10 })
		priority: string;
}
