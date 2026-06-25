 const TOTAL_QUESTIONS = 30;

    const startScreen = document.getElementById('startScreen');
    const quizScreen = document.getElementById('quizScreen');
    const resultScreen = document.getElementById('resultScreen');
    const testName = document.getElementById('testName');
    const questionCounter = document.getElementById('questionCounter');
    const liveScore = document.getElementById('liveScore');
    const questionText = document.getElementById('questionText');
    const answerForm = document.getElementById('answerForm');
    const answerInput = document.getElementById('answerInput');
    const submitBtn = document.getElementById('submitBtn');
    const nextBtn = document.getElementById('nextBtn');
    const feedbackBox = document.getElementById('feedbackBox');
    const finalTestName = document.getElementById('finalTestName');
    const finalScore = document.getElementById('finalScore');
    const correctCount = document.getElementById('correctCount');
    const missedCount = document.getElementById('missedCount');
    const percentScore = document.getElementById('percentScore');
    const playAgainBtn = document.getElementById('playAgainBtn');

    let state = {
      age: 10,
      tone: 'encouraging',
      currentQuestionNumber: 0,
      correct: 0,
      currentProblem: null,
      usedQuestions: new Set(),
      hasAnsweredCurrent: false
    };

    document.querySelectorAll('.test-card').forEach(card => {
      card.addEventListener('click', () => {
        startTest(Number(card.dataset.age), card.dataset.tone);
      });
    });

    answerForm.addEventListener('submit', event => {
      event.preventDefault();
      checkAnswer();
    });

    nextBtn.addEventListener('click', () => {
      if (state.currentQuestionNumber >= TOTAL_QUESTIONS) {
        showResults();
      } else {
        loadNextQuestion();
      }
    });

    playAgainBtn.addEventListener('click', () => {
      showScreen(startScreen);
    });

    function showScreen(screen) {
      [startScreen, quizScreen, resultScreen].forEach(section => section.classList.remove('active'));
      screen.classList.add('active');
    }

    function startTest(age, tone) {
      state = {
        age,
        tone,
        currentQuestionNumber: 0,
        correct: 0,
        currentProblem: null,
        usedQuestions: new Set(),
        hasAnsweredCurrent: false
      };

      testName.textContent = `${age}-Year-Old ${tone === 'encouraging' ? 'Test A' : 'Test B'}`;
      showScreen(quizScreen);
      loadNextQuestion();
    }

    function loadNextQuestion() {
      state.currentQuestionNumber++;
      state.hasAnsweredCurrent = false;
      state.currentProblem = generateUniqueProblem(state.age);

      questionCounter.textContent = `Question ${state.currentQuestionNumber} of ${TOTAL_QUESTIONS}`;
      liveScore.textContent = `Score: ${state.correct}/${state.currentQuestionNumber - 1}`;
      questionText.textContent = state.currentProblem.question;
      answerInput.value = '';
      answerInput.disabled = false;
      submitBtn.style.display = 'inline-block';
      nextBtn.style.display = 'none';
      feedbackBox.className = 'feedback';
      feedbackBox.textContent = '';
      answerInput.focus();
    }

    function checkAnswer() {
      if (state.hasAnsweredCurrent) return;

      const userAnswer = normalizeAnswer(answerInput.value);
      if (userAnswer === '') return;

      const correctAnswer = normalizeAnswer(String(state.currentProblem.answer));
      const isCorrect = userAnswer === correctAnswer;

      if (isCorrect) state.correct++;
      state.hasAnsweredCurrent = true;

      const feedback = getFeedback(isCorrect);
      feedbackBox.textContent = feedback;
      feedbackBox.className = `feedback show ${isCorrect ? 'correct' : 'wrong'} ${state.tone === 'discouraging' ? 'discouraging' : ''}`;

      liveScore.textContent = `Score: ${state.correct}/${state.currentQuestionNumber}`;
      answerInput.disabled = true;
      submitBtn.style.display = 'none';
      nextBtn.style.display = 'inline-block';

      if (state.currentQuestionNumber >= TOTAL_QUESTIONS) {
        nextBtn.textContent = 'See Final Score';
      } else {
        nextBtn.textContent = 'Next Question';
      }
    }

    function getFeedback(isCorrect) {
      let list;

      if (state.tone === 'encouraging') {
        list = isCorrect ? encouragingCorrect : encouragingWrong;
      } else {
        list = isCorrect ? discouragingCorrect : discouragingWrong;
      }

      return list[randomInt(0, list.length - 1)];
    }

    function showResults() {
      const missed = TOTAL_QUESTIONS - state.correct;
      const percent = Math.round((state.correct / TOTAL_QUESTIONS) * 100);

      finalTestName.textContent = `${state.age}-Year-Old ${state.tone === 'encouraging' ? 'Encouraging Test' : 'Discouraging Test'}`;
      finalScore.textContent = `${state.correct} out of ${TOTAL_QUESTIONS}`;
      correctCount.textContent = state.correct;
      missedCount.textContent = missed;
      percentScore.textContent = `${percent}%`;
      showScreen(resultScreen);
    }

    function generateUniqueProblem(age) {
      let problem;
      let safetyCount = 0;

      do {
        problem = age === 10 ? generateAge10Problem() : generateAge12Problem();
        safetyCount++;
      } while (state.usedQuestions.has(problem.question) && safetyCount < 1000);

      state.usedQuestions.add(problem.question);
      return problem;
    }

    function generateAge10Problem() {
      const type = randomChoice(['addition', 'subtraction', 'multiplication', 'division', 'mixed']);

      if (type === 'addition') {
        const a = randomInt(20, 99);
        const b = randomInt(10, 99);
        return makeProblem(`${a} + ${b}`, a + b);
      }

      if (type === 'subtraction') {
        const a = randomInt(40, 150);
        const b = randomInt(10, a - 1);
        return makeProblem(`${a} - ${b}`, a - b);
      }

      if (type === 'multiplication') {
        const a = randomInt(3, 12);
        const b = randomInt(3, 12);
        return makeProblem(`${a} × ${b}`, a * b);
      }

      if (type === 'division') {
        const answer = randomInt(2, 12);
        const divisor = randomInt(2, 12);
        const dividend = answer * divisor;
        return makeProblem(`${dividend} ÷ ${divisor}`, answer);
      }

      const a = randomInt(2, 10);
      const b = randomInt(2, 10);
      const c = randomInt(5, 30);
      return makeProblem(`(${a} × ${b}) + ${c}`, (a * b) + c);
    }

    function generateAge12Problem() {
      const type = randomChoice([
        'addition',
        'subtraction',
        'multiplication',
        'division',
        'fractions',
        'decimals',
        'exponents',
        'order'
      ]);

      if (type === 'addition') {
        const a = randomInt(100, 999);
        const b = randomInt(100, 999);
        return makeProblem(`${a} + ${b}`, a + b);
      }

      if (type === 'subtraction') {
        const a = randomInt(200, 1200);
        const b = randomInt(50, a - 1);
        return makeProblem(`${a} - ${b}`, a - b);
      }

      if (type === 'multiplication') {
        const a = randomInt(11, 25);
        const b = randomInt(6, 18);
        return makeProblem(`${a} × ${b}`, a * b);
      }

      if (type === 'division') {
        const answer = randomInt(8, 60);
        const divisor = randomInt(3, 16);
        const dividend = answer * divisor;
        return makeProblem(`${dividend} ÷ ${divisor}`, answer);
      }

      if (type === 'fractions') {
        const denominator = randomChoice([4, 6, 8, 10, 12]);
        const n1 = randomInt(1, denominator - 1);
        const n2 = randomInt(1, denominator - n1);
        const numeratorAnswer = n1 + n2;
        return makeProblem(`${n1}/${denominator} + ${n2}/${denominator}`, simplifyFraction(numeratorAnswer, denominator));
      }

      if (type === 'decimals') {
        const a = randomInt(10, 99) / 10;
        const b = randomInt(2, 20) / 10;
        const answer = Number((a * b).toFixed(2));
        return makeProblem(`${a} × ${b}`, answer);
      }

      if (type === 'exponents') {
        const base = randomInt(2, 9);
        const exponent = randomChoice([2, 3]);
        const extra = randomInt(1, 20);
        return makeProblem(`${base}${toSuperscript(exponent)} + ${extra}`, Math.pow(base, exponent) + extra);
      }

      const a = randomInt(2, 12);
      const b = randomInt(2, 12);
      const c = randomInt(10, 80);
      return makeProblem(`${c} - (${a} × ${b})`, c - (a * b));
    }

    function makeProblem(question, answer) {
      return { question: `${question} = ?`, answer };
    }

    function simplifyFraction(numerator, denominator) {
      const factor = gcd(numerator, denominator);
      numerator = numerator / factor;
      denominator = denominator / factor;

      if (denominator === 1) return String(numerator);
      return `${numerator}/${denominator}`;
    }

    function gcd(a, b) {
      while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
      }
      return a;
    }

    function normalizeAnswer(value) {
      return value
        .trim()
        .replace(/\s+/g, '')
        .replace('−', '-')
        .toLowerCase();
    }

    function randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function randomChoice(array) {
      return array[Math.floor(Math.random() * array.length)];
    }

    function toSuperscript(number) {
      const map = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
      return String(number).split('').map(digit => map[digit]).join('');
    }