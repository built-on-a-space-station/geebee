import { Schema } from './schema';
import { propsKey} from './constants'

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
