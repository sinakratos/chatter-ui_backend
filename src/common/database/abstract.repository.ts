import { Logger, NotFoundException } from '@nestjs/common';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';

import { AbstractEntity } from './abstract.entity';

export abstract class AbstractRepository<T extends AbstractEntity> {
	protected abstract readonly logger: Logger;

	constructor(protected readonly model: Model<T>) {}

	async create(document: Omit<T, '_id'>): Promise<T> {
		const createDocument = new this.model({
			...document,
			_id: new Types.ObjectId(),
		});
		return ((await createDocument.save()).toJSON() as unknown) as T;
	}

	async findOne(filterQuery: FilterQuery<T>) {
		const document = await this.model.findOne(
			filterQuery,
			{},
			{ lean: true }
		);

		if (!document) {
			this.logger.warn(
				'Document was not found with filterQuery',
				filterQuery
			);
			throw new NotFoundException('Document not found.');
		}

		return document;
	}

	async findOneAndUpdate(
		filterQuery: FilterQuery<T>,
		update: UpdateQuery<T>
	) {
		const document = await this.model.findOneAndUpdate(
			filterQuery,
			update,
			{
				lean: true,
				new: true,
			}
		);

		if (!document) {
			this.logger.warn(
				'Document was not found with filterQuery',
				filterQuery
			);
			throw new NotFoundException('Document not found.');
		}

		return document;
	}

	async find(filterQuery: FilterQuery<T>) {
		return this.model.find(filterQuery, {}, { lean: true });
	}

	async findOneAndDelete(filterQuery: FilterQuery<T>) {
		return this.model.findOneAndDelete(filterQuery, { lean: true });
	}
}
