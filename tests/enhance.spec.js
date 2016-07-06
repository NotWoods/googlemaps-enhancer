import test from 'tape';
import enhance from '../src/enhance.js'

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