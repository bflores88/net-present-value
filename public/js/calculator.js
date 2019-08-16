'use-strict';

function netPresentValue() {
	let discountRate = 0;
	let initialInvestment = 0;
	let numberOfPeriods = 0;
	let cashFlows = [];
	let presentValueOfCashFlows = [];

	const getDiscountRate = () => discountRate;
	const setDiscountRate = (rate) => (discountRate = +rate / 100);
	const getInitialInvestment = () => initialInvestment;

	const setInitialInvestment = (investmentAmount) => {
		initialInvestment = +investmentAmount;
		if (cashFlows.length === numberOfPeriods) {
			cashFlows.unshift(+investmentAmount);
		} else {
			cashFlows.splice(0, 1, +investmentAmount);
		}
	};

	const setNumberOfPeriods = (period) => (numberOfPeriods = period);
	const matchCashFlowsToNumberOfPeriods = (period) => {
		let newCashFlows;
		initialInvestment ? (newCashFlows = [initialInvestment]) : (newCashFlows = [0]);

		for (let i = 0; i < period; i++) {
			newCashFlows.push(0);
		}

		cashFlows = newCashFlows;
	};

	const processPeriodLength = (period) => {
		const periodToNumber = +period;
		return setNumberOfPeriods(periodToNumber), matchCashFlowsToNumberOfPeriods(periodToNumber);
	};

	const getPeriodLength = () => numberOfPeriods;
	const getCashFlows = () => cashFlows;
	const setCashFlows = (period, amount) => (cashFlows[+period] = +amount);

	const updatePresentValueCashFlowsArray = () => {
		const newArr = [...cashFlows];
		return (presentValueOfCashFlows = newArr.map((value, index) => {
			const npvValue = value / Math.pow(1 + discountRate, index);
			return +npvValue.toFixed(2);
		}));
	};

	const getTotalPresentValueOfCashFlows = () => {
		return presentValueOfCashFlows.reduce((acc, curr, idx) => {
			return idx > 0 ? acc + curr : acc;
		});
	};

	const calculateNPV = () => {
		updatePresentValueCashFlowsArray();
		return {
			npv: getTotalPresentValueOfCashFlows(),
			pvcfs: presentValueOfCashFlows,
		};
	};

	return {
		setDiscountRate,
		getDiscountRate,
		setInitialInvestment,
		getInitialInvestment,
		processPeriodLength,
		getPeriodLength,
		getCashFlows,
		setCashFlows,
		calculateNPV,
		getTotalPresentValueOfCashFlows,
	};
}
