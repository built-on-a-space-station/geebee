import { Entity } from '../entity';
import { Property } from '../property';
import { Serializable } from '../serializable';

it('creates an instance of a class', () => {
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
