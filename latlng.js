import enhance from './enhancer.js';

enhance(google.maps.LatLng);

const lat = {
	get() {
		return this.lat();
	}
}

const lng = {
	get() {
		return this.lng();
	}
}

Object.defineProperties(google.maps.LatLng.prototype, {
	long: lng,
	x: lng, y: lat, 
	0: lng, 1: lat,
	length: { value: 2 }
})

google.maps.LatLng.prototype[Symbol.iterator] = function*() {
	yield this.lng();
	yield this.lat();
}

export default google.maps.LatLng;