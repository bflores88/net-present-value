const assert = require('assert');
const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const calculator = require('../js/calculator');

describe('NPV Calculator', function() {
	it('should be a function', () => {
		expect(calculator.netPresentValue).to.exist;
		expect(calculator.netPresentValue).to.be.an('function');
	});

	it('should set and retrieve discount rate of type number', () => {
		const setDiscountRate = calculator.netPresentValue.setDiscountRate;
		expect(setDiscountRate).to.exist;
	});
});
