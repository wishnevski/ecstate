
import is from './libraries/is.js';
import { Archetype } from './Archetype.js';














function Edge()
{
	this.query = null;
	this.edges = {};
}








function Query()
{
	this.components = [];

	this.get = null;
	this.iterate = [];
}













export function QueryIndex()
{
	var graph = new Edge;
	var queries = [];

	var archetypes = [];
	var exists = new Set;


	/* ----------------------------------------------------------------------------------------------------------- */
	/* ----------------------------------------------------------------------------------------------------------- */


	function contains(types, components)
	{
		for(let i = 0; i < components.length; i++)
		{
			if(!is.function(components[i]) || components[i].name.length === 0) throw '[Index] Invalid components list';

			let name = components[i].name;
			if(types[name] === undefined) return false;
		}

		return true;
	}


	/* ------------------------------------------------------ */


	function compare(components1, components2)
	{
		if(components1.length !== components2.length) return false;

		var types = {};
		for(let i = 0; i < components1.length; i++) types[components1[i].name] = components1[i];

		return contains(types, components2);
	}


	/* ----------------------------------------------------------------------------------------------------------- */
	/* ----------------------------------------------------------------------------------------------------------- */


	this.add = function(archetype)
	{
		/* TYPES */


		if(archetype instanceof Archetype === false) throw '[Index] Invalid arguments in "add()" function';


		/* CHECK */


		if(exists.has(archetype) === true) return false;


		/* LENGTH */


		var length = Object.keys(archetype.types).length;


		/* ADD [ARCHETYPES] */


		archetypes.push(archetype);


		/* ADD [EXISTS] */


		exists.add(archetype);


		/* ADD [QUERIES] */


		for(let i = 0; i < queries.length; i++)
		{
			if(contains(archetype.types, queries[i].components) === true)
			{
				if(length === queries[i].components.length)
				{
					queries[i].get = archetype;
				}
				else
				{
					queries[i].iterate.push(archetype);
				}
			}
		}


		/* RESULT */


		return true;
	}


	/* ------------------------------------------------------ */


	this.remove = function(archetype)
	{
		/* TYPES */


		if(archetype instanceof Archetype === false) throw '[Index] Invalid arguments in "remove()" function';


		/* CHECK */


		if(exists.has(archetype) === false) return false;


		/* REMOVE [ARCHETYPES] */


		for(let i = 0; i < archetypes.length; i++)
		{
			if(archetypes[i] === archetype)
			{
				archetypes[i] = archetypes[archetypes.length - 1];
				archetypes.pop();

				break;
			}
		}


		/* REMOVE [EXISTS] */


		exists.delete(archetype);


		/* REMOVE [QUERIES] */


		for(let i = 0; i < queries.length; i++)
		{
			/* get */


			if(queries[i].get === archetype) queries[i].get = null;


			/* iterate */


			for(let l = 0; l < queries[i].iterate.length; l++)
			{
				if(queries[i].iterate[l] === archetype)
				{
					queries[i].iterate[l] = queries[i].iterate[queries[i].iterate.length - 1];
					queries[i].iterate.pop();
				}
			}
		}


		/* RESULT */


		return true;
	}


	/* ----------------------------------------------------------------------------------------------------------- */
	/* ----------------------------------------------------------------------------------------------------------- */


	this.get = function()
	{
		/* EDGE [ROOT] */


		var edge = graph;


		/* EDGE [SEARCH] */


		for(let i = 0; i < arguments.length; i++)
		{
			if(!is.function(arguments[i]) || arguments[i].name.length === 0) throw '[Index] Invalid arguments in "get()" function';

			let name = arguments[i].name;

			if(edge.edges[name] === undefined) edge.edges[name] = new Edge;
			edge = edge.edges[name];
		}


		/* QUERY [SEARCH] */


		if(edge.query === null)
		{
			for(let i = 0; i < queries.length; i++)
			{
				if(compare(queries[i].components, arguments) === true)
				{
					edge.query = queries[i];
					break;
				}
			}
		}


		/* QUERY [ADD] */


		if(edge.query === null)
		{
			edge.query = new Query;
			edge.query.components = [...arguments];

			queries.push(edge.query);


			for(let i = 0; i < archetypes.length; i++)
			{
				if(contains(archetypes[i].types, edge.query.components) === true)
				{
					if(Object.keys(archetypes[i].types).length === edge.query.components.length)
					{
						edge.query.get = archetypes[i];
					}
					else
					{
						edge.query.iterate.push(archetypes[i]);
					}
				}
			}
		}


		/* RESULT */


		return edge.query;
	}


	/* ----------------------------------------------------------------------------------------------------------- */
	/* ----------------------------------------------------------------------------------------------------------- */


	this.clear = function()
	{
		graph = new Edge;
		queries = [];
	}
}