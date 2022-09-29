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
        },
        jump: {
            imageSrc: './img/samuraiMack/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './img/samuraiMack/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './img/samuraiMack/Attack1.png',
            framesMax: 6,
        },
        takeHit: {
            imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4,
        },
        death: {
            imageSrc: './img/samuraiMack/Death.png',
            framesMax: 6,
        }
    },
    attackBox: {
        offset: {
            x: 70,
            y: 35,
        },
        width: 180,
        height: 50
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
    },
    imageSrc: './img/kenji/idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167,
    },
    sprites: {
        idle: {
            imageSrc: './img/kenji/Idle.png',
            framesMax: 4,
        },
        run: {
            imageSrc: './img/kenji/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './img/kenji/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './img/kenji/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './img/kenji/Attack1.png',
            framesMax: 4,
        },
        takeHit: {
            imageSrc: './img/kenji/Take hit.png',
            framesMax: 3,
        },
        death: {
            imageSrc: './img/kenji/Death.png',
            framesMax: 7,
        }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50,
        },
        width: 170,
        height: 50
    }

})

decreaseTimer();

function animate() { // this is the main game loop
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0,0,canvas.width,canvas.height);
    background.update();
    shop.update();
    c.fillStyle ='rgba(255,255,255, 0.1)';
    c.fillRect(0,0, canvas.width, canvas.height)
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // player movement
    if (keys.a.pressed && keys.d.pressed) {
        player.velocity.x = 0;
        player.switchSprite('idle');
    }
        else if (keys.a.pressed) {
            player.velocity.x = -3;
            player.switchSprite('run');
           // player.framesHold = 8; // this is to make the animation slower running backwards
        } else if (keys.d.pressed) {
            player.velocity.x = 4;
            player.switchSprite('run');
         //   player.framesHold = 5; // this is to make the animation faster running forwards
    }
        else {
            player.switchSprite('idle');
        }

    // player jumping
    if (player.velocity.y < 0) {
        player.switchSprite('jump');
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall');
    }

    // enemy movement
    if (keys.ArrowLeft.pressed && keys.ArrowRight.pressed) {
        enemy.velocity.x = 0;
        enemy.switchSprite('idle');
    }
        else if (keys.ArrowLeft.pressed) {
            enemy.velocity.x = -8;
            enemy.switchSprite('run');
        } else if (keys.ArrowRight.pressed) {
            enemy.velocity.x = 6;
            enemy.switchSprite('run');
        }
        else {
            enemy.switchSprite('idle');
        }

        // enemy jumping
        if (enemy.velocity.y < 0) {
            enemy.switchSprite('jump');
        } else if (enemy.velocity.y > 0) {
            enemy.switchSprite('fall');
        }

    // detect for collision

    // enemy gets hit
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy,
        }) &&
        player.isAttacking && player.framesCurrent === 4
        ) {
        enemy.health -= 25;
        enemy.takeHit();
        player.isAttacking = false;

        
    //    document.querySelector('#enemyHealth').style.width = enemy.health + '%';
        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })
    }

    // if player misses
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false;
    }

    // player gets hit
    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player,
        }) &&
        enemy.isAttacking && enemy.framesCurrent === 1
        ) { 
        player.health -= 10;
        player.takeHit();
        enemy.isAttacking = false;

    //    document.querySelector('#playerHealth').style.width = player.health + '%';
        gsap.to('#playerHealth', {
            width: player.health + '%'
        })
    }

        // if enemy misses
        if (enemy.isAttacking && enemy.framesCurrent === 1) {
            enemy.isAttacking = false;
        }

    // end game based on health
    if ((enemy.health <= 0) || (player.health <= 0)) {
        determineWinner({player,enemy, timerId});
    }
    
    
}

animate();