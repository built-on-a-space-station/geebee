import { propsKey } from './constants';
import { Schema } from './schema';
import { open } from './types';

export const getMapFrom = (
	target: any,
	error?: string,
): Map<string, Schema> => {
	const map = open(target)[propsKey];

	if (!(map instanceof Map)) {
		throw new Error(error);
	}

	return map;
};

export const ensureMapOn = (target: any): Map<string, Schema> => {
	if (!(target[propsKey] instanceof Map)) {
		Object.defineProperty(target, propsKey, {
			value: new Map<string, Schema>(),
			writable: false,
		});
	}

	return target[propsKey];
};
