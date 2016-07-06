(function(google) {
	if (typeof google === 'undefined' || google.maps === undefined) return;

	function enhance(someClass) {
		const proto = someClass.prototype;

		let descriptors = {};
		for (let method of Object.keys(proto)) {
			if (method.length < 4) continue;
			else if (!method.startsWith('get') && !method.startsWith('set')) continue;

			const stripped = method.charAt(3).toLowerCase() + method.substr(4);
			if (stripped && descriptors[stripped] === undefined) 
				descriptors[stripped] = {};

			if (method.startsWith('get'))
				descriptors[stripped].get = proto[method];
			else if (method.startsWith('set'))
				descriptors[stripped].set = proto[method];
		}

		Object.defineProperties(someClass.prototype, descriptors);
	}

	function* _keys() {
		for (let [key, ] of this.entries()) yield key;
	}
	function* _values() {
		for (let [, value] of this.entries()) yield value;
	}
	function getEntries() { return this.entries(); }
	function getValues() { return this.values(); }

	function padArray(array, desiredLength) {
		if (array.length < desiredLength) {
			const difference = desiredLength - array.length;
			return array.concat( Array(difference).fill(undefined) );
		}
		else return array;
	}

	function promisify(func) {
		const funcLength = func.length - 1;
		return function(...args) {
			const paddedArgs = padArray(args, funcLength);
			return new Promise(resolve => func(...paddedArgs, resolve));
		}
	}

	[
		google.maps.Map,
		google.maps.MVCArray,
		google.maps.Data,
		google.maps.Data.Feature,
		google.maps.Data.Geometry,
		google.maps.Marker,
		google.maps.InfoWindow,
		google.maps.LatLng,
		google.maps.Polyline,
		google.maps.Polygon,
		google.maps.Rectangle,
		google.maps.Circle,
		google.maps.GroundOverlay,
		google.maps.OverlayView,
	]
	.forEach(o => enhance(o))


	google.maps.Data.prototype.values = function*() {
		let results = [];
		this.forEach(feature => results.push(feature));
		return results[Symbol.iterator]();	
	}
	google.maps.Data.prototype.keys = function*() {
		for (let value of this.values()) yield value.id;
	}
	google.maps.Data.prototype.entries = function*() {
		for (let value of this.values()) yield [value.id, value];
	}
	google.maps.Data.prototype[Symbol.iterator] = getValues
	google.maps.Data.prototype.loadGeoJsonAsync = 
		promisify(google.maps.Data.prototype.loadGeoJson);
	google.maps.Data.prototype.toGeoJsonAsync = 
		promisify(google.maps.Data.prototype.toGeoJson);


	google.maps.Data.Feature.prototype.entries = function() {
		let results = [];
		this.forEachProperty((value, key) => results.push([key, value]));
		return results.entries();	
	}
	google.maps.Data.Feature.prototype.keys = _keys;
	google.maps.Data.Feature.prototype.values = _values;
	google.maps.Data.Feature.prototype[Symbol.iterator] = getEntries;
	google.maps.Data.Feature.prototype.toGeoJsonAsync = 
		promisify(google.maps.Data.Feature.prototype.toGeoJson);


	google.maps.Data.Geometry.prototype.entries = function() {
		let results = [];
		this.forEachLatLng(latlng => results.push(latlng));
		return results.entries();
	}
	google.maps.Data.Geometry.prototype.keys = _keys
	google.maps.Data.Geometry.prototype.values = _values
	google.maps.Data.Geometry.prototype[Symbol.iterator] = getValues


	const lat = { get() {return this.lat();} }
	const lng = { get() {return this.lng();} }
	Object.defineProperties(google.maps.LatLng.prototype, {
		long: lng,
		x: lng, y: lat, 
		0: lng, 1: lat,
		length: { value: 2 }
	});
	google.maps.LatLng.prototype[Symbol.iterator] = function*() {
		yield this.lng(); yield this.lat();
	}


	google.maps.MVCArray.prototype.entries = function*() {
		for (let i = 0; i < this.length; i++) yield [i, this.getAt(i)];
	}
	google.maps.MVCArray.prototype.keys = _keys
	google.maps.MVCArray.prototype.values = _values
	google.maps.MVCArray.prototype[Symbol.iterator] = getValues
	google.maps.MVCArray.prototype.toJSON = function() {return [...this];}
	google.maps.MVCArray.prototype.toString = function() {
		return this.toJSON().join(',')
	}
	google.maps.MVCArray.prototype[Symbol.toPrivitive] = function(hint) {
		if (hint == 'number') return NaN;
		else return this.toString();
	}

	function promisfyService(methodName, okStatus) {
		const func = this[methodName];
		return request => new Promise((resolve, reject) => {
			func(request, (results, status) => {
				if (status === okStatus) resolve(results);
				else reject(status);
			})
		})
	}

	function promisfyServiceClass(serviceClassName) {
		console.log(serviceClassName);
		const serviceClass = google.maps[serviceClassName + 'Service'];
		const okStatus = google.maps[serviceClassName + 'Status'].OK;
		
		for (let method of Object.keys(serviceClass.prototype)) {
			serviceClass.prototype[method + 'Async'] = 
				promisfyService(method, okStatus);
		}
		return serviceClass;
	}

	[
		'Directions',
		'Elevation',
		'MaxZoom',
		'DistanceMatrix',
		'StreetView'
	]
	.map(n => promisfyServiceClass(n))
	google.maps.Geocoder.prototype.geocodeAsync = promisfyService('geocode', 
		google.maps.GeocoderStatus.OK);
})(google)