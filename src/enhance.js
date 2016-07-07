/**
 * Adds getter and setter methods only a class' prototype
 * @param {any} someClass
 */
export default function enhancer(someClass) {
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

function transformCheck(text, object, prefix, length) {
	const etter = prefix + text.charAt(0) + text.substr(1), 
		proto = object.prototype;
	if (etter in proto && proto[etter].length === length) return etter; 
	else return text;
}

export const handler = {
	get(obj, prop, receiver) {
		return Reflect.get(obj, transformCheck(prop,obj,'get',0), receiver);
	},
	set(obj, prop, value, receiver) {
		return Reflect.set(obj, transformCheck(prop,obj,'set',1), value, receiver);
	}
}

export function proxy(gMapObject) {
	return new Proxy(gMapObject, handler)
}