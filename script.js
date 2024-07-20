// script.js
const display = document.getElementById('display');
const keys = document.querySelector('.calculator-keys');

let displayValue = '0';
let firstValue = null;
let operator = null;
let waitingForSecondValue = false;

keys.addEventListener('click', function(event) {
    const element = event.target;

    if (!element.matches('button')) return;

    if (element.dataset.action) {
        handleOperator(element.dataset.action);
    } else {
        handleNumber(element.textContent);
    }

    updateDisplay();
});

function handleNumber(number) {
    if (waitingForSecondValue) {
        displayValue = number;
        waitingForSecondValue = false;
    } else {
        displayValue = displayValue === '0' ? number : displayValue + number;
    }
}

function handleOperator(nextOperator) {
    const value = parseFloat(displayValue);

    if (operator && waitingForSecondValue) {
        operator = nextOperator;
        return;
    }

    if (firstValue === null) {
        firstValue = value;
    } else if (operator) {
        const result = calculate(firstValue, value, operator);
        displayValue = `${parseFloat(result.toFixed(7))}`;
        firstValue = result;
    }

    waitingForSecondValue = true;
    operator = nextOperator;
}

function calculate(first, second, operator) {
    if (operator === 'add') return first + second;
    if (operator === 'subtract') return first - second;
    if (operator === 'multiply') return first * second;
    if (operator === 'divide') return first / second;
    return second;
}

function updateDisplay() {
    display.textContent = displayValue;
}

document.querySelector('[data-action="clear"]').addEventListener('click', function() {
    displayValue = '0';
    firstValue = null;
    operator = null;
    waitingForSecondValue = false;
    updateDisplay();
});

document.querySelector('[data-action="delete"]').addEventListener('click', function() {
    displayValue = displayValue.slice(0, -1) || '0';
    updateDisplay();
});

document.querySelector('[data-action="equals"]').addEventListener('click', function() {
    const value = parseFloat(displayValue);
    
    if (operator && firstValue !== null && !waitingForSecondValue) {
        const result = calculate(firstValue, value, operator);
        displayValue = `${parseFloat(result.toFixed(7))}`;
        firstValue = null;
        operator = null;
        waitingForSecondValue = false;
        updateDisplay();
    }
});

document.querySelector('[data-action="decimal"]').addEventListener('click', function() {
    if (!displayValue.includes('.')) {
        displayValue += '.';
        updateDisplay();
    }
});
