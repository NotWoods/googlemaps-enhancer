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