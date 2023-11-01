# Geebee

_Easy, breezy data entities just the way you like it._

## Overview

Say you have an ~~`User`~~ `Airplane` entity in your app! The data for said airplane likely comes from a server. Or maybe it doesn't. Either way, you probably have something like:

```typescript
const airplane = {
	speed: 150,
	color: 'red',
	make: 'Gee Bee',
	model: 'R2',
};
```

i.e. raw JSON data that is used to display and mutate data. This is troublesome as there's no inherent validation. There's no calculated values. You also might have something like:

```typescript
const airplane = {
	jet_speed: 600,
	is_supersonic: true,
	name: 'Bell Orange Thing',
};
```

Snake case in your JavaScript!? Yuck!

Wouldn't it be great if you could use _JavaScript classes_ to wrap and handle logic within these entities? Something to handle the fact that server data might not be formatted exactly in the way you want? Well, with **Geebee** you can!

## Installation

```shell
npm install @space-station/geebee
```

Geebee requires TypeScript with experimental decorators enabled:

```shell
npm install -D typescript
```

```json
{
	"compilerOptions": {
		"experimentalDecorators": true
	}
}
```

## Basic Usage

Create a class to define your data model. Then, decorate and extend the class to add all of geebee's functionality

```typescript
import { Entity, Property, Serializable } from '@space-station/geebee';

@Entity
class Airplane extends Serializable {
	@Property('name', String)
	public name = '';

	@Property('speed', Number)
	public speed = 0;

	@Property('isFlying', Boolean)
	private isFlying = false;

	public get isSupersonic() {
		return this.speed > 500;
	}
}
```

Now load its values during construction:

```typescript
const airplane = Airplane.new({
	name: 'Spruce Goose',
	speed: 235,
	isFlying: false,
});

airplane.isSupersonic;
// false
```

Supersonic? Super cool!

Then, when you need to convert the model back to JSON to send in an API request or something similar, just call `.toJSON()`.

```typescript
airplane.toJSON();
// { name: 'Spruce Goose', speed: 235, isFlying: false }
```

## Conversion from JSON

When decorating a `Property` you specify the data source key and a serializer used to convert the data. Then, use the `.from` method (instead of `.new`) to convert the JSON object.

```typescript
const data = { call_sign: 'N162142' };

@Entity
class Airplane extends Serializable {
	@Property('call_sign', String)
	public callSign = '';
}

const airplane = Airplane.from(data);
// Airplane { callSign: 'N162142' }
```

## Required Properties

Mark a property as `@Required` and it will fail parsing from JSON if the field is `null` or not present.

```typescript
import { Required } from '@space-station/geebee';

@Entity
class Airplane extends Serializable {
	@Property('name', String)
	@Required(Error)
	public name = '';

	@Property('speed', Number)
	public speed: number | null = null;
}

const airplane = Airplane.from({ speed: 200 });
// Error
```

You can pass an option to `@Required` to control how `null` or absent values are handled:

| Type                            | Description                                                        |
| ------------------------------- | ------------------------------------------------------------------ |
| `Error` or descendant (default) | Will throw the error with a detailed error message                 |
| Any other function              | Will call the function with a detailed error message               |
| `null`                          | Will invalidate the entity and return `null` for the entire object |
| `false`                         | No validation will be performed and the default value will be used |

## Features Added for 1.0 Release

- Error specification
- Advanced serialization
- Object factories
