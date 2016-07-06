import enhance from '../../enhancer.js';
import {keys, values, getValues} from '../../helpers.js';

enhance(google.maps.Data.Geometry);

google.maps.Data.Geometry.prototype.entries = function() {
	let results = [];
	this.forEachLatLng(latlng => results.push(latlng));
	return results.entries();
}

google.maps.Data.Geometry.prototype.keys = keys
google.maps.Data.Geometry.prototype.values = values
google.maps.Data.Geometry.prototype[Symbol.iterator] = getValues