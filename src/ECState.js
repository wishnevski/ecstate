
import { Entities } from './Entities.js';
import { Archetype } from './Archetype.js';
import { QueryIndex } from './QueryIndex.js';














export function ECState()
{
	this.entities = new Entities;
	this.index = new QueryIndex;
}


/* ----------------------------------------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------------------------------------- */


ECState.prototype.addEntity = function()
{
	/* QUERY */


	var query = this.index.get(...arguments);


	/* ARCHETYPE */


	if(query.get === null) this.index.add(new Archetype(...arguments));


	/* ADD */


	var id = this.entities.add(query.get);
	query.get.add(id);


	/* RESULT */


	return id;
}


/* ------------------------------------------------------ */


ECState.prototype.removeEntity = function(id)
{
	/* ARCHETYPE */


	var archetype = this.entities.get(id);
	if(archetype === null) return false;


	/* REMOVE */


	this.entities.remove(id);
	archetype.remove(id);


	/* RESULT */


	return true;
}


/* ----------------------------------------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------------------------------------- */


ECState.prototype.addComponent = function(id)
{
	/* ARCHETYPE [LAST] */


	var archetypeLast = this.entities.get(id);
	if(archetypeLast === null) return false;


	/* COMPONENTS */


	var components = [];

	for(let name in archetypeLast.types) components.push(archetypeLast.types[name]);
	for(let i = 1; i < arguments.length; i++) components.push(arguments[i]);


	/* ARCHETYPE [SEARCH] */


	var query = this.index.get(...components);


	/* ARCHETYPE [ADD] */


	if(query.get === null) this.index.add(new Archetype(...components));


	/* MOVE */


	if(archetypeLast.move(id, query.get) === false) return false;
	this.entities.set(id, query.get);


	/* RESULT */


	return true;
}


/* ------------------------------------------------------ */


ECState.prototype.removeComponent = function(id)
{
	/* ARCHETYPE [LAST] */


	var archetypeLast = this.entities.get(id);
	if(archetypeLast === null) return false;


	/* COMPONENTS */


	var components = [];
	var minus = {};

	for(let i = 1; i < arguments.length; i++) minus[arguments[i].name] = arguments[i];
	for(let name in archetypeLast.types)
	{
		if(minus[name] === undefined) components.push(archetypeLast.types[name]);
	}


	/* ARCHETYPE [SEARCH] */


	var query = this.index.get(...components);


	/* ARCHETYPE [ADD] */


	if(query.get === null) this.index.add(new Archetype(...components));


	/* MOVE */


	if(archetypeLast.move(id, query.get) === false) return false;
	this.entities.set(id, query.get);


	/* RESULT */


	return true;
}


/* ------------------------------------------------------ */


ECState.prototype.getComponent = function(id, component)
{
	/* ARCHETYPE */


	var archetype = this.entities.get(id);
	if(archetype === null) return null;


	/* RESULT */


	return archetype.get(id, component);
}


/* ----------------------------------------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------------------------------------- */


ECState.prototype.query = function(components, callback)
{
	/* QUERY */


	var query = this.index.get(...components);


	/* GET */


	if(query.get !== null && query.get.ids.length > 0) callback(query.get.components, query.get.ids);


	/* ITERATE */


	for(let i = 0; i < query.iterate.length; i++)
	{
		if(query.iterate[i].ids.length > 0) callback(query.iterate[i].components, query.iterate[i].ids);
	}
}