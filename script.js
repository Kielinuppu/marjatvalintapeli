document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const feedbackScreen = document.getElementById('feedback');
    const startButton = document.getElementById('start-button');
    const playAgainButton = document.getElementById('play-again-button');
    const gameBoard = document.querySelector('.game-board');
    const replayButton = document.getElementById('replay-sound');
 
    const berries = ['mansikka', 'mustikka', 'puolukka', 'vadelma', 'lakka'];
    const berryNames = {
        'mansikka': 'MANSIKKA',
        'mustikka': 'MUSTIKKA',
        'puolukka': 'PUOLUKKA',
        'vadelma': 'VADELMA',
        'lakka': 'LAKKA'
    };
    let currentBerry;
    let score = 0;
    let totalQuestions = 0;
    let counters = {};
    let previousBerry;
 
    berries.forEach(berry => {
        counters[berry] = 0;
    });
 
    function playSound(sound) {
        return new Promise(resolve => {
            const audio = new Audio(sound);
            audio.onended = resolve;
            audio.play();
        });
    }
 
    function showRandomBerry() {
        let newBerry;
        do {
            newBerry = berries[Math.floor(Math.random() * berries.length)];
        } while (newBerry === previousBerry);
 
        currentBerry = newBerry;
        previousBerry = currentBerry;
        totalQuestions++;
    }
 
    async function playBerrySound() {
        const berryIndex = berries.indexOf(currentBerry) + 1;
        await playSound(`aani${berryIndex}.mp3`);
    }
 
    async function startGame() {
        document.getElementById('main-title').style.display = 'none';
        document.getElementById('game-title').style.display = 'block';
        startScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        showRandomBerry();
        await playSound('valitse.mp3');
        await playBerrySound();
    }
 
    function checkAnswer(selectedBerry) {
        const selectedButton = document.querySelector(`.berry-button[data-berry="${selectedBerry}"]`);
        if (selectedBerry === currentBerry) {
            score++;
            counters[currentBerry]++;
            document.querySelector(`.counter[data-berry="${currentBerry}"]`).textContent = counters[currentBerry];
            playSound('oikein.mp3');
        } else {
            playSound('vaarin.mp3');
            selectedButton.classList.add('incorrect');
            setTimeout(() => {
                selectedButton.classList.remove('incorrect');
            }, 300);
        }
 
        if (totalQuestions < 10) {
            setTimeout(async () => {
                showRandomBerry();
                await playBerrySound();
            }, 1000);
        } else {
            setTimeout(showFeedback, 1000);
        }
    }
 
    function showFeedback() {
        gameScreen.style.display = 'none';
        feedbackScreen.style.display = 'block';
        document.getElementById('score').textContent = `OIKEIN: ${score}/${totalQuestions}`;
        const starsContainer = document.getElementById('stars');
        starsContainer.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const star = document.createElement('img');
            star.src = 'tahti.png';
            star.alt = 'Tähti';
            starsContainer.appendChild(star);
        }
    }
 
    function resetGame() {
        document.getElementById('main-title').style.display = 'block';
        document.getElementById('game-title').style.display = 'none';
        score = 0;
        totalQuestions = 0;
        berries.forEach(berry => {
            counters[berry] = 0;
            document.querySelector(`.counter[data-berry="${berry}"]`).textContent = '0';
        });
        feedbackScreen.style.display = 'none';
        startScreen.style.display = 'block';
        gameScreen.style.display = 'none';
        currentBerry = null;
        previousBerry = null;
    }
 
    startButton.addEventListener('click', startGame);
    playAgainButton.addEventListener('click', resetGame);
    
    gameBoard.addEventListener('click', (e) => {
        if (e.target.classList.contains('berry-button')) {
            checkAnswer(e.target.dataset.berry);
        }
    });
 
    replayButton.addEventListener('click', () => {
        if (currentBerry) {
            playBerrySound();
        }
    });
 });