'use-strict';

class netPresentValueCalculator {
	constructor() {
		this.discountRate = 0;
		this.initialInvestment = 0;
		this.numberOfPeriods = 0;
		this.cashFlows = [];
		this.presentValueOfCashFlows = [];
	}

	hello() {
		return 'hello';
	}

	getDiscountRate() {
		return this.discountRate * 100;
	}

	setDiscountRate(rate) {
		const newRate = parseFloat(rate / 100);
		return (this.discountRate = newRate);
	}

	getInitialInvestment() {
		return this.initialInvestment;
	}

	setInitialInvestment(investmentAmount) {
		let newAmount = -investmentAmount;
		if (!investmentAmount) newAmount = 0;
		this.initialInvestment = newAmount;

		if (this.cashFlows.length === this.numberOfPeriods) {
			this.cashFlows.unshift(newAmount);
		} else {
			this.cashFlows.splice(0, 1, newAmount);
		}
	}

	setNumberOfPeriods(period) {
		this.numberOfPeriods = period;
	}

	matchCashFlowsToNumberOfPeriods(period) {
		let newCashFlows;
		this.initialInvestment ? (newCashFlows = [this.initialInvestment]) : (newCashFlows = [0]);

		for (let i = 0; i < period; i++) {
			newCashFlows.push(0);
		}

		this.cashFlows = newCashFlows;
	}

	processPeriodLength(period) {
		const periodToNumber = +period;
		return this.setNumberOfPeriods(periodToNumber), this.matchCashFlowsToNumberOfPeriods(periodToNumber);
	}

	getPeriodLength() {
		return this.numberOfPeriods;
	}
	getCashFlows() {
		return this.cashFlows;
	}
	setCashFlows(period, amount) {
		this.cashFlows[+period] = +amount;
	}
	updatePresentValueCashFlowsArray() {
		const newArr = [...this.cashFlows];
		return (this.presentValueOfCashFlows = newArr.map((value, index) => {
			const npvValue = value / Math.pow(1 + this.discountRate, index);
			return +npvValue.toFixed(2);
		}));
	}

	getTotalPresentValueOfCashFlows() {
		return this.presentValueOfCashFlows.reduce((acc, curr, idx) => {
			return idx > 0 ? acc + curr : acc;
		});
	}

	calculateNPV() {
		console.log(this.cashFlows);
		console.log(this.discountRate);
		this.updatePresentValueCashFlowsArray();
		console.log(this.presentValueOfCashFlows);
		return {
			npv: this.getTotalPresentValueOfCashFlows(),
			pvcfs: this.presentValueOfCashFlows,
		};
	}
}

module.exports = new netPresentValueCalculator();
