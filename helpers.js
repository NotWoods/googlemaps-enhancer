export function* keys() {
	for (let [key, ] of this.entries()) yield key;
}

export function* values() {
	for (let [, value] of this.entries()) yield value;
}

export function iteratorSym() {
	return this.entries();
}

function padArray(array, desiredLength) {
	if (array.length < desiredLength) {
		const difference = desiredLength - array.length;
		return array.concat( Array(difference).fill(undefined) );
	}
	else return array;
}

export function promisify(func) {
	const funcLength = func.length - 1;
	return function(...args) {
		const paddedArgs = padArray(args, funcLength);
		return new Promise(resolve => func(...paddedArgs, resolve));
	}
}

export function promisifyMethod(methodName, thisArg = this) {
	return promisify(thisArg[methodName]);
}