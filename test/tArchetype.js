
import { Archetype } from '../src/Archetype.js';











/* ------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------ */


var archetype_Transform = null;
var archetype_Transform_Mesh = null;


/* ------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------ */


function Transform() {}
function Mesh() {}


/* ------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------ */


describe('Create archetypes', function()
{
	it('Create "Transform", "Transform_Mesh" archetypes', function(done)
	{
		archetype_Transform = new Archetype(Transform);
		archetype_Transform_Mesh = new Archetype(Transform, Mesh);

		done();
	});
});


/* ------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------ */


describe('archetype.add()', function()
{
	it('Add new entity to "Transform" archetype [true]', function(done)
	{
		var result = archetype_Transform.add(0);

		if(result === true) done(); else done(true);
	});


	/* ------------------------------------------------------ */


	it('Add new entity to "Transform" archetype with existing id [false]', function(done)
	{
		var result = archetype_Transform.add(0);

		if(result === false) done(); else done(true);
	});
});


/* ------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------ */


describe('archetype.get()', function()
{
	it('Get "Transform" component of existing entity [object]', function(done)
	{
		var transform = archetype_Transform.get(0, Transform);

		if(transform instanceof Transform === true) done(); else done(true);
	});


	/* ------------------------------------------------------ */


	it('Get non existing "Mesh" component of existing entity [object]', function(done)
	{
		var mesh = archetype_Transform.get(0, Mesh);

		if(mesh === null) done(); else done(true);
	});


	/* ------------------------------------------------------ */


	it('Get "Transform" component of non existing entity [null]', function(done)
	{
		var transform = archetype_Transform.get(1, Transform);

		if(transform === null) done(); else done(true);
	});
});


/* ------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------ */


describe('archetype.move()', function()
{
	it('Move existing entity from "Transform" archetype to "Transform_Mesh" archetype [true]', function(done)
	{
		var result = archetype_Transform.move(0, archetype_Transform_Mesh);

		if(result === true) done(); else done(true);
	});


	/* ------------------------------------------------------ */


	it('Move not existing entity from "Transform" archetype to "Transform_Mesh" archetype [false]', function(done)
	{
		var result = archetype_Transform.move(0, archetype_Transform_Mesh);

		if(result === false) done(); else done(true);
	});
});


/* ------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------ */


describe('archetype.remove()', function()
{
	it('Remove existing entity [true]', function(done)
	{
		var result = archetype_Transform_Mesh.remove(0);

		if(result === true) done(); else done(true);
	});


	/* ------------------------------------------------------ */


	it('Remove not existing entity [false]', function(done)
	{
		var result = archetype_Transform_Mesh.remove(0);

		if(result === false) done(); else done(true);
	});
});


/* ------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------ */