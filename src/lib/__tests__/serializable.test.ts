import { Serializable } from '../serializable';

it('throws an error if the prop map does not exist', () => {
	expect(() => Serializable.from({})).toThrow();
});
