
import { ECState } from 'ecstate';

import { Entities } from 'ecstate/src/Entities.js';
import { Archetype } from 'ecstate/src/Archetype.js';
import { QueryIndex } from 'ecstate/src/QueryIndex.js';















/* ------------------------ ECSTATE ------------------------ */


var state = new ECState;


/* ENTITY */


var id = state.addEntity(Transform, Mesh);
var result = state.removeEntity(id);


/* COMPONENT */


var result = state.addComponent(id, Body, Collider);
var result = state.removeComponent(id, Body, Collider);
var transform = state.getComponent(id, Transform);


/* QUERY */


state.query([Transform, Mesh], function({ Transform: transforms, Mesh: meshes }, ids)
{
	for(let i = 0; i < ids.length; i++)
	{
		let transform = transforms[i];
		let mesh = meshes[i];
		let id = ids[i];
	}
});















/* ------------------------ ENTITIES ------------------------ */


var entities = new Entities;

var id = entities.add(new Archetype); // number
var result = entities.remove(id); // boolean
var result = entities.set(id, new Archetype); // boolean
var archetype = entities.get(id); // Archetype, null


/* ------------------------ ARCHETYPE ------------------------ */


var archetype = new Archetype(Transform, Mesh);
var archetypeOther = new Archetype(Transform, Mesh, Body);

var result = archetype.add(id); // boolean
var result = archetype.remove(id); // boolean
var result = archetype.move(id, archetypeOther); // boolean
var transform = archetype.get(id, Transform); // Transform, null


/* ------------------------ QUERY INDEX ------------------------ */


var index = new QueryIndex;

var result = index.add(new Archetype); // boolean
var result = index.remove(archetype); // boolean

var query = index.get(Transform, Mesh); // Query

var archetype = query.get; // Archetype, null
var archetypeContains = query.iterate; // array