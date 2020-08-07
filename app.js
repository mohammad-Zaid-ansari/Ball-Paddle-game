let canvas = document.getElementById('ctx');
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;
let ctx = canvas.getContext('2d');
let frameid;
let overlay = document.getElementById('overlay');
let score = document.querySelector('.score span');
let life = document.querySelector('.life span');







// Creating Paddle Class 
class Paddle {
    constructor(x, y, width, height, colour) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.colour = colour;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.colour;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
// ----------- Initiating Paddle -------------
let x = canvasWidth / 2-50;
let y = canvasHeight - 20;

let paddle = new Paddle(x, y, 100, 10, 'red');









// ----------- Creating Ball Class --------------
class Ball {
    constructor(x, y, size, colour, speedx, speedy) {
        this.x = x;
        this.y = y;
        this.size = size
        this.colour = colour;
        this.speedx = speedx;
        this.speedy = speedy;
        this.pause = false;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fillStyle = this.colour;
        ctx.fill();
    }

    //--------------- Collision between Ball and Wall --------------
    collision() {
        
        if ((this.x + this.size) >= canvasWidth || (this.x - this.size) <= 0) {
            this.speedx = -(this.speedx);
        }
        if ((this.y - this.size) <= 0) {
            this.speedy = -(this.speedy);
        }
        if (this.y + this.size >= canvasHeight) {
            if (Number(life.innerText) === 1) {
                life.innerText = 0;
                this.pause = true;
            } else {
                this.x = 40;
                this.y = 70;
                // this.speedy = -this.speedy;
                life.innerText--;
                console.log(this);
            }

        }

        this.x += this.speedx;
        this.y += this.speedy;
    }
    //-------------- Collision between Paddle and Ball ---------------
    oppositeCollision() {
        let rightSideOfPaddle = paddle.x
        let rightSideWithWidthOfPaddle = paddle.x + paddle.width
        if (this.y + this.size == paddle.y && this.x + this.size >= rightSideOfPaddle && this.x + this.size <= rightSideWithWidthOfPaddle) {
            this.speedy = -this.speedy;
            console.log('collision');
        }
    }

    brickCollision(brickArr) {
        brickArr.forEach((element, ind) => {
            let brickOfRight = element.x;
            let brickOfleft = element.x + element.width;


            if (this.y + this.size >= element.y && this.y - this.size <= element.y + element.height && this.x + this.size >= brickOfRight && this.x + this.size <= brickOfleft) {
                this.speedy = -(this.speedy);
                brickArr.splice(ind, 1);
                score.innerText++;
            }
        })
    }

}
//------------- Initiating Balls ---------------
let ball = new Ball(40, 70, 10, 'orange', 4, 4);



// ----------- Creating Brick Class --------------

class Brick extends Paddle {
    constructor(x, y, width, height, colour) {
        super(x, y, width, height, colour);
    }

    draw() {
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.fillStyle = this.colour;
    }
}


//------------- Initiating Bricks ---------------
let brickArr = []

let brick_x = 2;
let brick_y = 5;
let brick_width = 40;
let brick_height = 20;
let brick_colour = 'red';
let i = 0;
let j = 0;


let brickBuild = function () {
    while (true) {
        if (i === 19) {
            brick_x = 50;
            brick_y = 30;
            i++;

        } else if (i > 19 && j < 16) {
            let brick = new Brick(brick_x, brick_y, brick_width, brick_height, brick_colour)
            i++;
            j++;
            brick_x += 42;
            brickArr.push(brick);
            if (j === 16) {
                brick_y = 57;
                brick_x = 100;
            }
        } else if (i > 19 && j < 29) {
            let brick = new Brick(brick_x, brick_y, brick_width, brick_height, brick_colour);
            j++;
            brick_x += 42;
            brickArr.push(brick);
            if (j === 29) {
                break;
            }

        } else {
            let brick = new Brick(brick_x, brick_y, brick_width, brick_height, brick_colour)
            i++;
            brick_x += 42;
            brickArr.push(brick);
        }
    }
}
brickBuild()



move = () => {
    ctx.fillStyle = "white"
    //this fillstyle and fillRect erase the path traced by balls as they are also called repeatedly
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    window.onkeypress = (e) => {
        if (e.key === 'a') {
            if (paddle.x <= 0) {
                ball.oppositeCollision();
                paddle.x = 0;
            } else {
                ball.oppositeCollision();
                paddle.x -= 15;
            }

        } else if (e.key === 'd') {
            if (paddle.x >= canvasWidth - 100) {
                paddle.x = canvasWidth - 100;
                // ball.oppositeCollision();
                paddle.draw();
            } else {
                paddle.x += 15;
                // ball.oppositeCollision();

                paddle.draw();
            }
        }


    }
    ball.draw()
     paddle.draw()
    ball.collision()
    ball.oppositeCollision();

   


    //-------------- For Brick ---------------
    brickArr.forEach((element, ind) => {
        element.draw();
        ball.brickCollision(brickArr);
    });

    //  ------------------------------------
    // ------------------------------------------
    // -------------------------------------------
    // ---------------------------------------------    Most important to mention is set interval is much much processor consuming
    if (ball.pause) {
        pause_over(frameid,'restart');
        i = 0;
        j = 0;
        brick_x = 2;
        brick_y = 5;
    } else {
        frameid = requestAnimationFrame(move);
    };
}

move();


window.onkeydown = (e) => {
    if (e.keyCode === 27 && !(overlay.classList.contains('overlay'))) {
        pause_over(frameid,'resume');
    } else if (e.keyCode === 32) {
        if(ball.pause) {
            console.log(ball.pause);
            removeOverlay();
            ball.pause = false;
            restart();
        }
        else if (overlay.classList.contains('overlay')) {
            removeOverlay();
            console.log('space');
            move();
        }
    }
}
// ------------------- Functions --------------------
let pause_over = function (frameid,cond) {
    cancelAnimationFrame(frameid);
    overlay.classList.add('overlay');
    overlay.innerText = `Press space to ${cond}`;
}

let removeOverlay = ()=>{
    overlay.classList.remove('overlay');
    overlay.innerText = '';
}

let restart = function() {
    ball = new Ball(40, 70, 10, 'orange', 4, 4)
    paddle = new Paddle(x, y, 100, 10, 'red')
    score.innerText = 0;
    life.innerText = 3
    brickBuild();
    move();
}