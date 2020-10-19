
import { QueryIndex } from '../src/QueryIndex.js';
import { Archetype } from '../src/Archetype.js';











/* ------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------ */


var index = new QueryIndex;


/* ------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------ */


function Transform() {}
function Mesh() {}
function Body() {}
function Collider() {}


/* ------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------ */


describe('index.add()', function()
{
	it('Add "Transform, Mesh" archetype [true]', function(done)
	{
		var archetype = new Archetype(Transform, Mesh);

		var result1 = index.add(archetype);
		var result2 = index.add(archetype);

		if(result1 === true && result2 === false) done(); else done(true);
	});


	/* ------------------------------------------------------ */


	it('Add "Transform" archetype [true]', function(done)
	{
		var archetype = new Archetype(Transform);

		var result1 = index.add(archetype);
		var result2 = index.add(archetype);

		if(result1 === true && result2 === false) done(); else done(true);
	});
});


/* ------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------ */


describe('index.get()', function()
{
	it('Get "Transform, Mesh" archetype [Archetype]', function(done)
	{
		var query = index.get(Mesh, Transform);

		if(query.get instanceof Archetype) done(); else done(true);
	});


	/* ------------------------------------------------------ */


	it('Get not existing "Mesh" archetype [null]', function(done)
	{
		var query = index.get(Mesh);

		if(query.get === null) done(); else done(true);
	});
});


/* ------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------ */


describe('index.remove()', function()
{
	it('Remove "Transform, Mesh" archetype [true]', function(done)
	{
		var queryTransform = index.get(Transform);

		var query = index.get(Transform, Mesh);
		var result = index.remove(query.get);

		if(result === true && query.get === null && queryTransform.iterate.length === 0) done(); else done(true);
	});
});


/* ------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------ */