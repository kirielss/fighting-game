class Sprite { // this is the base class for all sprites
    constructor({
        position, 
        imageSrc, 
        scale = 1, 
        framesMax = 1, 
        offset = {x: 0, y: 0}
    }) {
            this.position = position;
            this.width = 50;
            this.height = 150;
            this.image = new Image();
            this.image.src = imageSrc;
            this.scale = scale;
            this.framesMax = framesMax;
            this.framesCurrent = 0;
            this.framesElapsed = 0;
            this.framesHold = 10;
            this.offset = offset;

    }
    draw() {
     c.drawImage(
        this.image,
        this.framesCurrent * (this.image.width / this.framesMax),
        0,
        this.image.width / this.framesMax,
        this.image.height, // these 4 lines after this.image are to crop the image

        this.position.x - this.offset.x, 
        this.position.y - this.offset.y, // these 2 lines are to put the image on top left corner of the sprite
        (this.image.width / this.framesMax) * this.scale, 
        this.image.height * this.scale);
    }

    animateFrames(){
        this.framesElapsed++;

        if (this.framesElapsed % this.framesHold === 0) { // this is to make the frames change every 5 frames

            if (this.framesCurrent < (this.framesMax - 1)) { // this is to make the frames loop back to 0 when it reaches the max while also negating when framesMax is 1
                this.framesCurrent++;
            } else {
                this.framesCurrent = 0;
            }
        }
    }
    
    update() { // this is where we update the position of the sprite
        this.draw();
        this.animateFrames();
    }

}


class Fighter extends Sprite { // player 1 and player 2
    constructor({
        position, 
        velocity, 
        color = 'red', 
        imageSrc, 
        scale = 1, 
        framesMax = 1,
        offset = {x: 0, y: 0},
        sprites,
    }) {
            super({ // this is to inherit the properties of the Sprite class
                position,
                imageSrc,
                scale,
                framesMax,
                offset,
            })

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
            this.isAttacking;
            this.health = 100;
            this.framesCurrent = 0;
            this.framesElapsed = 0;
            this.framesHold = 10;
            this.sprites = sprites;

            for (const sprite in this.sprites) {
                sprites[sprite].image = new Image();
                sprites[sprite].image.src = sprites[sprite].imageSrc;
            }
 
    }
     
   /* draw() {
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
    } */

    update() { // this is where we update the position of the sprite
        this.draw();
        this.animateFrames();
        
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x ;
        this.attackBox.position.y = this.position.y;
        
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y >= ground){
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