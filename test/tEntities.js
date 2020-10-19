
import { Entities } from '../src/Entities.js';
import { Archetype } from '../src/Archetype.js';











/* ------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------ */


var entities = new Entities;


/* ------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------ */


describe('entities.add()', function()
{
	it('Add 10 entities [number]', function(done)
	{
		for(let i = 0; i < 10; i++)
		{
			if(entities.add(new Archetype) != i)
			{
				done(true);
				return;
			}
		}

		done();
	});
});


/* ------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------ */


describe('entities.get()', function()
{
	it('Get 10 existing entities [Archetype]', function(done)
	{
		for(let i = 0; i < 10; i++)
		{
			if(entities.get(i) instanceof Archetype === false)
			{
				done(true);
				return;
			}
		}

		done();
	});


	/* ------------------------------------------------------ */


	it('Get not existing entity [null]', function(done)
	{
		var result = entities.get(10);

		if(result === null) done(); else done(true);
	});
});


/* ------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------ */


describe('entities.set()', function()
{
	it('Set new Archetype to 10 existing entities [true]', function(done)
	{
		for(let i = 0; i < 10; i++)
		{
			if(entities.set(i, new Archetype) === false)
			{
				done(true);
				return;
			}
		}

		done();
	});


	/* ------------------------------------------------------ */


	it('Set new Archetype to not existing entity [false]', function(done)
	{
		var result = entities.set(10, new Archetype);

		if(result === false) done(); else done(true);
	});
});


/* ------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------ */


describe('entities.remove()', function()
{
	it('Remove 10 existing ids [true]', function(done)
	{
		for(let i = 0; i < 10; i++)
		{
			if(entities.remove(i) !== true)
			{
				done(true);
				return;
			}

			if(entities.get(i) !== null)
			{
				done(true);
				return;
			}
		}

		var id = entities.add(new Archetype);

		if(id === 0) done(); else done(true);
	});
});


/* ------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------ */