import { propsKey } from './constants';
import { Schema } from './schema';
import { open, type Constructor } from './types';
import { getMapFrom } from './utils';

export class Serializable {
	public toJSON<T = any>(): T {
		const data = {};

		const map = getMapFrom(
			this.constructor,
			`No property data found. Did you decorate the class \`${this.constructor.name}\` with \`@Entity\`?`,
		);

		map.forEach((schema) => {
			const current = open(this)[schema.name];
			const value = schema.serialize(current);

			Object.assign(data, {
				[schema.from]: value,
			});
		});

		return data as T;
	}

	public static from<T>(this: Constructor<T>, data: Record<string, any>): T {
		const map = getMapFrom(
			this,
			`No property data found. Did you decorate the class \`${this.name}\` with \`@Entity\`?`,
		);

		const entity = new this();

		for (const schema of map.values()) {
			if (schema.from in data) {
				const value = schema.deserialize(data[schema.from]);
				Object.assign(open(entity), { [schema.name]: value });
			}
		}

		return entity;
	}

	public static many<T>(
		this: Constructor<T>,
		array: Record<string, any>[],
	): T[] {
		return array.map((data) => open(this).from(data));
	}
}
