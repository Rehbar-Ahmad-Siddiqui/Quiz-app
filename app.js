// DOM elements
const startContainer = document.getElementById('start-container');
const startButton = document.getElementById('start-button');
const quizContainer = document.getElementById('quiz-container');
const nextButton = document.getElementById('next-button');
const finishButton = document.getElementById('finish-button');
const resultContainer = document.getElementById('result-container');
const questionContainer = document.getElementById('question-container');
const answerButtons = document.getElementById('answer-buttons');
const viewSolutionsButton = document.getElementById('view-solutions-button');
const solutionsContainer = document.getElementById('solutions-container');
const nameInput = document.getElementById('name');
const userDisplay = document.getElementById('user-display');
const profileImageInput = document.getElementById('profile-image');
const profilePicture = document.getElementById('profile-picture');

// Quiz variables
let currentQuestionIndex = 0;
let correctAnswers = 0;
let timer;
let userImageURL;
let videoStream;

// Function to start the camera
function startCamera() {
    navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(stream => {
            videoStream = stream;
            const videoElement = document.getElementById('camera-preview');
            videoElement.srcObject = stream;
            document.getElementById('start-camera-button').disabled = true;
            document.getElementById('stop-camera-button').disabled = false;
        })
        .catch(error => {
            console.error('Error accessing camera:', error);
        });
}

// Function to stop the camera
function stopCamera() {
    if (videoStream) {
        const tracks = videoStream.getTracks();
        tracks.forEach(track => track.stop());
        const videoElement = document.getElementById('camera-preview');
        videoElement.srcObject = null;
        document.getElementById('start-camera-button').disabled = false;
        document.getElementById('stop-camera-button').disabled = true;
    }
}

// Function to start the quiz
function startQuiz() {
    const userName = nameInput.value.trim();

    if (userName === "") {
        alert("To get started! Please enter your name.");
        return;
    }

    // Handle profile picture upload
    const file = profileImageInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            userImageURL = e.target.result;
            profilePicture.src = userImageURL;
        };
        reader.readAsDataURL(file);
    }

    // Hide start container and show quiz container
    startContainer.classList.add('hide');
    quizContainer.classList.remove('hide');
    nextButton.classList.remove('hide');
    finishButton.classList.remove('hide');
    viewSolutionsButton.classList.add('hide');
    solutionsContainer.classList.add('hide');

    // Display user's name
    userDisplay.innerHTML = `Welcome, ${userName}!`;

    // Show the first question and start the timer
    showQuestion(questions[currentQuestionIndex]);
    startTimer();
}

// Function to display a question
function showQuestion(question) {
    // Reset the timer for each question
    resetTimer();

    // Display the question and reset answer buttons
    questionContainer.innerHTML = question.question;
    answerButtons.innerHTML = '';

    // Create a timer display
    const timerDisplay = document.createElement('div');
    timerDisplay.classList.add('timer');
    answerButtons.appendChild(timerDisplay);

    // Update and display the timer
    updateTimerDisplay(30);

    // Create answer buttons for each option
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        button.addEventListener('click', () => selectAnswer(answer, button));
        answerButtons.appendChild(button);
    });
}

// Function to update and display the timer
function updateTimerDisplay(seconds) {
    const timerDisplay = document.querySelector('.timer');
    timerDisplay.innerHTML = `<i class="fa-solid fa-clock"></i> Time left: ${seconds}s`;
}

// Function to handle the user's answer selection
function selectAnswer(answer, button) {
    const correct = answer.correct;
    if (correct) {
        correctAnswers++;
    }

    // Highlight the selected answer
    highlightSelectedAnswer(button);
}

// Function to highlight the selected answer
function highlightSelectedAnswer(button) {
    const allButtons = document.querySelectorAll('.btn');
    allButtons.forEach(btn => {
        btn.style.backgroundColor = '';
    });

    button.style.backgroundColor = 'black';
}

// Function to move to the next question
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        // Show the next question and start the timer for the next question
        showQuestion(questions[currentQuestionIndex]);
        startTimer();
    } else {
        // Hide the next button, show the finish button and view solutions button, and show the result
        nextButton.classList.add('hide');
        finishButton.classList.remove('hide');
        viewSolutionsButton.classList.remove('hide');
        showResult();
    }
}

// Function to display the result
function showResult() {
    resultContainer.innerHTML = `Congratulations, ${nameInput.value}! You got ${correctAnswers} out of ${questions.length} questions correct.`;
    resultContainer.classList.remove('hide');
}

// Function to finish the quiz (skipping remaining questions)
function finishQuiz() {
    currentQuestionIndex = questions.length;
    nextQuestion();
}

// Function to start the timer
function startTimer() {
    timer = setInterval(() => {
        const timerDisplay = document.querySelector('.timer');
        const secondsLeft = parseInt(timerDisplay.innerText.match(/\d+/)[0]);

        if (secondsLeft > 0) {
            // Update and display the remaining time
            updateTimerDisplay(secondsLeft - 1);
        } else {
            // If the timer reaches 0, reset the timer and move to the next question
            resetTimer();
            nextQuestion();
        }
    }, 1000);
}

// Function to reset the timer
function resetTimer() {
    clearInterval(timer);
}

// Function to show the solutions
function showSolutions() {
    viewSolutionsButton.classList.add('hide');
    solutionsContainer.classList.remove('hide');

    // Iterate through questions and display solutions
    questions.forEach((question, index) => {
        const solutionItem = document.createElement('div');
        solutionItem.classList.add('solution-item');
        solutionItem.innerHTML = `<strong>Question ${index + 1}:</strong> ${question.question}<br>`;

        question.answers.forEach(answer => {
            solutionItem.innerHTML += `<span class="${answer.correct ? 'correct' : 'incorrect'}">${answer.text}</span><br>`;
        });

        solutionsContainer.appendChild(solutionItem);
    });
}

// Event listener for starting the quiz
startButton.addEventListener('click', startQuiz);
