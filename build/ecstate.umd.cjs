(function(global,factory){typeof exports==="object"&&typeof module!=="undefined"?factory(exports):typeof define==="function"&&define.amd?define(["exports"],factory):(global=typeof globalThis!=="undefined"?globalThis:global||self,factory(global.ECState={}))})(this,(function(exports){"use strict";var is={number:function(variable){if(typeof variable=="number")return true;else return false},boolean:function(variable){if(typeof variable=="boolean")return true;else return false},string:function(variable){if(typeof variable=="string")return true;else return false},function:function(variable){if(typeof variable=="function")return true;else return false},null:function(variable){if(variable===null)return true;else return false},undefined:function(variable){if(variable===undefined)return true;else return false},array:function(variable){if(Array.isArray(variable))return true;else return false},object:function(variable){if(typeof variable=="object"&&variable!==null)return true;else return false}};function Archetype(){this.types={};this.ids=[];this.components={};this.entities={};for(let i=0;i<arguments.length;i++){if(!is.function(arguments[i])||arguments[i].name.length===0)throw"[Archetype] Invalid arguments in constructor function";let name=arguments[i].name;this.types[name]=arguments[i];this.components[name]=[]}}Archetype.prototype.add=function(id){if(!is.number(id)||id<0)throw'[Archetype] Invalid arguments in "add()" function';if(this.entities[id]!==undefined)return false;for(let name in this.components)this.components[name].push(new this.types[name]);this.entities[id]=this.ids.push(id)-1;return true};Archetype.prototype.remove=function(id){if(!is.number(id)||id<0)throw'[Archetype] Invalid arguments in "remove()" function';if(this.entities[id]===undefined)return false;var index=this.entities[id];for(let name in this.components){this.components[name][index]=this.components[name][this.components[name].length-1];this.components[name].pop()}this.ids[index]=this.ids[this.ids.length-1];this.ids.pop();delete this.entities[id];if(this.ids[index]!==undefined)this.entities[this.ids[index]]=index;return true};Archetype.prototype.move=function(id,to){if(!is.number(id)||id<0||to instanceof Archetype===false)throw'[Archetype] Invalid arguments in "move()" function';if(this.entities[id]===undefined)return false;if(to.entities[id]!==undefined)return false;var index=this.entities[id];for(let name in to.types){to.components[name].push(this.types[name]!==undefined?this.components[name][index]:new to.types[name])}to.entities[id]=to.ids.push(id)-1;this.remove(id);return true};Archetype.prototype.get=function(id,component){if(!is.number(id)||id<0||!is.function(component)||component.name.length===0)throw'[Archetype] Invalid arguments in "get()" function';if(this.entities[id]===undefined)return null;if(this.types[component.name]===undefined)return null;var index=this.entities[id];var name=component.name;return this.components[name][index]};function Entities(){var list=[];var free={};this.add=function(archetype){if(archetype instanceof Archetype===false)throw'[Entities] Invalid arguments in "add()" function';for(let id in free){list[id]=archetype;delete free[id];return id}return list.push(archetype)-1};this.remove=function(id){if(!is.number(id)||id<0)throw'[Entities] Invalid arguments in "remove()" function';if(list[id]===undefined)return false;delete list[id];free[id]=null;for(let i=list.length-1;i>=0;i--){if(list[i]!==undefined)break;list.pop();delete free[i]}return true};this.set=function(id,archetype){if(!is.number(id)||id<0||archetype instanceof Archetype===false)throw'[Entities] Invalid arguments in "set()" function';if(list[id]===undefined)return false;list[id]=archetype;return true};this.get=function(id){if(!is.number(id)||id<0)throw'[Entities] Invalid arguments in "get()" function';if(list[id]===undefined)return null;return list[id]}}function Edge(){this.query=null;this.edges={}}function Query(){this.components=[];this.get=null;this.iterate=[]}function QueryIndex(){var graph=new Edge;var queries=[];var archetypes=[];var exists=new Set;function contains(types,components){for(let i=0;i<components.length;i++){if(!is.function(components[i])||components[i].name.length===0)throw"[Index] Invalid components list";let name=components[i].name;if(types[name]===undefined)return false}return true}function compare(components1,components2){if(components1.length!==components2.length)return false;var types={};for(let i=0;i<components1.length;i++)types[components1[i].name]=components1[i];return contains(types,components2)}this.add=function(archetype){if(archetype instanceof Archetype===false)throw'[Index] Invalid arguments in "add()" function';if(exists.has(archetype)===true)return false;var length=Object.keys(archetype.types).length;archetypes.push(archetype);exists.add(archetype);for(let i=0;i<queries.length;i++){if(contains(archetype.types,queries[i].components)===true){if(length===queries[i].components.length){queries[i].get=archetype}else{queries[i].iterate.push(archetype)}}}return true};this.remove=function(archetype){if(archetype instanceof Archetype===false)throw'[Index] Invalid arguments in "remove()" function';if(exists.has(archetype)===false)return false;for(let i=0;i<archetypes.length;i++){if(archetypes[i]===archetype){archetypes[i]=archetypes[archetypes.length-1];archetypes.pop();break}}exists.delete(archetype);for(let i=0;i<queries.length;i++){if(queries[i].get===archetype)queries[i].get=null;for(let l=0;l<queries[i].iterate.length;l++){if(queries[i].iterate[l]===archetype){queries[i].iterate[l]=queries[i].iterate[queries[i].iterate.length-1];queries[i].iterate.pop()}}}return true};this.get=function(){var edge=graph;for(let i=0;i<arguments.length;i++){if(!is.function(arguments[i])||arguments[i].name.length===0)throw'[Index] Invalid arguments in "get()" function';let name=arguments[i].name;if(edge.edges[name]===undefined)edge.edges[name]=new Edge;edge=edge.edges[name]}if(edge.query===null){for(let i=0;i<queries.length;i++){if(compare(queries[i].components,arguments)===true){edge.query=queries[i];break}}}if(edge.query===null){edge.query=new Query;edge.query.components=[...arguments];queries.push(edge.query);for(let i=0;i<archetypes.length;i++){if(contains(archetypes[i].types,edge.query.components)===true){if(Object.keys(archetypes[i].types).length===edge.query.components.length){edge.query.get=archetypes[i]}else{edge.query.iterate.push(archetypes[i])}}}}return edge.query};this.clear=function(){graph=new Edge;queries=[]}}function ECState(){this.entities=new Entities;this.index=new QueryIndex}ECState.prototype.addEntity=function(){var query=this.index.get(...arguments);if(query.get===null)this.index.add(new Archetype(...arguments));var id=this.entities.add(query.get);query.get.add(id);return id};ECState.prototype.removeEntity=function(id){var archetype=this.entities.get(id);if(archetype===null)return false;this.entities.remove(id);archetype.remove(id);return true};ECState.prototype.addComponent=function(id){var archetypeLast=this.entities.get(id);if(archetypeLast===null)return false;var components=[];for(let name in archetypeLast.types)components.push(archetypeLast.types[name]);for(let i=1;i<arguments.length;i++)components.push(arguments[i]);var query=this.index.get(...components);if(query.get===null)this.index.add(new Archetype(...components));if(archetypeLast.move(id,query.get)===false)return false;this.entities.set(id,query.get);return true};ECState.prototype.removeComponent=function(id){var archetypeLast=this.entities.get(id);if(archetypeLast===null)return false;var components=[];var minus={};for(let i=1;i<arguments.length;i++)minus[arguments[i].name]=arguments[i];for(let name in archetypeLast.types){if(minus[name]===undefined)components.push(archetypeLast.types[name])}var query=this.index.get(...components);if(query.get===null)this.index.add(new Archetype(...components));if(archetypeLast.move(id,query.get)===false)return false;this.entities.set(id,query.get);return true};ECState.prototype.getComponent=function(id,component){var archetype=this.entities.get(id);if(archetype===null)return null;return archetype.get(id,component)};ECState.prototype.query=function(components,callback){var query=this.index.get(...components);if(query.get!==null&&query.get.ids.length>0)callback(query.get.components,query.get.ids);for(let i=0;i<query.iterate.length;i++){if(query.iterate[i].ids.length>0)callback(query.iterate[i].components,query.iterate[i].ids)}};exports.ECState=ECState;Object.defineProperty(exports,"__esModule",{value:true})}));