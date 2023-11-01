import { Schema } from './schema';
import { ensureMapOn } from './utils';

export function Property(from: string, type: any) {
	return (prototype: any, name: string) => {
		const schema = new Schema(name, from, type);

		const map = ensureMapOn(prototype);

		map.set(name, schema);
	};
}
