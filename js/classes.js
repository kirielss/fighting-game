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
            this.framesHold = 5;
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
        attackBox = {
            offset: {},
            width: undefined,
            height: undefined,
        }
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
                offset: attackBox.offset,
                width: attackBox.width,
                height: attackBox.height,
            };
            this.color = color;
            this.isAttacking;
            this.health = 100;
            this.framesCurrent = 0;
            this.framesElapsed = 0;
            this.framesHold = 5;
            this.sprites = sprites;
            this.dead = false;

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
        if (!this.dead) {
            this.animateFrames();
        }
        
        // attack boxes
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x ;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y ;

        // draw the attack box
        /* c.fillRect(
            this.attackBox.position.x, 
            this.attackBox.position.y, 
            this.attackBox.width, 
            this.attackBox.height
        ); */
        
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // gravity function
        if (this.position.y + this.height + this.velocity.y >= ground){
            this.velocity.y = 0;
        } else this.velocity.y += gravity;
    }

    attack() {
        this.switchSprite('attack1');
        this.isAttacking = true;
    }

    takeHit() {
        if (this.health <= 0) {
            this.switchSprite('death');
        } else {
            this.switchSprite('takeHit');
        }
    }

    switchSprite(sprite) {

        // death overcomes all
        if (this.image === this.sprites.death.image){
            if (this.framesCurrent === this.sprites.death.framesMax - 1) {
                this.dead = true;
            }
            return;
        }

        // overriding all other animations with the attack animation
        if (this.image === this.sprites.attack1.image && this.framesCurrent < this.sprites.attack1.framesMax -1) return;

        // override when fighter gets hit
        if (this.image === this.sprites.takeHit.image && this.framesCurrent < this.sprites.takeHit.framesMax -1) return;

        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image){
                    this.image = this.sprites.idle.image;
                    this.framesMax = this.sprites.idle.framesMax;
                    this.framesCurrent = 0;
                   // this.framesHold = 15;
                }
                break;
            case 'run':
                if (this.image !== this.sprites.run.image){
                    this.image = this.sprites.run.image;
                    this.framesMax = this.sprites.run.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case 'jump':
                if (this.image !== this.sprites.jump.image){
                    this.image = this.sprites.jump.image;
                    this.framesMax = this.sprites.jump.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case 'fall':
                if (this.image !== this.sprites.fall.image){
                    this.image = this.sprites.fall.image;
                    this.framesMax = this.sprites.fall.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case 'attack1':
                if (this.image !== this.sprites.attack1.image){
                    this.image = this.sprites.attack1.image;
                    this.framesMax = this.sprites.attack1.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image){
                    this.image = this.sprites.takeHit.image;
                    this.framesMax = this.sprites.takeHit.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case 'death':
                if (this.image !== this.sprites.death.image){
                    this.image = this.sprites.death.image;
                    this.framesMax = this.sprites.death.framesMax;
                    this.framesCurrent = 0;
                }
                break;
        }
    }
}