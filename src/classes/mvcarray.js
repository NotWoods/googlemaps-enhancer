import enhance from '../enhancer.js';
import {keys, values, iteratorSym} from '../helpers.js';

enhance(google.maps.MVCArray);

google.maps.MVCArray.prototype.entries = function*() {
	for (let i = 0; i < this.length; i++) yield [i, this.getAt(i)];
}

google.maps.MVCArray.prototype.keys = keys
google.maps.MVCArray.prototype.values = values
google.maps.MVCArray.prototype[Symbol.iterator] = iteratorSym

google.maps.MVCArray.prototype.toJSON = function() {return [...this];}

google.maps.MVCArray.prototype.toString = function() {
	return this.toJSON().join(',')
}

google.maps.MVCArray.prototype[Symbol.toPrivitive] = function(hint) {
	if (hint == 'number') return NaN;
	else return this.toString();
}