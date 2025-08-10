// Basic calculator logic
(() => {
  const displayEl = document.getElementById('display');
  const btns = document.querySelectorAll('.btn');
  let current = '0';
  let previous = null;
  let operator = null;
  let waitingForNewNumber = false;

  function updateDisplay() {
    displayEl.textContent = current;
  }

  function inputDigit(d) {
    if (waitingForNewNumber) {
      current = d === '.' ? '0.' : d;
      waitingForNewNumber = false;
      return;
    }
    if (d === '.' && current.includes('.')) return;
    current = current === '0' && d !== '.' ? d : current + d;
  }

  function clearAll() {
    current = '0';
    previous = null;
    operator = null;
    waitingForNewNumber = false;
  }

  function backspace() {
    if (waitingForNewNumber) return;
    if (current.length === 1 || (current.length === 2 && current.startsWith('-'))) {
      current = '0';
    } else {
      current = current.slice(0, -1);
    }
  }

  function handleOperator(nextOp) {
    const inputValue = parseFloat(current);
    if (operator && !waitingForNewNumber) {
      // perform the previous operation first
      const result = compute(previous, inputValue, operator);
      current = String(result);
      previous = result;
    } else {
      previous = inputValue;
    }
    operator = nextOp;
    waitingForNewNumber = true;
  }

  function compute(a, b, op) {
    if (op === '+') return a + b;
    if (op === '-') return a - b;
    if (op === '*') return a * b;
    if (op === '/') {
      if (b === 0) return 'Error';
      return a / b;
    }
    return b;
  }

  function handleEquals() {
    if (operator == null || waitingForNewNumber) return;
    const inputValue = parseFloat(current);
    const result = compute(previous, inputValue, operator);
    current = String(result);
    previous = null;
    operator = null;
    waitingForNewNumber = false;
  }

  btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const num = btn.getAttribute('data-num');
      const op = btn.getAttribute('data-op');

      if (num !== null) {
        inputDigit(num);
        updateDisplay();
        return;
      }
      if (op !== null) {
        handleOperator(op);
        updateDisplay();
        return;
      }
      if (btn.id === 'clear') {
        clearAll();
        updateDisplay();
        return;
      }
      if (btn.id === 'back') {
        backspace();
        updateDisplay();
        return;
      }
      if (btn.id === 'equals') {
        handleEquals();
        updateDisplay();
        return;
      }
    });
  });

  // keyboard support
  window.addEventListener('keydown', (e) => {
    const key = e.key;
    if ((/^[0-9.]$/).test(key)) {
      e.preventDefault();
      inputDigit(key);
      updateDisplay();
      return;
    }
    if (key === 'Backspace') { backspace(); updateDisplay(); return; }
    if (key === 'Escape') { clearAll(); updateDisplay(); return; }
    if (key === 'Enter' || key === '=') { handleEquals(); updateDisplay(); return; }
    if (['+','-','*','/'].includes(key)) { handleOperator(key); updateDisplay(); return; }
  });

  // initialize
  updateDisplay();
})();
