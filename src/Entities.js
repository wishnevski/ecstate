
import is from './libraries/is.js';
import { Archetype } from './Archetype.js';













export function Entities()
{
	var list = [];
	var free = {};


	/* ----------------------------------------------------------------------------------------------------------- */
	/* ----------------------------------------------------------------------------------------------------------- */


	this.add = function(archetype)
	{
		/* TYPES */


		if(archetype instanceof Archetype === false) throw '[Entities] Invalid arguments in "add()" function';


		/* RESULT [FROM FREE] */


		for(let id in free)
		{
			list[id] = archetype;
			delete free[id];

			return id;
		}


		/* RESULT [FROM LIST] */


		return list.push(archetype) - 1;
	}


	/* ------------------------------------------------------ */


	this.remove = function(id)
	{
		/* TYPES */


		if(!is.number(id) || id < 0) throw '[Entities] Invalid arguments in "remove()" function';


		/* CHECK */


		if(list[id] === undefined) return false;


		/* DELETE [ID] */


		delete list[id];
		free[id] = null;


		/* DELETE [LAST UNDEFINEDS] */


		for(let i = list.length - 1; i >= 0; i--)
		{
			if(list[i] !== undefined) break;

			list.pop();
			delete free[i];
		}


		/* RESULT */


		return true;
	}


	/* ------------------------------------------------------ */


	this.set = function(id, archetype)
	{
		/* TYPES */


		if(!is.number(id) || id < 0 || archetype instanceof Archetype === false) throw '[Entities] Invalid arguments in "set()" function';


		/* CHECK */


		if(list[id] === undefined) return false;


		/* SET */


		list[id] = archetype;


		/* RESULT */


		return true;
	}


	/* ------------------------------------------------------ */


	this.get = function(id)
	{
		/* TYPES */


		if(!is.number(id) || id < 0) throw '[Entities] Invalid arguments in "get()" function';


		/* CHECK */


		if(list[id] === undefined) return null;


		/* RESULT */


		return list[id];
	}
}