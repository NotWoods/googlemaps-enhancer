import enhance from '../../enhancer.js';
import {keys, values, iteratorSym} from '../../helpers.js';

enhance(google.maps.Data.Geometry);

google.maps.Data.Geometry.prototype.entries = function() {
	let results = [];
	this.forEachLatLng((value, key) => results.push([key, value]));
	return results.entries();
}

google.maps.Data.Geometry.prototype.keys = keys
google.maps.Data.Geometry.prototype.values = values
google.maps.Data.Geometry.prototype[Symbol.iterator] = iteratorSym

export default google.maps.Data.Geometry;