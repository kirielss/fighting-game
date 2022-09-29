function rectangularCollision({rectangle1, rectangle2,}) { // to detect collision between attack box and body
    return (
        (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x) &&
        (rectangle1.attackBox.position.x <= (rectangle2.position.x + rectangle2.width)) &&
        (rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y) &&
        (rectangle1.attackBox.position.y <= (rectangle2.position.y + rectangle2.height))
    )
}

function determineWinner({player,enemy, timerId}){
    clearTimeout(timerId);
    if (player.health === enemy.health) {
        document.querySelector('#win').innerHTML = "IT'S A DRAW!";
        enemy.switchSprite('death');
        player.switchSprite('death');
    }
    else if (player.health > enemy.health) {
        document.querySelector('#win').innerHTML = "PLAYER 1 WINS!";
        enemy.switchSprite('death');
    }
    else if (player.health < enemy.health) {
        document.querySelector('#win').innerHTML = "PLAYER 2 WINS!";
        player.switchSprite('death');
    }

}

let timer = 100;
let timerId;
function decreaseTimer() {
    timerId = setTimeout(decreaseTimer, 1000);
    if (timer > 0) {
        timer--
        document.querySelector('#timer').innerHTML = timer;
    }

    if (timer === 0) {
        determineWinner({player,enemy, timerId});
    }
}
