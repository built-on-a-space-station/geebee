import { Entity } from '../entity';
import { Property } from '../property';
import { Required } from '../required';

it('throws an error if applied without @Property', () => {
	expect(() => {
		@Entity
		class User {
			@Required()
			name = '';
		}
	}).toThrow();
});

it('throws an error if applied before @Property', () => {
	expect(() => {
		@Entity
		class User {
			@Property('name', String)
			@Required()
			name = '';
		}
	}).toThrow();
});

it('does not throw an error if applied before @Property', () => {
	expect(() => {
		@Entity
		class User {
			@Required()
			@Property('name', String)
			name = '';
		}
	}).not.toThrow();
});
