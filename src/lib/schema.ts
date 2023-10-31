import { entityKey } from './constants';

export class Schema {
	private asArray = false;
	private type: any;

	constructor(
		public name: string,
		public from: string,
		type: any,
	) {
		if (Array.isArray(type)) {
			this.asArray = true;
			this.type = type[0];

			if (!this.type) {
				throw new Error(`No array type provided for property: ${name}`);
			}
		} else {
			this.type = type;
		}
	}

	deserialize(value: any) {
		if (this.asArray) {
			if (!Array.isArray(value)) {
				throw new Error(
					`Non-array value provided for array type serializer: ${this.name}`,
				);
			}

			return value.map((data) => this.deserializeWith(data));
		}

		return this.deserializeWith(value);
	}

	private deserializeWith(value: any) {
		if (entityKey in this.type) {
			return this.type.from(value);
		}

		if (typeof this.type === 'function') {
			return this.type(value);
		}

		throw new Error(`Invalid type provided to deserializer: ${this.type}`);
	}
}
