'use strict';

const npv = new netPresentValueCalculator();

const discountRate = () => npv.getDiscountRate();
const initialInvestment = () => npv.getInitialInvestment();
const setDiscountRate = (rate) => npv.setDiscountRate(rate);
const setInitialInvestment = (investment) => npv.setInitialInvestment(investment);
const processPeriodLength = (period) => npv.processPeriodLength(period);
const periodLength = () => npv.getPeriodLength();
const setCashFlows = (year, amount) => npv.setCashFlows(year, amount);
const getCashFlows = () => npv.getCashFlows();
const calculateNPV = () => npv.calculateNPV();

function checkButtonValidity() {
	const getSubmitButton = document.querySelector('.form-submit');

	if (discountRate() !== 0 && initialInvestment() !== 0 && periodLength() > 0) {
		return (getSubmitButton.disabled = false);
	} else {
		return (getSubmitButton.disabled = true);
	}
}

function numberFormatter(event) {
	const getClassName = document.getElementsByClassName(event.target.className);
	let newNumber = event.target.value;

	if (!newNumber || newNumber === '-') {
		return {
			str: newNumber,
			int: 0,
		};
	}

	if (!/^-?\d*[.,]?\d*$/.test(parseFloat(event.target.value.replace(/,/g, '')))) {
		newNumber = event.target.value
			.split('')
			.filter((char) => char !== event.key)
			.join('');
	} else {
		newNumber = parseFloat(event.target.value.replace(/,/g, '')).toLocaleString('en-US');
	}

	event.target.className === 'cf-input'
		? (getClassName[event.target.dataset.year - 1].value = newNumber)
		: (getClassName[0].value = newNumber);

	const newNumObj = {
		str: newNumber,
		int: parseFloat(newNumber.replace(/,/g, '')),
	};

	return newNumObj;
}

function discountRateHandler(event) {
	setDiscountRate(numberFormatter(event).int);
	return checkButtonValidity();
}

function initialInvestmentEventHandler(event) {
	const amount = numberFormatter(event);
	setInitialInvestment(amount.int);

	if (document.querySelector('.cf-input-col2')) {
		const updateCashFlowInput = document.querySelector('.initial');
		updateCashFlowInput.innerHTML = '$ ' + initialInvestment().toLocaleString();
	}

	return checkButtonValidity();
}

function periodEventHandler(event) {
	const period = numberFormatter(event).int;

	if (event.target.value < 0) {
		event.target.value = '1';
		alert('Must be zero or greater.');
	}
	if (event.target.value > 30) {
		event.target.value = '30';
		alert('Max value of 30 periods.');
	}

	const cashflowInputDiv = document.querySelector('.cash-flow-input');
	cashflowInputDiv.style.display = 'block';

	processPeriodLength(Math.ceil(period));
	checkButtonValidity();
	return cashFlowArrayToTable(getCashFlows(), 'cash flow');
}

function calculateHandler() {
	const results = calculateNPV();
	const npv = results.npv;
	const pvcfs = results.pvcfs;

	const resultSummary = document.querySelector('.results-summary');
	resultSummary.innerHTML = 'Net Present Value: $ ' + parseFloat(npv).toLocaleString();

	const resultsDiv = document.querySelector('#results');
	resultsDiv.style.display = 'block';

	cashFlowArrayToTable(pvcfs, 'results');
}

function cashFlowArrayToTable(cashFlowArray, type) {
	let headerColumn1 = 'Year';
	let headerColumn2 = 'PV of Cash Flows Discounted at ' + discountRate() * 100 + '%';
	let placement = document.querySelector('.npv-results-table');
	let className = 'pv-cash-flow';
	let tableDepth = cashFlowArray.length + 1;
	let requiresInput = false;

	if (type === 'cash flow') {
		headerColumn2 = 'Cash Flow';
		placement = document.querySelector('.cash-flow-input');
		className = 'cf-input';
		requiresInput = true;
	}

	placement.innerHTML = '';

	for (let i = 0; i < tableDepth; i++) {
		const newRow = document.createElement('div');
		newRow.className = className + '-row';
		placement.appendChild(newRow);

		const newRowCol1 = document.createElement('div');
		newRowCol1.className = className + '-col1';
		newRowCol1.innerHTML = i - 1;
		newRow.appendChild(newRowCol1);

		const newRowCol2 = document.createElement('div');
		newRowCol2.className = className + '-col2';
		newRow.appendChild(newRowCol2);

		if (i === 0) {
			newRowCol1.innerHTML = headerColumn1;
			newRowCol1.className = 'col1-header';
			newRowCol2.className = 'col2-header';
		}

		if (requiresInput && i > 0) {
			if (i === 1) {
				newRowCol2.innerHTML = '$ ' + Number(cashFlowArray[i - 1]).toLocaleString();
				newRowCol2.className = className + '-col2 initial';
				continue;
			}
			const newCashFlowInput = document.createElement('input');
			newCashFlowInput.type = 'text';
			newCashFlowInput.className = 'cf-input';
			newCashFlowInput.dataset.year = i - 1;
			newCashFlowInput.setAttribute('name', 'cash-flow-input');
			newCashFlowInput.placeholder = '0';
			newRowCol2.appendChild(newCashFlowInput);

			['keyup', 'change'].forEach((event) => {
				newCashFlowInput.addEventListener(event, inputEventHandler, false);
			});

			function inputEventHandler(event) {
				if (event.target.value.includes('.')) {
					return setTimeout(() => {
						setCashFlows(event.target.dataset.year, numberFormatter(event).int);
					}, 1000);
				}
				setCashFlows(event.target.dataset.year, numberFormatter(event).int);
			}
		} else if (i > 0) {
			newRowCol2.innerHTML = parseFloat(cashFlowArray[i - 1]).toLocaleString();
		} else {
			newRowCol2.innerHTML = headerColumn2;
		}
	}
}

function switchNames(event) {
	switch (event.target.name) {
		case 'rate':
			return discountRateHandler(event);
		case 'initial-investment':
			return initialInvestmentEventHandler(event);
		case 'period':
			return periodEventHandler(event);
		default:
			return;
	}
}

const eventHandler = (event) => {
	if (event.target.value.includes('.')) {
		setTimeout(() => {
			switchNames(event);
		}, 1000);
	} else {
		switchNames(event);
	}
};

const formInputs = document.querySelectorAll('input');
formInputs.forEach((input) => {
	['keyup', 'change'].forEach((event) => input.addEventListener(event, eventHandler, false));
});

const calculateButton = document.querySelector('.form-submit');
calculateButton.addEventListener('click', (event) => {
	event.preventDefault();
	calculateHandler();
});
