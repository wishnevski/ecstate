
export default {
	number: function(variable)
	{
		if(typeof variable == 'number') return true; else return false;
	},


	boolean: function(variable)
	{
		if(typeof variable == 'boolean') return true; else return false;
	},


	string: function(variable)
	{
		if(typeof variable == 'string') return true; else return false;
	},


	function: function(variable)
	{
		if(typeof variable == 'function') return true; else return false;
	},


	null: function(variable)
	{
		if(variable === null) return true; else return false;
	},


	undefined: function(variable)
	{
		if(variable === undefined) return true; else return false;
	},


	array: function(variable)
	{
		if(Array.isArray(variable)) return true; else return false;
	},


	object: function(variable)
	{
		if(typeof variable == 'object' && !Array.isArray(variable) && variable !== null) return true; else return false;
	}
};