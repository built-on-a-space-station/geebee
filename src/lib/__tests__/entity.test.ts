import { Entity, Property, Serializable } from '../entity';

it('creates an instance of a class', () => {
	@Entity
	class User extends Serializable {
		@Property('first_name', String)
		public firstName: string = '';

		@Property('last_name', String)
		public lastName: string = '';
	}

	const user = User.load({ first_name: 'Tony', last_name: 'Stark' });

	expect(user).toBeInstanceOf(User);
	expect(user).toMatchObject({
		firstName: 'Tony',
		lastName: 'Stark',
	});
});
