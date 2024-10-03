class TriviaGame {
    constructor(questions) {
        this.questions = questions;
        this.container = document.getElementById('game-container');
        this.currentQuestion = 0;
        this.score = 0;
        this.timer = null;
        this.timeLeft = 15;
        this.totalQuestions = questions.length;
    }

    init() {
        this.showQuestion();
    }

    showQuestion() {
        if (this.currentQuestion >= this.questions.length) {
            this.showResult();
            return;
        }

        const question = this.questions[this.currentQuestion];
        const progress = ((this.currentQuestion) / this.totalQuestions) * 100;

        const html = `
            <div class="timer" id="timer">${this.timeLeft}s</div>
            <div class="progress-bar">
                <div class="progress" style="width: ${progress}%"></div>
            </div>
            <div class="score">Score: ${this.currentQuestion}/${this.totalQuestions}</div>
            <div class="question fade">${question.question}</div>
            <div class="options fade">
                ${question.options.map((option, index) => `
                    <div class="option" data-index="${index}">${option}</div>
                `).join('')}
            </div>
        `;

        this.container.innerHTML = html;

        document.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', (e) => this.handleAnswer(parseInt(e.target.dataset.index)));
        });

        this.startTimer();
    }

    startTimer() {
        this.timeLeft = 15;
        clearInterval(this.timer);
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            document.getElementById('timer').textContent = `${this.timeLeft}s`;

            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.handleTimeout();
            }
        }, 1000);
    }

    handleTimeout() {
        const options = document.querySelectorAll('.option');
        const correctIndex = this.questions[this.currentQuestion].correct;
        
        options[correctIndex].classList.add('correct');
        
        setTimeout(() => {
            this.currentQuestion++;
            this.showQuestion();
        }, 1500);
    }

    handleAnswer(selectedIndex) {
        clearInterval(this.timer);
        const correctIndex = this.questions[this.currentQuestion].correct;
        const options = document.querySelectorAll('.option');

        options.forEach(option => option.style.pointerEvents = 'none');

        if (selectedIndex === correctIndex) {
            options[selectedIndex].classList.add('correct');
            this.score++;
        } else {
            options[selectedIndex].classList.add('wrong');
            options[correctIndex].classList.add('correct');
        }

        setTimeout(() => {
            this.currentQuestion++;
            this.showQuestion();
        }, 1500);
    }

    showResult() {
        const percentage = (this.score / this.totalQuestions) * 100;
        let message = '';
        
        if (percentage === 100) message = "Perfect Score! You're a genius! 🏆";
        else if (percentage >= 80) message = "Excellent work! 🌟";
        else if (percentage >= 60) message = "Good job! 👍";
        else message = "Keep practicing! 💪";

        const html = `
            <div class="result fade">
                <h2>${message}</h2>
                <div class="stats">
                    <div class="stat">
                        <div class="stat-value">${this.score}</div>
                        <div class="stat-label">Correct</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">${this.totalQuestions - this.score}</div>
                        <div class="stat-label">Wrong</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">${percentage.toFixed(0)}%</div>
                        <div class="stat-label">Score</div>
                    </div>
                </div>
                <button class="btn" onclick="startNewGame()">Play Again</button>
            </div>
        `;

        this.container.innerHTML = html;
    }
}

let game;

function startNewGame() {
    fetch('questions.json')
        .then(response => response.json())
        .then(questions => {
            game = new TriviaGame(questions);
            game.init();
        })
        .catch(error => console.error('Error loading questions:', error));
}

// Start the game when the page loads
startNewGame();
