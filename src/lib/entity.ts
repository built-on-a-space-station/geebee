const propsKey = Symbol('properties');
const entityKey = Symbol('entity');

class Schema {
	constructor(
		public name: string,
		public from: string,
		private type: any,
	) {}

	deserialize(value: any) {
		if (typeof this.type === 'function') {
			return this.type(value);
		}

		if (entityKey in this.type) {
			return this.type.load(value);
		}

		throw new Error(`Invalid type provided to deserializer: ${this.type}`);
	}
}

export function Entity(ctor: any) {
	if (!(entityKey in ctor)) {
		Object.defineProperty(ctor, entityKey, {
			value: true,
			writable: false,
		});
	}

	if (!(ctor[propsKey] instanceof Map)) {
		Object.defineProperty(ctor, propsKey, {
			value: new Map<string, Schema>(),
			writable: false,
		});
	}

	const source = ctor.prototype[propsKey] as Map<string, Schema>;

	if (!(source instanceof Map)) {
		return;
	}

	const map = ctor[propsKey] as Map<string, Schema>;

	source.forEach((schema, name) => {
		map.set(name, schema);
	});

	source.clear();
}

export function Property(from: string, type: any) {
	return (prototype: any, name: string) => {
		const schema = new Schema(name, from, type);

		if (!(prototype[propsKey] instanceof Map)) {
			Object.defineProperty(prototype, propsKey, {
				value: new Map<string, Schema>(),
				writable: false,
			});
		}

		prototype[propsKey].set(name, schema);
	};
}

export class Serializable {
	toJSON() {
		console.log('to JSON', this);
	}

	public static load(data: Record<string, any> = {}) {
		const map = (this as any)[propsKey] as Map<string, Schema>;

		if (!map) {
			throw new Error(
				`No property data found. Did you decorate the class \`${this.name}\` with \`@Entity\`?`,
			);
		}

		const entity = new this();

		for (const schema of map.values()) {
			if (schema.from in data) {
				const value = schema.deserialize(data[schema.from]);
				Object.assign(entity, { [schema.name]: value });
			}
		}

		return entity;

		// map.forEach((key: string, schema: Schema) => {
		//   Object.assign(entity, { [key]: })

		//   console.log("key", key);
		//   console.log("schema", schema);
		// });
	}

	public static new(data: Record<string, any> = {}) {
		//
	}
}

// @Entity
// class Book extends Loadable {
//   @Property("name", String)
//   public name: string = "";
// }

@Entity
class User extends Serializable {
	@Property('first_name', String)
	public firstName: string = '';

	@Property('last_name', String)
	public lastName: string = '';
}

const user = User.load();

// add the properties to the prototype
// on decorate class, move all properties to class
// on instantiate, iterate over data and add to

// problem is that the class properties are set after
