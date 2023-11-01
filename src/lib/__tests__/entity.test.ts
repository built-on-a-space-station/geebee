import { Entity } from '../entity';
import { Property } from '../property';
import { Required } from '../required';
import { Serializable } from '../serializable';

it('does nothing if the map source is not found', () => {
	class User {}

	expect(Entity(User)).toBeUndefined();
});

it('creates a new instance', () => {
	@Entity
	class User extends Serializable {
		@Property('firstName', String)
		public firstName: string = '';
	}

	const user = User.new({ firstName: 'Tony' });

	expect(user).toBeInstanceOf(User);
	expect(user).toEqual({
		firstName: 'Tony',
	});
});

it('creates an instance of a class from data', () => {
	@Entity
	class User extends Serializable {
		@Property('first_name', String)
		public firstName: string = '';

		@Property('last_name', String)
		public lastName: string = '';
	}

	const user = User.from({ first_name: 'Tony', last_name: 'Stark' });

	expect(user).toBeInstanceOf(User);
	expect(user).toEqual({
		firstName: 'Tony',
		lastName: 'Stark',
	});
});

it('creates an instance with a nested record', () => {
	@Entity
	class Post extends Serializable {
		@Property('name', String)
		public name: string = '';
	}

	@Entity
	class User extends Serializable {
		@Property('post', Post)
		public post: Post = new Post();
	}

	const user = User.from({ post: { name: 'A Post' } });

	expect(user).toBeInstanceOf(User);
	expect(user.post).toBeInstanceOf(Post);
	expect(user).toEqual({
		post: {
			name: 'A Post',
		},
	});
});

it('creates an array of instances', () => {
	@Entity
	class User extends Serializable {
		@Property('name', String)
		public name = '';
	}

	const data = [{ name: 'User 1' }, { name: 'User 2' }];
	const users = User.many(data);

	expect(users).toBeInstanceOf(Array);

	users.forEach((user, i) => {
		expect(user).toBeInstanceOf(User);
		expect(user).toEqual(data[i]);
	});
});

it('loads an array of data', () => {
	@Entity
	class User extends Serializable {
		@Property('names', [String])
		public names: string[] = [];
	}

	const user = User.from({ names: ['Cat', 'Dog'] });

	expect(user).toBeInstanceOf(User);
	expect(user.names).toEqual(['Cat', 'Dog']);
});

it('serializes to JSON', () => {
	@Entity
	class User extends Serializable {
		@Property('first_name', String)
		public firstName = '';
	}

	const user = User.from({ first_name: 'Ted' });

	expect(user).toEqual({ firstName: 'Ted' });
	expect(user.toJSON()).toEqual({ first_name: 'Ted' });
});

it('serializes entity properties', () => {
	@Entity
	class Pet extends Serializable {
		@Property('pet_name', String)
		public petName = '';
	}

	@Entity
	class User extends Serializable {
		@Property('first_name', String)
		public firstName = '';

		@Property('pet', Pet)
		public pet = new Pet();
	}

	const user = User.from({ first_name: 'Ted', pet: { pet_name: 'Rover' } });

	expect(user.pet).toBeInstanceOf(Pet);

	const json = user.toJSON();

	expect(json.pet).not.toBeInstanceOf(Pet);
	expect(json).toEqual({ first_name: 'Ted', pet: { pet_name: 'Rover' } });
});

it('throws an error if a required property does not exist', () => {
	@Entity
	class Pet extends Serializable {
		@Required()
		@Property('name', String)
		public name = '';
	}

	expect(() => Pet.from({})).toThrow();
});

it('throws an error if a required property is null', () => {
	@Entity
	class Pet extends Serializable {
		@Required()
		@Property('name', String)
		public name = '';
	}

	expect(() => Pet.from({ name: null })).toThrow();
});

it('executes a function for a missing required property', () => {
	const fn = jest.fn();

	@Entity
	class Pet extends Serializable {
		@Required(fn)
		@Property('name', String)
		public name = '';
	}

	expect(() => Pet.from({ name: null })).not.toThrow();
	expect(fn).toHaveBeenCalledTimes(1);
});
