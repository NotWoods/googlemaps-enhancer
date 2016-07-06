/**
 * Adds getter and setter methods that can be used instead of getSomething()
 * or setSomething(value) to Google Maps API objects. 
 * @module lib/googlemaps
 */

import enhance from './enhance.js';

import MVCArray from './mvcarray.js';
import * as Data from './data';
import LatLng from './latlng.js';
import Services from './services.js';

if (typeof google !== 'undefined' && google.maps !== undefined) {

[
	google.maps.Map,
	google.maps.Marker,
	google.maps.InfoWindow,
	google.maps.Polyline,
	google.maps.Polygon,
	google.maps.Rectangle,
	google.maps.Circle,
	google.maps.GroundOverlay,
	google.maps.OverlayView,
]
.forEach(o => enhance(o))

}

export default google.maps;