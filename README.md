# googlemaps-enhancer
A script to add some enhancements to the [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/) by extending their prototypes.

## Installation
Download [googlemaps-enhancer.min.js](https://raw.githubusercontent.com/NotWoods/googlemaps-enhancer/master/dist/googlemaps-enhancer.min.js) ~~or `npm install --save googlemaps-enhancer`~~ (eventually).

Since this is a script for browsers (as the Google Maps API only runs in browsers) you'll need to either copy the googlemaps.min.js file from node_modules or use a module loader like [JSPM](http://jspm.io/).

## Usage
The script simply alters the prototypes of objects created by Google Maps, and doesn't export anything itself. Just load the script after loading the Google Maps API.

```javascript
// after loading maps.googleapis.com/maps/api/js

require('googlemaps-enhancer');

import 'googlemaps-enhancer';
System.import('googlemaps-enhancer');
```

or...
```html
<script defer src='https://maps.googleapis.com/maps/api/js'></script>
<script defer src='googlemaps-enhancer.js'></script>
```

## API
### Getters and Setters
The script will add getters and setters corresponding to functions named `getValue()` and `setValue(x)`. The following classes are affected:
* [google.maps.Map](https://developers.google.com/maps/documentation/javascript/3.exp/reference#Map)
* [google.maps.Data](https://developers.google.com/maps/documentation/javascript/3.exp/reference#Data)
* [google.maps.Data.Feature](https://developers.google.com/maps/documentation/javascript/3.exp/reference#Data.Feature)
* [google.maps.Data.Geometry](https://developers.google.com/maps/documentation/javascript/3.exp/reference#Data.Geometry)
* [google.maps.Marker](https://developers.google.com/maps/documentation/javascript/3.exp/reference#Marker)
* [google.maps.InfoWindow](https://developers.google.com/maps/documentation/javascript/3.exp/reference#InfoWindow)
* [google.maps.Polyline](https://developers.google.com/maps/documentation/javascript/3.exp/reference#Polyline)
* [google.maps.Polygon](https://developers.google.com/maps/documentation/javascript/3.exp/reference#Polygon)
* [google.maps.Rectangle](https://developers.google.com/maps/documentation/javascript/3.exp/reference#Rectangle)
* [google.maps.Circle](https://developers.google.com/maps/documentation/javascript/3.exp/reference#Circle)
* [google.maps.GroundOverlay](https://developers.google.com/maps/documentation/javascript/3.exp/reference#GroundOverlay)
* [google.maps.OverlayView](https://developers.google.com/maps/documentation/javascript/3.exp/reference#OverlayView)
* [google.maps.LatLng](https://developers.google.com/maps/documentation/javascript/3.exp/reference#LatLng)
* [google.maps.MVCArray](https://developers.google.com/maps/documentation/javascript/3.exp/reference#MVCArray)

For example, on a google.maps.Map object some of the following getter/setter methods are added:
```javascript
let map = new google.maps.Map(document.getElementById('google-map'));
console.log(map.bounds) //from getBounds()
map.center = new LatLng(123.4, 68.0) //from getCenter() and setCenter(latlng)
if (map.clickableIcons === true) //from getClickableIcons() and setClickableIcons(value)
map.div.id === 'google-map' //from getDiv()
map.heading = 45 //from getHeading() and setHeading(heading)
```
The original methods aren't affected by this script, and the getters and setters simply map to the original methods. Check the Google Maps JavaScript API documentation to see all the methods, and if the method begins with get or set it should be avaliable as a getter or setter.

### Promises
Classes with callback functions have been modified to return promises. This mainly affects the Service classes, but Data and Data.Feature also return promises for loading and generating GeoJSON. All Promise returning methods are identical to the original, but have the suffix *Async* and don't take a callback as an argument. The following service classes are affected:
* [google.maps.Geocoder](https://developers.google.com/maps/documentation/javascript/3.exp/reference#Geocoder)
* [google.maps.DirectionsService](https://developers.google.com/maps/documentation/javascript/3.exp/reference#DirectionsService)
* [google.maps.ElevationService](https://developers.google.com/maps/documentation/javascript/3.exp/reference#ElevationService)
* [google.maps.MaxZoomService](https://developers.google.com/maps/documentation/javascript/3.exp/reference#MaxZoomService)
* [google.maps.DistanceMatrixService](https://developers.google.com/maps/documentation/javascript/3.exp/reference#DistanceMatrixService)
* [google.maps.StreetViewService](https://developers.google.com/maps/documentation/javascript/3.exp/reference#StreetViewService)
The service classes will resolve with the result if they receive a corrsponding OK status, or reject with the status if they receive a different status. For example:
```javascript
const g = new google.maps.Geocoder();
g.geocode({address: '123 Lane Ave'})
	.then(geocoderResultArray => { /* stuff with the results */ })
	.catch(status => { 
		if (status === google.maps.GeocoderStatus.ERROR)
			//handle different errors
	});
```

### Iterators
Some classes have been modified to implement [iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols). This lets you use newer ES2015 features with the classes, such as [destructuing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment), [for...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of), [Array.from()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from), and the [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator). See the classes below for details on their iterators.

### google.maps.Data

##### data.loadGeoJsonAsync: `Promise<Array<Data.Feature>>>`
Loads GeoJSON from a URL, and adds the features to the collection.

| Param   | Type     | Description  |
| ------- | -------- | ------------ |
| url     | `string` | URL to load from |
| options | [`Data.GeoJsonOptions`](https://developers.google.com/maps/documentation/javascript/3.exp/reference#Data.GeoJsonOptions) | |

##### data.toGeoJsonAsync: `Promise<Object>`
Exports the features in the collection to a GeoJSON object.

##### data[@@iterator] : `Iterator<Data.Feature>`
Loops through the features in the same order as `data.forEach(callback)`

##### data.keys() : `Iterator<number|string|undefined>`
Loops through the ID's of the features, obtained using `getId()`.

##### data.values() : `Iterator<Data.Feature>`
Same as the iterator

##### data.entries() : `Iterator<Array<number|string|undefined, Data.Feature>>`
Loops through the features and yields an array `[id, feature]`.

#### google.maps.Data.Feature

##### data.toGeoJsonAsync: `Promise<Object>`
Exports the feature to a GeoJSON object.

##### data[@@iterator] : `Iterator<Array<string, any>>`
Yeilds the properties of the feature as an array `[name, value]`

##### data.keys() : `Iterator<strings>`
Yields the property names of the feature

##### data.values() : `Iterator<any>`
Yields the property values of the feature

##### data.entries() : `Iterator<Array<string, any>>`
Same as the iterator

#### google.maps.Data.Geometry

##### data[@@iterator] : `Iterator<LatLng>`
Yields points from the geometry

##### data.keys() : `Iterator<number>`
Yields the indexes of the points of the geometry

##### data.values() : `Iterator<LatLng>`
Same as iterator

##### data.entries() : `Iterator<Array<number, LatLng>>`
Yeilds the points of the geometry as an array `[index, point]`

### google.maps.LatLng
The script adds various read-only aliases for lat() and lng(), as well as making LatLng array-like and adding an iterator.

| Property | Type     | Description  |
| -------- | -------- | ------------ |
| long     | `number` | Alias for lng() |
| x        | `number` | Alias for lng() |
| y        | `number` | Alias for lat() |
| 0        | `number` | Alias for lng() |
| 1        | `number` | Alias for lat() |
| length   | `number` | Value of 2. Makes LatLng an array-like |

##### latlng[@@iterator] : `Iterator<number>`
Yields lng(), then lat().

Example usage:
```javascript
const latlng = new google.maps.LatLng(123.4, 56.7);
const [lng, lat] = latlng;
const {x, y} = latlng;
```

### google.maps.MVCArray
Adds some array-like methods to MVCArray to make looping through it and exporting it easier. Note that the returned values are copies, so editing them won't affect the MVCArray.

##### mvcarray[@@iterator] : `Iterator<any>`
Yields the values from the array

##### mvcarray.keys() : `Iterator<number>`
Yields the indexs from the array
##### mvcarray.values() : `Iterator<any>`
Same as iterator
##### mvcarray.entries : `Iterator<Array<number, any>>`
Yields the entries of the MVCArray as `[index, value]`.

##### mvcarray.toJSON() : `Array`
Used by JSON.stringify. Converts the MVCArray into an array.

##### mvcarray.toString() : `string`
Converts the MVCArray into a string where each entry is joined by a comma.

##### mvcarray[@@toPrivitive] : `number|string`
Used when coering the array into a primivite, such as through `+mvcarray`.
Returns NaN if given the hint 'number', otherwise returns the same as toString().

Example usage:
```javascript
const mvc = new MVCArray();

//Convert to array
[...mvc];
mvc.toJSON();
Array.from(mvc);

//Convert to Map or Set
new Map(mvc.entires());
new Set(mvc);

//Destructing
const [firstPath, secondPath] = somePolygon.paths;
const [point1, point2, point3, point4] = someSquarePolygon.path;
```