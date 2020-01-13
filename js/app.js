import Question from './Question.js';
import Quiz from './Quiz.js';

const App = (() => {
    //cache the DOM
    const quizEl = document.querySelector('.jabquiz');
    const quizQuestionEl = document.querySelector('.jabquiz__question');
    const trackerEl = document.querySelector('.jabquiz__tracker');
    const progressInnerEl = document.querySelector('.progress__inner');
    const taglineEl = document.querySelector('.jabquiz__tagline');
    const choicesEl = document.querySelector('.choices');
    const nextButtonEl = document.querySelector('.next');
    const restartButtonEl = document.querySelector('.restart');


    const q1 = new Question(
        "First President of US?", ["Barrack", "Osama", "George", "Monkey"],
        2
    )
    const q2 = new Question(
        "When was Javascript created?", ["June 1995", "May 1995", "July 1885", "Sep 1996"],
        1
    )

    const q3 = new Question(
        "What does CSS stand for?", ["County Sheriff Service", "Cascading sexy sheets", "cascading style sheets"],
        2
    )
    const q4 = new Question(
        "The full form of HTML is...", ["Hyper Text Markup Language", "Hold The Mic", "ERROR"],
        0
    )
    const q5 = new Question(
        "console.log(typeof []) would return what?", ["Array", "Object", "null", "array"],
        1
    )

    const quiz = new Quiz([q1, q2, q3, q4, q5]);

    const listeners = _ => {
        nextButtonEl.addEventListener("click", function() {
            const selectedRadioEl = document.querySelector('input[name="choice"]:checked');
            if (selectedRadioEl) {
                const key = Number(selectedRadioEl.getAttribute("data-order"));
                quiz.guess(key);
                renderAll();
            }
        })

        restartButtonEl.addEventListener("click", function() {
            //1. reset the quiz
            quiz.reset();
            //2. render all
            renderAll();
            //3. reset tagline element
            setValue(taglineEl, `Pick an option below`);
            //4. restore next button
            nextButtonEl.style.opacity = 1;
        })
    }

    const setValue = (elem, value) => {
        elem.innerHTML = value;
    }
    const renderQuestion = () => {
        const question = quiz.getCurrentQuestion().question;
        setValue(quizQuestionEl, question);
    }
    const renderChoices = () => {
        let markup = '';
        const currentChoices = quiz.getCurrentQuestion().choices;
        currentChoices.forEach((elem, index) => {
            markup += `
            <li class="choice">
                <input type="radio" name="choice" id="choice${index}" data-order="${index}" class="jabquiz__input">
                <label for="choice${index}" class="jabquiz__label">
                    <i></i> 
                    <span>${elem}</span>
                </label>
            </li>
            `;
        });
        setValue(choicesEl, markup);
    }
    const renderTracker = _ => {
        const index = quiz.currentIndex;
        setValue(trackerEl, `${index+1} of ${quiz.questions.length}`);

    }
    const getPercentage = (num1, num2) => {
        return Math.round((num1 / num2) * 100);
    }

    const launch = (width, maxPercent) => {
        let loadingBar = setInterval(function() {
            if (width > maxPercent) {
                clearInterval(loadingBar);
            } else {
                width++;
                progressInnerEl.style.width = width + "%";
            }
        }, 3);
    }


    const renderProgress = _ => {
        const currentWidth = getPercentage(quiz.currentIndex, quiz.questions.length);
        launch(0, currentWidth);
    }

    const renderEndScreen = _ => {
        setValue(quizQuestionEl, `Great Job!`);
        setValue(trackerEl, `Your score : ${getPercentage(quiz.score, quiz.questions.length)}%`);
        setValue(taglineEl, `Complete`);
        nextButtonEl.style.opacity = 0;
        renderProgress();
    }

    const renderAll = () => {
        if (quiz.hasEnded()) {
            //render End Screen
            renderEndScreen();
        } else {
            //1.render the questions
            renderQuestion();
            //2.render the choices elements
            renderChoices();
            //3.render the tracker
            renderTracker();
            //4.render the progress
            renderProgress();
        }
    }



    return {
        renderAll: renderAll,
        listeners: listeners
    }

})();

App.renderAll();
App.listeners();