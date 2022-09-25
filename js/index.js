const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d'); // called c cause we will be using it a lot to draw


canvas.width = 1024;
canvas.height = 576;

c.fillRect(0,0,canvas.width,canvas.height);

const gravity = 0.7;

const ground = canvas.height - 96;

const background = new Sprite ({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: './img/background.png'
})

const shop = new Sprite ({
    position: {
        x: 600,
        y: 128,
    },
    imageSrc: './img/shop.png',
    scale: 2.75, // 2.75x the size of the original image,
    framesMax: 6
})

const player = new Fighter({ // this is the player hitbox - locates the player at the top left corner
    position: {
        x: 100,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    offset: {
        x: 0,
        y: 0,
    },
    imageSrc: './img/samuraiMack/idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157,
    },
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/idle.png',
            framesMax: 8,
        },
        run: {
            imageSrc: './img/samuraiMack/Run.png',
            framesMax: 8,
            image: new Image()
        }
    }
})


const enemy = new Fighter({ // this is the enemy hitbox - locates the player at the 400/100 position
    position: {
        x: 874,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0,
    }

})


console.log(player);



decreaseTimer();

function animate() { // this is the main game loop
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0,0,canvas.width,canvas.height);
    background.update();
    shop.update();
    player.update();
    //commenting out until gets the sprite enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // player movement
    player.image = player.sprites.idle.image;
    player.framesHold = 15;
    if (keys.a.pressed && keys.d.pressed) {
        player.velocity.x = 0;
    }
        else if (keys.a.pressed) {
            player.velocity.x = -3;
            player.image = player.sprites.run.image;
            player.framesHold = 8;
        } else if (keys.d.pressed) {
            player.velocity.x = 4;
            player.image = player.sprites.run.image;
            player.framesHold = 5;
    }

    // enemy movement
    if (keys.ArrowLeft.pressed && keys.ArrowRight.pressed) {
        enemy.velocity.x = 0;
    }
        else if (keys.ArrowLeft.pressed) {
            enemy.velocity.x = -3;
        } else if (keys.ArrowRight.pressed) {
            enemy.velocity.x = 3;
    }

    // detect for collision
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy,
        })
         &&
    player.isAttacking
        ) { 
        player.isAttacking = false;
        enemy.health -= 20;
        document.querySelector('#enemyHealth').style.width = enemy.health + '%';
    }

    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player,
        })
         &&
    enemy.isAttacking
        ) { 
        enemy.isAttacking = false;
        player.health -= 20;
        document.querySelector('#playerHealth').style.width = player.health + '%';
    }

    // end game based on health
    if ((enemy.health <= 0) || (player.health <= 0)) {
        determineWinner({player,enemy, timerId});
    }
    
    
}

animate();