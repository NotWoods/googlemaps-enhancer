import test from 'tape';
import enhance, {stripGetSet} from './enhance.js'

test('stripGetSet', t => {
	t.plan(3);

	t.equal(stripGetSet('getBounds'), 'bounds',
		'Removes get from the start of the string ' + 
		'and makes the first character lowercase');
	
	t.equal(stripGetSet('setCenter'), 'center',
		'Removes set from the start of the string');

	t.assert(!stripGetSet('panBy'),
		`Returns a falsy value if the string doesn't start with get or set`);
})

test('enhancer', t => {
	const fakeMapPrototype = {
		fitBounds(a) {},
		getBounds() {return 'bounds'},
		getCenter() {},
		getClickableIcons() {},
		getDiv() {},
		panBy(a, b) {},
		setCenter(c) {},
		setClickableIcons(c) {},
		setHeading(c) {}
	};
	const gMap = Object.create(fakeMapPrototype);
	enhance(gMap);

	t.equal(gMap.bounds, 'bounds',
		'Created bounds getter to reflect getBounds');

	t.end();
})