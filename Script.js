const display = document.getElementById('display');
const popSound = document.getElementById('popSound');

function playEffects() {
    popSound.currentTime = 0;
    popSound.play();
    if (navigator.vibrate) navigator.vibrate(20);
}

function appendNumber(num) {
    playEffects();
    if (display.value === '0') display.value = num;
    else display.value += num;
}

function appendOperator(op) {
    playEffects();
    let lastChar = display.value.slice(-1);
    if (['+', '-', '*', '/'].includes(lastChar)) {
        display.value = display.value.slice(0, -1) + op;
    } else {
        display.value += op;
    }
}

function clearDisplay() { playEffects(); display.value = '0'; }
function deleteLast() { playEffects(); display.value = display.value.slice(0, -1) || '0'; }

// ✅ FIX 1: Percentage now works properly
// If expression is like "200+50%", it calculates 50% of 200 = 100, giving 200+100
// If just a plain number like "75", it gives 75/100 = 0.75
function calculatePercent() {
    playEffects();
    try {
        let expr = display.value;

        // Match pattern like: number operator number  (e.g. "500+20" or "300-15")
        let match = expr.match(/^(-?\d+\.?\d*)([\+\-\*\/])(-?\d+\.?\d*)$/);

        if (match) {
            let left = parseFloat(match[1]);
            let operator = match[2];
            let right = parseFloat(match[3]);
            let result;

            if (operator === '+') result = left + (left * right / 100);
            if (operator === '-') result = left - (left * right / 100);
            if (operator === '*') result = left * (right / 100);
            if (operator === '/') result = left / (right / 100);

            addToHistory(expr + '%', result);
            display.value = result;

        } else {
            // Plain number: 20% → 0.2
            let val = parseFloat(expr);
            let result = val / 100;
            addToHistory(val + '%', result);
            display.value = result;
        }
    } catch {
        display.value = "Error";
    }
}

function calculate() {
    try {
        let expr = display.value.replace('×', '*').replace('÷', '/');
        let result = eval(expr);
        addToHistory(display.value, result);
        display.value = result;
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    } catch { display.value = "Error"; }
}

function calculateSquare() {
    let val = eval(display.value);
    let result = Math.pow(val, 2);
    display.value = result;
    addToHistory(val + "²", result);
}

function calculateInverse() {
    let val = eval(display.value);
    let result = (1 / val).toFixed(4);
    display.value = result;
    addToHistory("1/" + val, result);
}

function calculateScientific(type) {
    let val = eval(display.value);
    let result;
    if (type === 'sin') result = Math.sin(val * Math.PI / 180).toFixed(4);
    if (type === 'cos') result = Math.cos(val * Math.PI / 180).toFixed(4);
    if (type === 'tan') result = Math.tan(val * Math.PI / 180).toFixed(4);
    if (type === 'log') result = Math.log10(val).toFixed(4);
    if (type === 'sqrt') result = Math.sqrt(val).toFixed(4);
    display.value = result;
    addToHistory(type + "(" + val + ")", result);
}

function addToHistory(ques, ans) {
    const list = document.getElementById('history-list');
    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `<span class="history-expr">${ques}</span> = <span class="history-ans">${ans}</span>`;
    list.prepend(item);
}

// ✅ FIX 3: Clear history function
function clearHistory() {
    document.getElementById('history-list').innerHTML = '';
}

function toggleMode() {
    document.body.classList.toggle('light-mode');
    document.body.classList.toggle('dark-mode');
    document.getElementById('modeBtn').innerText =
        document.body.classList.contains('light-mode') ? "Dark Mode" : "Light Mode";
}
