import { entityKey } from './constants';
import { Constructor, open } from './types';

type SerializerFn = (...data: any[]) => any;
export type Serializer = SerializerFn | Constructor<any>;

export type Require = Constructor<Error> | ((message: string) => void) | false;

export class Schema {
	private deserializeArray = false;
	private serializeArray = false;
	private serializer: Serializer;
	private deserializer: Serializer;

	public require: Require = false;

	constructor(
		public name: string,
		public from: string,
		deserializer: Serializer | [Serializer],
		serializer?: Serializer | [Serializer],
	) {
		if (Array.isArray(deserializer)) {
			this.deserializeArray = true;
			this.deserializer = deserializer[0];
		} else {
			this.deserializer = deserializer;
		}

		if (!serializer) {
			serializer = deserializer;
		}

		if (Array.isArray(serializer)) {
			this.serializeArray = true;
			this.serializer = serializer[0];
		} else {
			this.serializer = serializer;
		}

		if (!this.deserializer) {
			throw new Error(`No array type provided for property: ${name}`);
		}
	}

	deserialize(value: any) {
		if (!this.deserializeArray) {
			return this.deserializeWith(value);
		}

		if (!Array.isArray(value)) {
			throw new Error(
				`Non-array value provided for array type serializer: ${this.name}`,
			);
		}

		return value.map((data) => this.deserializeWith(data));
	}

	serialize(value: any) {
		if (!this.serializeArray) {
			return this.serializeWith(value);
		}

		if (!Array.isArray(value)) {
			throw new Error(
				`Non-array value provided for array type serializer: ${this.name}`,
			);
		}

		return value.map((data) => this.serializeWith(data));
	}

	private deserializeWith(value: any) {
		if (value === null || value === undefined) {
			if (this.require === Error) {
				throw new Error(
					`Value \`${value}\` received for required field '${this.name}'`,
				);
			}

			if (typeof this.require === 'function') {
				open(this.require)(value);
			}
		}

		if (this.isEntity()) {
			return open(this.deserializer).from(value);
		}

		if (typeof this.deserializer === 'function') {
			return open(this.deserializer)(value);
		}

		throw new Error(
			`Invalid type provided to deserializer: ${this.deserializer}`,
		);
	}

	private serializeWith(value: any) {
		if (this.isEntity()) {
			return value.toJSON();
		}

		if (typeof this.serializer === 'function') {
			return open(this.serializer)(value);
		}

		throw new Error(`Invalid type provided to serializer: ${this.serializer}`);
	}

	private isEntity() {
		return entityKey in this.serializer;
	}
}
