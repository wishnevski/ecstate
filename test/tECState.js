
import { ECState } from '../src/ECState.js';













/* ------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------ */


var ecstate = null;


/* ------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------ */


function Transform() {}
function Mesh() {}
function Body() {}
function Collider() {}


/* ------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------ */


describe('Init', function()
{
	it('Init ECState librarie', function(done)
	{
		ecstate = new ECState;

		done();
	});
});


/* ------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------ */


describe('Add entities', function()
{
	it('Add entities, add components and remove components', function(done)
	{
		var result0 = ecstate.addEntity();

		var result1 = ecstate.addEntity(Transform, Mesh);
		var result2 = ecstate.addEntity(Transform, Mesh);
		var result3 = ecstate.addEntity(Transform, Mesh);

		var result1_add = ecstate.addComponent(1, Body);
		var result3_remove = ecstate.removeComponent(3, Mesh);

		if(result0 === 0 && result1 === 1 && result2 === 2 && result3 === 3 && result1_add === true && result3_remove === true) done(); else done(true);
	});
});


/* ------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------ */


describe('Query', function()
{
	it('Query all archetypes for counting archetypes and entities', function(done)
	{
		var archetypes = 0;
		var entities = 0;

		ecstate.query([], function(components, ids)
		{
			archetypes += 1;
			entities += ids.length;
		});

		if(archetypes === 4 && entities === 4) done(); else done(true);
	});


	/* ------------------------------------------------------ */


	it('Query all archetypes with "Transform" component', function(done)
	{
		var archetypes = 0;
		var entities = 0;

		ecstate.query([Transform], function(components, ids)
		{
			archetypes += 1;
			entities += ids.length;
		});

		if(archetypes === 3 && entities === 3) done(); else done(true);
	});
});


/* ------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------ */


describe('Remove entities', function()
{
	it('Remove entities and check its existence', function(done)
	{
		var result0 = ecstate.removeEntity(0);

		var result1 = ecstate.removeEntity(1);
		var result2 = ecstate.removeEntity(2);
		var result3 = ecstate.removeEntity(3);

		var archetypes = 0;
		var entities = 0;

		ecstate.query([], function(components, ids)
		{
			archetypes += 1;
			entities += ids.length;
		});

		if(result0 === true && result1 === true && result2 === true && result3 === true && archetypes === 0 && entities === 0) done(); else done(true);
	});
});


/* ------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------ */