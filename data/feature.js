import enhance from './enhancer.js';
import {keys, values, iteratorSym, promisify} from './helpers.js';

enhance(google.maps.Data.Feature);

google.maps.Data.Feature.prototype.entries = function() {
	let results = [];
	this.forEachProperty((value, key) => results.push([key, value]));
	return results.entries();	
}

google.maps.Data.Feature.prototype.keys = keys;
google.maps.Data.Feature.prototype.values = values;
google.maps.Data.Feature.prototype[Symbol.iterator] = iteratorSym

google.maps.Data.Feature.prototype.toGeoJsonAsync = 
	promisify(google.maps.Data.Feature.prototype.toGeoJson);

export default google.maps.Data.Feature;