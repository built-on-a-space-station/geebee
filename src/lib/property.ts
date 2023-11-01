import { Schema, Serializer } from './schema';
import { ensureMapOn } from './utils';

export function Property(
	from: string,
	deserializer: Serializer | [Serializer],
	serializer?: Serializer | [Serializer],
) {
	return (prototype: any, name: string) => {
		const schema = new Schema(name, from, deserializer, serializer);

		const map = ensureMapOn(prototype);

		map.set(name, schema);
	};
}
