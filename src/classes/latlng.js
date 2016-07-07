import {proxy} from '../enhancer.js';

export function LatLngProxy(latlngObject) {
	return new Proxy(proxy(latlngObject), {
		get(obj, prop, receiver) {
			if (prop === 'long' || prop === 'x'|| prop === 0) return obj.lng();
			else if (prop === 'y' || prop === 1) return obj.lat();
			else if (prop === 'length') return 2;
			else if (prop === Symbol.iterator) 
				return function*() {yield obj.lng(); yield obj.lat();}
			else return Reflect.get(obj, prop, receiver);
		}
	})
}