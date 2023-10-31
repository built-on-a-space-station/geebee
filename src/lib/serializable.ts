import { Schema } from './schema';

type Constructor<T> = { new (): T }

export class Serializable {
	public static from<T>(this: Constructor<T>, data: Record<string, any>): T {
		const map = (this as any)[propsKey] as Map<string, Schema>;

		if (!map) {
			throw new Error(
				`No property data found. Did you decorate the class \`${this.name}\` with \`@Entity\`?`,
			);
		}

		const entity = new this();

		for (const schema of map.values()) {
			if (schema.from in data) {
				const value = schema.deserialize(data[schema.from]);
				Object.assign(entity as any, { [schema.name]: value });
			}
		}

		return entity;
	}

  public static many
  <T>(this: Constructor<T>, array: Record<string, any>[]): T[] {
    return array.map(data => (this as any).from(data))
  }
}
