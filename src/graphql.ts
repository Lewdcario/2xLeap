
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreateItemInput {
    title: string;
    description: string;
    completed: boolean;
    deleted: boolean;
    priority: string;
}

export class UpdateItemInput {
    title?: Nullable<string>;
    description?: Nullable<string>;
    completed?: Nullable<boolean>;
    deleted?: Nullable<boolean>;
    priority?: Nullable<string>;
}

export class Item {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    deleted: boolean;
    priority: string;
}

export abstract class IQuery {
    abstract getItem(id: string): Nullable<Item> | Promise<Nullable<Item>>;

    abstract getItems(): Nullable<Nullable<Item>[]> | Promise<Nullable<Nullable<Item>[]>>;
}

export abstract class IMutation {
    abstract createItem(input: CreateItemInput): Nullable<Item> | Promise<Nullable<Item>>;

    abstract updateItem(id: string, input: UpdateItemInput): Nullable<Item> | Promise<Nullable<Item>>;

    abstract deleteItem(id: string): Nullable<boolean> | Promise<Nullable<boolean>>;

    abstract completeItem(id: string): Nullable<Item> | Promise<Nullable<Item>>;
}

type Nullable<T> = T | null;
