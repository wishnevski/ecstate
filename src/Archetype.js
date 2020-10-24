
import is from './libraries/is.js';















export function Archetype()
{
	this.types = {};

	this.ids = [];
	this.components = {};

	this.entities = {};


	/* ----------------------------------------------------------------------------------------------------------- */
	/* ----------------------------------------------------------------------------------------------------------- */


	for(let i = 0; i < arguments.length; i++)
	{
		/* TYPES */


		if(!is.function(arguments[i]) || arguments[i].name.length === 0) throw '[Archetype] Invalid arguments in constructor function';


		/* NAME */


		let name = arguments[i].name;


		/* ADD */


		this.types[name] = arguments[i];
		this.components[name] = [];
	}
}


/* ----------------------------------------------------------------------------------------------------------- */
/* ----------------------------------------------------------------------------------------------------------- */


Archetype.prototype.add = function(id)
{
	/* TYPES */


	if(!is.number(id) || id < 0) throw '[Archetype] Invalid arguments in "add()" function';


	/* CHECK */


	if(this.entities[id] !== undefined) return false;


	/* COMPONENTS */


	for(let name in this.components) this.components[name].push(new this.types[name]);


	/* IDS */


	this.entities[id] = this.ids.push(id) - 1;


	/* RESULT */


	return true;
}


/* ------------------------------------------------------ */


Archetype.prototype.remove = function(id)
{
	/* TYPES */


	if(!is.number(id) || id < 0) throw '[Archetype] Invalid arguments in "remove()" function';


	/* CHECK */


	if(this.entities[id] === undefined) return false;


	/* INDEX */


	var index = this.entities[id];


	/* COMPONENTS */


	for(let name in this.components)
	{
		this.components[name][index] = this.components[name][this.components[name].length - 1];
		this.components[name].pop();
	}


	/* IDS */


	this.ids[index] = this.ids[this.ids.length - 1];
	this.ids.pop();


	/* ENTITIES */


	delete this.entities[id];


	/* REPLACED */


	if(this.ids[index] !== undefined) this.entities[this.ids[index]] = index;


	/* RESULT */


	return true;
}


/* ------------------------------------------------------ */


Archetype.prototype.move = function(id, to)
{
	/* TYPES */


	if(!is.number(id) || id < 0 || to instanceof Archetype === false) throw '[Archetype] Invalid arguments in "move()" function';


	/* CHECK */


	if(this.entities[id] === undefined) return false;
	if(to.entities[id] !== undefined) return false;


	/* INDEX */


	var index = this.entities[id];


	/* COMPONENTS [ADD] */


	for(let name in to.types)
	{
		to.components[name].push(this.types[name] !== undefined ? this.components[name][index] : new to.types[name]);
	}


	/* IDS [ADD] */


	to.entities[id] = to.ids.push(id) - 1;


	/* REMOVE */


	this.remove(id);


	/* RESULT */


	return true;
}


/* ------------------------------------------------------ */


Archetype.prototype.get = function(id, component)
{
	/* TYPES */


	if(!is.number(id) || id < 0 || !is.function(component) || component.name.length === 0) throw '[Archetype] Invalid arguments in "get()" function';


	/* CHECK */


	if(this.entities[id] === undefined) return null;
	if(this.types[component.name] === undefined) return null;


	/* INDEX */


	var index = this.entities[id];


	/* NAME */


	var name = component.name;


	/* RESULT */


	return this.components[name][index];
}