const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d'); // called c cause we will be using it a lot to draw


canvas.width = 1024;
canvas.height = 576;

c.fillRect(0,0,canvas.width,canvas.height);

const gravity = 0.7;

class Sprite { // this is the base class for all sprites
    constructor({position, velocity, color = 'red', offset}) { // position and velocity are within {} so they can be just one object/argument
        this.position = position;
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            offset: offset,
            width: 100,
            height: 50,
        };
        this.color = color;
        this.isAttacking
    }
    draw() {
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height); // 50x150 is the size of the sprite

        // attack box
        if (this.isAttacking)
      {
            c.fillStyle = 'green';
            c.fillRect(
                this.attackBox.position.x,
                this.attackBox.position.y,
                this.attackBox.width,
                this.attackBox.height,
                )
            }
    }

    update() { // this is where we update the position of the sprite
        this.draw();
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x ;
        this.attackBox.position.y = this.position.y;
        
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y >= canvas.height){
            this.velocity.y = 0;
        } else this.velocity.y += gravity;
    }

    attack() {
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 200)
    }
}



const player = new Sprite({ // this is the player sprite - locates the player at the top left corner
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
    }

})


const enemy = new Sprite({ // this is the enemy sprite - locates the player at the 400/100 position
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

const keys = { // this is the object that will hold all the keys assigned to the game
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    space: {
        pressed: false,
    },

    ArrowLeft: {
        pressed: false,
    },
    ArrowRight: {
        pressed: false,
    },
    ArrowUp: {
        pressed: false,
    },
};

// let lastKey; // not sure if i should use this tbh but in case of using go (else if (keys.a.pressed) && (lastKey === 'a'))

function rectangularCollision({rectangle1, rectangle2,}) { // to detect collision between attack box and body
    return (
        (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x) &&
        (rectangle1.attackBox.position.x <= (rectangle2.position.x + rectangle2.width)) &&
        (rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y) &&
        (rectangle1.attackBox.position.y <= (rectangle2.position.y + rectangle2.height))
    )
}

function animate() { // this is the main game loop
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0,0,canvas.width,canvas.height);
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // player movement
    if (keys.a.pressed && keys.d.pressed) {
        player.velocity.x = 0;
    }
        else if (keys.a.pressed) {
            player.velocity.x = -3;
        } else if (keys.d.pressed) {
            player.velocity.x = 3;
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
        console.log('pau');
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
        console.log('chumbo');
    }

}

animate();

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        //player keys
        case 'd':
            keys.d.pressed = true;
            break;
        case 'a':
            keys.a.pressed = true;
            break;
        case ' ':
            if (player.position.y + player.height + player.velocity.y > canvas.height){ // limitation to only one jump
            player.velocity.y = -15;
            }
            break;
        case 'u':
            player.attack();
            break;

        // enemy keys
        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            break;
        case 'ArrowUp':
            if (enemy.position.y + enemy.height + enemy.velocity.y > canvas.height){ // limitation to only one jump
            enemy.velocity.y = -15;
            }
            break;
          case '7':
            enemy.attack();
            break;
    }

})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
            //player keys
        case 'd':
            keys.d.pressed = false;
            break
        case 'a':
            keys.a.pressed = false;
            break;

            // enemy keys
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
    }
})