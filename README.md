
[Framework](#Framework)
[Features](#Features)
[Installing](#Installing)
[Importing](#Importing)
[Example](#Example)
[Working principle and Precautions](#Working_principle_and_Precautions)
[Documentation](#)


<!-- ------------------------ ECSTATE ------------------------ -->


# ECState

**ECState** is the fastest lightweight [ECS](https://wikipedia.org/wiki/Entity_component_system) *(Entity Component System)* framework with a minimalistic API, working on archetypes and written in JavaScript.

Based on JavaScript tests, the way of processing data in the form of *struct of arrays* ([SOA](https://en.wikipedia.org/wiki/AoS_and_SoA)) is up to 30% faster than an *array of structures* (AOS), although it is not a *cache-friendly* way of iterating, as in most native C-like languages.

Also, this approach adds flexibility in handling the components of the created application.


<!-- ------------------------ FEATURES ------------------------ -->


## Features

- Simple <a href="https://simple.wikipedia.org/wiki/KISS_(principle)">KISS</a>-like API.
- Framework agnostic.
- Entity is just a numeric identifier.
- Archetypes and queries are generated automatically in realtime.
- Iterative queries and switching entities between archetypes are cached for better performance.
- The implementation of the systems remains at the discretion of the developer, since methods and patterns of organizing business logic for each project are different.


<!-- ------------------------ INSTALLING ------------------------ -->


## Installing

You can install the framework using the `npm` package manager:

```
npm install ecstate -g
```


<!-- ------------------------ IMPORTING ------------------------ -->


## Importing

ES6 framework import looks like this:

```javascript
import { ECState } from 'ecstate';
```

the same as:

```javascript
import { ECState } from 'ecstate/build/ecstate.module.js';
```

or you can use the [UMD](https://github.com/umdjs/umd/) module:

```javascript
var { ECState } = require('ecstate/build/ecstate.umd.js');
```

If you want to use the framework in a browser without a bundler, you can copy `ecstate/build/ecstate.umd.js` to your project folder and include it directly in html:


```html
<script src="./ecstate.umd.js"></script>
<script>
	var { ECState } = ECState; // ECState is an object that contains the necessary functions constructors, including ECState constructor.
</script>
```


<!-- ------------------------ EXAMPLE ------------------------ -->


## Example

```javascript

import { ECState } from 'ecstate';


/* ----------- COMPONENTS ----------- */


function Transform()
{
	this.position = { x: 0, y: 0, z: 0 };
}


function Body()
{
	this.mass = 10;
	this.static = false;
	this.velocity = { x: 0, y: 0, z: 0 };
}


function Collider()
{
	this.radius = 50;
	this.collide = false;
}


/* ----------- INIT ----------- */


var state = new ECState;


/* ----------- ENTITIES ----------- */


// all framework functions take component constructor functions as arguments, not already instantiated objects

var id1 = state.addEntity(Transform); // creates an entity with one component (return integer number: 0)
var id2 = state.addEntity(Transform, Body, Collider); // creates an entity with three components (return integer number: 1)
var id3 = state.addEntity(); // creates an empty entity (return integer number: 2)

var result4 = state.addComponent(id1, Body, Collider); // adds two components to the entity (return "true")
var result5 = state.removeComponent(id2, Body, Collider); // removes two components from an entity (return "true")


var body1 = state.getComponent(id1, Body); // return Body component instance

body1.mass = 10;

body1.velocity.x = 20;
body1.velocity.y = 20;
body1.velocity.z = 20;


var body2 = state.getComponent(id2, Body); // return "null", because this entity no longer has Body component


// after deleting entities, their ids are freed and will be automatically reused by the framework for new entities

state.removeEntity(id1); // return "true"
state.removeEntity(id1); // return "false", because this entity has already been removed

state.addEntity(Transform, Body, Collider); // return 0, not 3


/* ----------- QUERY ----------- */


state.query([Transform, Body], function({ Transform: transforms, Body: bodies }, ids)
{
	// The callback is called on every non-empty archetype containing the "Transform" and "Body" component types.
	// For example, if we have 10 entities with (Transform, Body) and 5 entities with (Transform, Body, Collider), then the callback is called 2 times for each archetype.
	// Inside the callback, the user himself iterates over the necessary components using "for".

	for(let i = 0; i < ids.length; i++) // The length of the ids array is always equal to the lengths of the component arrays
	{
		let transform = transforms[i];
		let body = bodies[i];
		let id = ids[i];

		if(body.mass > 0 && body.static === false)
		{
			transform.position.x += body.velocity.x / body.mass;
			transform.position.y += body.velocity.y / body.mass;
			transform.position.z += body.velocity.z / body.mass;
		}
	}
});
```


<!-- ------------------------ WORKING PRINCIPLE AND PRECAUTIONS ------------------------ -->


# `Working principle and Precautions`


<!-- ----------- ARCHETYPES ----------- -->


## Archetypes

All components (i.e. entities) are stored in archetypes. An archetype is a structure of arrays: arrays of components and one array with entity IDs.

For example, let's imagine two archetypes: the first holds entities consisting of two components `Transform` and `Body`, and the second contains entities with only the `Transform` component. This means that the first archetype is an object with 3 arrays: `Transform`, `Body` and `ids`. And the second archetype, respectively - `Transform` and `ids`. The `ids` array is created by the framework and is an auxiliary one - it stores the `id` of entities.

`Each entity has the same index in all arrays of the archetype`.


<!-- ----------- ADDING ENTITIES ----------- -->


## Adding entities

When you create an entity with some components via `addEntity()`, the framework checks if an archetype exists with the same set of component arrays. If not, he creates it. Then it adds new entity components to the end of the arrays of this archetype, and its `id` to the `ids` array. Subsequently, this approach allows you to quickly iterate over the required entities. (In native C-like languages, such iterations are done in a *cache-fiendly* manner, which greatly improves performance)

It should be noted that the entity can be empty, i.e. do not have any components. It is put into an archetype that has only one `ids` array.


<!-- ----------- REMOVING ENTITIES ----------- -->


## Removing entities

When you remove an entity with `removeEntity()`, the framework gets an archetype, which contains the components of the entity specified by `id` and its index in the archetype arrays. Further, in place (index) of this entity in all arrays, the components of the last entity are installed, and also each array is shortened. Then `id` is freed for later reuse.

For example, an entity has 3 components `Transform`,` Body`, `Collider`, which means it is in an archetype with 4 arrays - `Transform`, `Body`, `Collider` and `ids`. Let's say there are 10 entities inside the archetype - this means that the length of each array is 10. However, the entity we are deleting has index 3 in each array. (entity components have the same position in arrays)

To quickly remove an entity at index 3, the framework takes the components at index 10 (i.e. the last entity) and puts them in place 3 in all arrays. Each array is shortened.

`**From this follows the main precaution of the ECS framework working on archetypes:** during an iterative update of components in an archetype, deleting the current or early updated entity will cause the loop to skip the one that will be moved from the end to the place of the deleted one.`


<!-- ----------- MODIFYING ENTITIES ----------- -->


## Modifying entities

When you add or remove components from an entity via `addComponent()` and `removeComponent()`, it is almost the same as when creating a new entity. The framework is looking for an archetype with a new (changed) list of components. If there is no such thing, he creates it. Then he transfers the components from the old archetype to the new one. If the operation of removing components is performed, then the extra ones are simply discarded. If the operation of adding components is performed, they are automatically created during the transfer. In the old archetype, components are simply removed in the manner described in `Removing entities`.


<!-- ------------------------ DOCUMENTATION ------------------------ -->


# Documentation


<!-- ----------- INIT ----------- -->


## Init


```javascript
var state = new ECState;
```


<!-- ----------- ENTITY ----------- -->


## Entity


<!-- addEntity() -->


#### `addEntity(component1 : function, ...) : number`

Creates a new entity and returns its `id`. Component constructor functions are passed as arguments; however, the entity can be empty.


<!-- removeEntity() -->


#### `removeEntity(id : number) : boolean`

Removes an entity by `id`. Returns `true` if the deletion was successful. Returns `false` if the entity with the passed `id` does not exist.

`After deleting entities, their ids are freed and will be automatically reused by the framework for new entities.`


<!-- ----------- COMPONENTS ----------- -->


## Components


<!-- addComponent() -->


#### `addComponent(id : number, component1 : function, ...) : boolean`

Adds components to an entity with the passed `id` whose constructors were passed as arguments. Returns `true` if the addition was successful.


<!-- removeComponent() -->


#### `removeComponent(id : number, component1 : function, ...) : boolean`

Removes entity components with `id` passed in, whose constructors were passed as arguments. Returns `true` if the deletion was successful.


<!-- getComponent() -->


#### `getComponent(id : number, component : function) : [object, null]`

Returns the instance of the entity component with the passed `id`, whose constructor was passed as an argument. If no such component or entity exists, returns `null`.


<!-- ----------- QUERY ----------- -->


## Query


<!-- query() -->


#### `query(components : array, callback : function)`

Iterates over the archetypes containing the specified components. Callback is called provided that the archetype is not empty. (i.e. contains at least one entity)

An array with component constructor functions and callback is passed as an arguments.

The callback passes two arguments: an object with arrays of archetype components, and an array of entity IDs.

`The length of the id array is always equal to the lengths of the component arrays.`

```javascript
state.query([Transform, Body], function(components, ids)
{
	// The callback is called on every non-empty archetype containing the "Transform" and "Body" component types.
	// For example, if we have 10 entities with (Transform, Body) and 5 entities with (Transform, Body, Collider), then the callback is called 2 times for each archetype.
	// Inside the callback, the user himself iterates over the necessary components using "for".

	for(let i = 0; i < ids.length; i++)
	{
		let transform = components.Transform[i];
		let body = components.Body[i];
		let id = ids[i];

		// do anything with "transform" or "body"
	}
});
```

Note, however, that in [ES6](https://www.w3schools.com/js/js_es6.asp) it is most convenient to use [destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) for quick access to arrays of components.

```javascript
// use destructuring assignment with rename

state.query([Transform, Body], function({ Transform: transforms, Body: bodies }, ids)
{
	for(let i = 0; i < ids.length; i++)
	{
		let transform = transforms[i];
		let body = bodies[i];
		let id = ids[i];

		// do anything with "transform" or "body"
	}
});
```