/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

var scores, scoreLog, roundScore, activePlayer, isGamePlaying, scoreFromTwoRolls;

init();

var lastDice;

function init() {
    scores = [0, 0];
    roundScore = 0;
    activePlayer = 0;

    document.getElementById('dice-1').style.display = 'none';
    document.getElementById('dice-2').style.display = 'none';

    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';

    document.querySelector('#name-0').textContent = 'Player 1';
    document.querySelector('#name-1').textContent = 'Player 2';

    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');

    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');

    document.querySelector('.player-0-panel').classList.add('active');
    isGamePlaying = true;
}



document.querySelector('.btn-roll').addEventListener('click', function () {
    if (isGamePlaying) {
        //1. random number
        var diceNumber1 = Math.floor(Math.random() * 6) + 1 ; // gives random dice number from 1 to 6.
        var diceNumber2 = Math.floor(Math.random() * 6) + 1 ; // gives random dice number from 1 to 6.
        
        //2. Display result
        document.getElementById('dice-1').style.display = 'block';
        document.getElementById('dice-2').style.display = 'block';

        document.getElementById('dice-1').src = 'dice-' + diceNumber1 + '.png'; //adds picture based on dice number
        document.getElementById('dice-2').src = 'dice-' + diceNumber2 + '.png'; //adds picture based on dice number


        //4. store score in scoreLog



        //3. update the round score IF the rolled number was NOT a 1 

        if (diceNumber1 === 1 || diceNumber2 === 1) {
            nextPlayer();
        } else {
            roundScore += diceNumber1 + diceNumber2;
            document.querySelector('#current-' + activePlayer).textContent = roundScore;
        }
        
        /*
        scoreFromTwoRolls = diceNumber + lastDice;
        console.log(scoreFromTwoRolls);
        if (diceNumber !== 1 && scoreFromTwoRolls !== 12) {
            //add score
            roundScore += diceNumber;
            document.querySelector('#current-' + activePlayer).textContent = roundScore;

        } else if (scoreFromTwoRolls === 12) {
            //set roundScore and score to 0 
            scores[activePlayer] = 0;
            document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];

            //next player
            nextPlayer();
            
        } else {
            //next player
            nextPlayer();
        }

        lastDice = diceNumber;
        */
        
    }

});

document.querySelector('.btn-hold').addEventListener('click', function (){
    if (isGamePlaying) {
        //1. add current score to global score
        scores[activePlayer] += roundScore;

        //2. update the UI
        document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];

        var input = document.querySelector('.input-win-score').value;
        var winingScore;

        if (input) {
            winningScore = input;
            console.log(input);
        } else {
            winningScore = 100;
        }

        //3. check if player won the game
        if (scores[activePlayer] >= winningScore) {
            document.querySelector('#name-' + activePlayer).textContent = 'Winner!';
            document.getElementById('dice-1').style.display = 'none';
            document.getElementById('dice-2').style.display = 'none';
            document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
            document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
            isGamePlaying = false;
        } else {
            //4. IF step3 gives false, then:
            nextPlayer();
            lastDice = 0;
        }
    
    }
});

document.querySelector('.btn-new').addEventListener('click', init); 

function nextPlayer() {
    activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
        roundScore = 0;

        document.getElementById('current-0').textContent = '0';
        document.getElementById('current-1').textContent = '0';

        document.querySelector('.player-0-panel').classList.toggle('active');
        document.querySelector('.player-1-panel').classList.toggle('active');

        document.getElementById('dice-1').style.display = 'none';
        document.getElementById('dice-2').style.display = 'none';

        

}




//document.querySelector('#current-' + activePlayer).innerHTML = '<b>' + dice + '</b>'; <-- allows to use html tags

//var x = document.querySelector('#score-0').textContent;
//console.log(x);

