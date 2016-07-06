import enhance from './enhance.js';

import './classes/mvcarray.js';
import './classes/latlng.js';
import './classes/services.js';
import './classes/data/data.js';
import './classes/data/feature.js';
import './classes/data/geometry.js';

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