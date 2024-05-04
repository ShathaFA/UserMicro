// script.js
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('quizForm');
    const questionsContainer = document.getElementById('questions');
    const quizOutput = document.getElementById('quizOutput');
    const addQuestionBtn = document.getElementById('addQuestionBtn');
    const generateQuizBtn = document.getElementById('generateQuizBtn');

    let questionCount = 0;

    // Function to add a new question
    function addQuestion() {
        questionCount++;
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';

        const questionLabel = document.createElement('label');
        questionLabel.textContent = `Question ${questionCount}:`;
        questionDiv.appendChild(questionLabel);

        const questionInput = document.createElement('input');
        questionInput.type = 'text';
        questionInput.name = `question${questionCount}`;
        questionInput.placeholder = `Enter question ${questionCount}`;
        questionDiv.appendChild(questionInput);

        for (let i = 1; i <= 4; i++) {
            const choiceLabel = document.createElement('label');
            choiceLabel.textContent = `Choice ${i}:`;
            questionDiv.appendChild(choiceLabel);

            const choiceInput = document.createElement('input');
            choiceInput.type = 'text';
            choiceInput.name = `question${questionCount}choice${i}`;
            choiceInput.placeholder = `Enter choice ${i}`;
            questionDiv.appendChild(choiceInput);
        }

        questionsContainer.appendChild(questionDiv);
    }

    // Function to generate the quiz
    function generateQuiz() {
        const quizTitle = document.getElementById('quizTitle').value;
        quizOutput.innerHTML = `<h2>${quizTitle}</h2>`;

        for (let i = 1; i <= questionCount; i++) {
            const questionInput = document.querySelector(`input[name="question${i}"]`);
            if (!questionInput) {
                continue;
            }

            const questionText = questionInput.value;
            quizOutput.innerHTML += `<p><strong>Question ${i}:</strong> ${questionText}</p>`;

            for (let j = 1; j <= 4; j++) {
                const choiceInput = document.querySelector(`input[name="question${i}choice${j}"]`);
                if (!choiceInput) {
                    continue;
                }

                const choiceText = choiceInput.value;
                quizOutput.innerHTML += `<p>Choice ${j}: ${choiceText}</p>`;
            }
        }
    }

    // Event listeners
    addQuestionBtn.addEventListener('click', addQuestion);
    generateQuizBtn.addEventListener('click', generateQuiz);
});
