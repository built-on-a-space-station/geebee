import { entityKey } from './constants';
import { Constructor } from './types';

type SerializerFn = (...data: any[]) => any;
type Serializer = SerializerFn | Constructor<any>;

export class Schema {
	private asArray = false;
	private type: Serializer;

	constructor(
		public name: string,
		public from: string,
		type: Serializer | [Serializer],
	) {
		if (Array.isArray(type)) {
			this.asArray = true;
			this.type = type[0];
		} else {
			this.type = type;
		}

		if (!this.type) {
			throw new Error(`No array type provided for property: ${name}`);
		}
	}

	deserialize(value: any) {
		if (!this.asArray) {
			return this.deserializeWith(value);
		}

		if (!Array.isArray(value)) {
			throw new Error(
				`Non-array value provided for array type serializer: ${this.name}`,
			);
		}

		return value.map((data) => this.deserializeWith(data));
	}

	private deserializeWith(value: any) {
		if (entityKey in this.type) {
			return (this.type as any).from(value);
		}

		if (typeof this.type === 'function') {
			return (this.type as any)(value);
		}

		throw new Error(`Invalid type provided to deserializer: ${this.type}`);
	}
}
