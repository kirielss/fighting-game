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
            if (player.position.y + player.height + player.velocity.y > ground){ // limitation to only one jump
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
            if (enemy.position.y + enemy.height + enemy.velocity.y > ground){ // limitation to only one jump
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