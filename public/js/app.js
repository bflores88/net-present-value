'use strict';

const npv = netPresentValue();

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
	const formattedNumber = parseFloat(event.target.value.replace(/,/g, '')).toLocaleString('en-US');
	const getClassName = document.getElementsByClassName(event.target.className);
	getClassName === 'cf-input'
		? (getClassName[event.target.dataset.year - 1].value = formattedNumber)
		: (getClassName[0].value = formattedNumber);
}

function discountRateHandler(event) {
	setDiscountRate(event.target.value);
	return checkButtonValidity();
}

function initialInvestmentEventHandler(event) {
	if (periodLength()) {
		const updateCashFlowInput = document.querySelector('.initial');
		updateCashFlowInput.innerHTML = '$ ' + Number(event.target.value).toLocaleString();
	}

	setInitialInvestment(event.target.value);
	numberFormatter(event);
	return checkButtonValidity();
}

function periodEventHandler(event) {
	if (!Number.isInteger(event.target.value)) {
		event.target.value = Math.round(event.target.value);
	}
	if (event.target.value < 1) {
		event.target.value = '1';
	}
	if (event.target.value > 30) {
		event.target.value = '30';
		alert('Max value of 30 periods');
	}

	const cashflowInputDiv = document.querySelector('.cash-flow-input');
	cashflowInputDiv.style.display = 'block';

	processPeriodLength(Math.round(event.target.value));
	checkButtonValidity();
	return cashFlowArrayToTable(getCashFlows(), 'cash flow');
}

function calculateHandler() {
	const results = calculateNPV();
	const npv = results.npv;
	const pvcfs = results.pvcfs;

	const resultSummary = document.querySelector('.results-summary');
	resultSummary.innerHTML = 'Net Present Value: ' + npv;

	const resultsDiv = document.querySelector('#results');
	resultsDiv.style.display = 'block';

	cashFlowArrayToTable(pvcfs, 'results');
}

function cashFlowArrayToTable(cashFlowArray, type) {
	let headerColumn1 = 'Year';
	let headerColumn2 = 'Present Value of Cash Flows';
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
		i === 0 ? (newRowCol1.innerHTML = headerColumn1) : (newRowCol1.innerHTML = i - 1);
		newRow.appendChild(newRowCol1);

		const newRowCol2 = document.createElement('div');
		newRowCol2.className = className + '-col2';
		newRow.appendChild(newRowCol2);

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
				numberFormatter(event);
				setCashFlows(event.target.dataset.year, event.target.value);
			}
		} else if (i > 0) {
			newRowCol2.innerHTML = cashFlowArray[i - 1];
		} else {
			newRowCol2.innerHTML = headerColumn2;
		}
	}
}

const eventHandler = (event) => {
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
