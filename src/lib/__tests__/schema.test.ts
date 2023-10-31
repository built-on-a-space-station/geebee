import { Schema } from '../schema';

it('deserializes primitive values', () => {
	const schema = new Schema('name', 'name', String);

	expect(schema.deserialize('test')).toBe('test');
	expect(schema.deserialize(1)).toBe('1');
});

it('deserializes array values', () => {
	const schema = new Schema('name', 'name', [String]);

	expect(schema.deserialize(['a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
	expect(schema.deserialize([1, 2, 3])).toEqual(['1', '2', '3']);
});

it('serializes primitive values', () => {
	const schema = new Schema('name', 'name', String);

	expect(schema.serialize('test')).toBe('test');
	expect(schema.serialize(1)).toBe('1');
});

it('serializes array values', () => {
	const schema = new Schema('name', 'name', [String]);

	expect(schema.serialize(['a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
	expect(schema.serialize([1, 2, 3])).toEqual(['1', '2', '3']);
});

it('throws an error if provided a non array value as an array type', () => {
	const schema = new Schema('name', 'name', [String]);

	expect(() => schema.deserialize(1)).toThrow();
});

it('throws an error if not provided a primitive serializer', () => {
	expect(() => new Schema('name', 'name', null as any)).toThrow();
});

it('throws an error if not provided an array', () => {
	expect(() => new Schema('name', 'name', [null as any])).toThrow();
});

it('throws an error if attempting to deserialize with an invalid serializer', () => {
	const schema = new Schema('name', 'name', {} as any);

	expect(() => schema.deserialize('test')).toThrow();
});
