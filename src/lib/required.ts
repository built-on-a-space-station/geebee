import { Require } from './schema';
import { ensureMapOn } from './utils';

export function Required(require: Require = Error) {
	return (prototype: any, name: string) => {
		const map = ensureMapOn(prototype);
		const schema = map.get(name);

		if (!schema) {
			throw new Error(
				`\`@Required\` decorator for ${prototype.name}.${name} must follow @Property`,
			);
		}

		schema.require = require;
	};
}
