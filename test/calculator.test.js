const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const netPresentValue = require('../public/js/calculator');

describe('NPV Calculator', function() {
	const npv = netPresentValue;

	it('should be a function', () => {
		expect(npv).to.exist;
		expect(npv).to.be.an('function');
	});
});
