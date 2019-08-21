const assert = require('assert');
const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const calculator = require('../js/calculator.js');

describe('NPV Calculator', function() {
	it('should set and retrieve discount rate of type number', () => {
		calculator.setDiscountRate('5');
		assert.equal(typeof calculator.getDiscountRate(), 'number');
		assert.equal(calculator.getDiscountRate(), 5);
	});

	it('should set and retrive initial investment of type number', () => {
		calculator.setInitialInvestment('100000');
		assert.equal(typeof calculator.getInitialInvestment(), 'number');
		assert.equal(calculator.getInitialInvestment(), -100000);
	});

	it('should set and retrieve the number of periods of type number AND update the cash flow array length to the number of periods + 1', () => {
		calculator.processPeriodLength('3');
		assert.equal(typeof calculator.getPeriodLength(), 'number');
		expect(calculator.getPeriodLength()).to.equal(3);
		expect(calculator.getCashFlows().length).to.equal(4);
	});

	it('should calculate net present value with both positive and negative initial investments', () => {
		calculator.setDiscountRate('2');
		calculator.setInitialInvestment('10000');
		calculator.processPeriodLength('3');
		calculator.setCashFlows('1', '20000');
		calculator.setCashFlows('2', '20000');
		calculator.setCashFlows('3', '15000');
		expect(calculator.calculateNPV().npv).to.equal(42966.06);
	});
});
