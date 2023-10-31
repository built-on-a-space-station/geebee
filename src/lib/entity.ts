import { entityKey, propsKey } from './constants';
import { Schema } from './schema';




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



