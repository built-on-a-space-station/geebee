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
