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
	const serviceClass = google.maps[serviceClassName + 'Service'];
	const okStatus = google.maps[serviceClassName + 'Status'].OK;
	
	for (let method of Object.keys(serviceClass.prototype)) {
		serviceClass.prototype[method + 'Async'] = 
			promisfyService(method, okStatus);
	}
	return serviceClass;
}

export default [
	'Directions',
	'Elevation',
	'MaxZoom',
	'DistanceMatrix',
	'StreetView'
]
.map(n => promisfyServiceClass(n))

google.maps.Geocoder.prototype.geocodeAsync = promisfyService('geocode', 
	google.maps.GeocoderStatus.OK);