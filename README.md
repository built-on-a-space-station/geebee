# Geebee

_Easy, breezy data entities just the way you like it._

## Overview

Say you have a ~~`User`~~ `Airplane` entity in your app! The data for said airplane likely comes from a server. Or maybe it doesn't. Either way, you probably have something like:

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
pnpm add @space-station/geebee
```

Geebee requires Typescript with experimental decorators enabled:

```shell
pnpm add -D typescript
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
const airplane = Airplane.from({
	name: 'Spruce Goose',
	speed: 235,
	isFlying: false,
});

airplane.isSupersonic;
// false
```
