// consts for color
const PLATFORMCOLOR = "#FFFFFF";
const BALLCOLOR = "#cd2121";

// consts for brick stuff
const widthDivisor = 10;
const heightDivisor = 20;
const numOfRows = 5;
const velocityDivisor = -100;
const ballLocDivisor = 5;
const ballDivisor = 30;
const DefaultLives = 3;

//game represents the ball, bricks, player, and canvas
class Game{
  constructor(canvas){
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    // autosize canvas to window size
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    //create new player (platform)
    this.player = new Player();

    //create a new platform
    this.platform = new Platform(this.ctx);

    //create a new ball
    this.ball = new Ball(this.ctx);

    //set up bricks
    this.bricks = [];
    // draw all the bricks
    for (var y = 0; y < numOfRows; y++) {
        for (var x = 0; x < widthDivisor; x++) {
            var b = new Brick(1, x * (this.canvas.width / widthDivisor), (this.canvas.height / widthDivisor) + (y * (this.canvas.height / heightDivisor)), this.ctx);
            b.draw(this.ctx);
            this.bricks.push(b);
        }
    }

    //create a game state to set different behaviors
    this.state = "beginning";
  }

  //draw a new frame; basically the update function
  drawFrame(mouseX){
    //clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    //update the platform location
    this.platform.update(this.ctx, mouseX);

    //update the ball location
    this.ball.update(this.ctx, this.platform, this.bricks);

    // update bricks
    for (var b of this.bricks)
        b.update(this.ctx);
  }
}

//player represents the platform
class Player{
  constructor(){
    this.score = 0;
    this.lives = DefaultLives;
    this.mouseX = window.innerWidth / 2;
  }
  loseLife(){
    this.lives = this.lives - 1;
  }
}

class Platform {
    constructor(ctx) {
        this.x = ctx.canvas.height / 2;
        this.size = ctx.canvas.width / widthDivisor;
        //set default variables
        this.y = ctx.canvas.height - (ctx.canvas.height / widthDivisor);
        this.boxHeight = ctx.canvas.height / heightDivisor / 3;
        this.center = this.x + (this.size / 2);
    }

    draw(ctx) {
        ctx.fillStyle = PLATFORMCOLOR;
        ctx.fillRect(this.x, this.y, this.size, this.boxHeight);
    }

    update(ctx, mouseX) {
        this.x = mouseX;

        //check if the platform is at the canvas bounds
        if (this.x > ctx.canvas.width - (this.size / 2)) {
            this.x = ctx.canvas.width - (this.size / 2);
        } else if (this.x < 0 + this.size / 2) {
            this.x = this.size / 2;
        }

        //place the mouse in the middle of the platform
        this.x = this.x - (ctx.canvas.width / widthDivisor) / 2;
        ctx.fillStyle = PLATFORMCOLOR;
        ctx.fillRect(this.x, this.y, this.size, this.boxHeight);
        this.center = this.x + (this.size / 2);
    }

}

class Ball {
    constructor(ctx) {
        this.x = ctx.canvas.width / 2;
        //set initial y and size values
        this.y = ctx.canvas.height - (ctx.canvas.height / ballLocDivisor);
        this.rad = ctx.canvas.height / ballDivisor;
        this.velX = 0;
        this.velY = 0;
    }

    spawn(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.rad, 0, 2 * Math.PI);
        ctx.fillStyle = BALLCOLOR;
        ctx.fill();
        ctx.stroke();

        //get a random number, -1 or 1 and add a random number to that so that velocity is somewhat random
        var randNum = Math.random();
        if (randNum <= .5) {
            randNum = -1;
            randNum = randNum + Math.random();
        } else {
            randNum = 1;
            randNum = randNum - Math.random();
        }

        //set the velocity relative to the width and height of the canvas; multiply by randNum for some randomness
        this.velX = (ctx.canvas.width / velocityDivisor) * randNum;
        this.velY = (ctx.canvas.height / velocityDivisor);
    }

    update(ctx, platform, bricks) {
        //check if the ball is at the upper or lower bounds and if so, invert the velocity
        if (this.y >= ctx.canvas.height - this.rad || this.y <= 0 + this.rad) {
            this.velY = this.velY * -1;
        }
        //check if the ball is hitting the platform and if so, invert the velocity
        else if (this.y >= (platform.y - platform.boxHeight) && this.x > (platform.x) && this.x < (platform.x + platform.size) && this.velY > 0) {
          var whereHit = this.x - platform.center;
          var whereHitFrac = whereHit / (platform.size / 2);
          //Implementation for better platform reflections. It reflects differently depending on where it hits on the platform.
          //if the ball hits the left side of the platform
          if(whereHitFrac < -.5){
            this.velX = ctx.canvas.width / velocityDivisor * Math.abs(whereHitFrac);
          }
          //if the ball hits the right third of the platform
          else if(whereHit > .5){
            this.velX = ctx.canvas.width / velocityDivisor * -1 * Math.abs(whereHitFrac);
          }
          //if the ball hits the center third of the platform
          else{
            this.velX = ctx.canvas.width / velocityDivisor * Math.abs(whereHitFrac);
          }

          //invert the Y velocity when it hits the platform
          this.velY = this.velY * -1;
        }

        //check if ball is at the left and right bounds and if it is, invert the velocity
        if (this.x >= ctx.canvas.width - this.rad || this.x <= 0 + this.rad) {
            this.velX = this.velX * -1;
        }

        // collide with bricks
        for (var b of bricks) {
            // same y?
            if (b.yPosition + b.height <= this.y + (2 * this.rad) && b.yPosition > this.y - (2 * this.rad)){
                // same x? corner of ball bug would be here
                if (Math.round(b.xPosition) == Math.round(this.x) || Math.round(b.xPosition + b.width) == Math.round(this.x)) {
                        console.log("called");
                        b.hit(ctx, b, bricks);
                        this.velX *= -1;
                        break;
                }
                if (b.xPosition <= this.x && b.xPosition + b.width >= this.x) {
                    b.hit(ctx, b, bricks);
                    this.velY *= -1;
                }
            }
        }

        //update the location according to the velocity
        this.x += this.velX;
        this.y += this.velY;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.rad, 0, 2 * Math.PI);
        ctx.fillStyle = BALLCOLOR;
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
}

function Brick(health, x, y, ctx) {
    this.health = health;
    this.xPosition = x;
    this.yPosition = y;
    this.color = 'hsl(' + 360 * Math.random() + ', 75%, 60%)'; // random color, same saturation and intensity

    // constant for all bricks
    this.width = ctx.canvas.width / widthDivisor;
    this.height = ctx.canvas.height / heightDivisor;

    //functions
    this.draw = function (ctx) {
        // fill with color
        ctx.rect(this.xPosition, this.yPosition, this.width, this.height)
        ctx.fillStyle = this.color;
        ctx.fillRect(this.xPosition, this.yPosition, this.width, this.height);
        // add stroke
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        ctx.stroke();
    }

    this.update = function (ctx) {
        ctx.beginPath();
        this.draw(ctx);
    }

    this.hit = function (ctx, b, bricks) {
        health--;
        if (health <= 0) {
            // remove b from bricks
            for (var i = 0; i < bricks.length; i++) {
                if (bricks[i] == b)
                    bricks.splice(i, 1);
            }
        }
        else {
            this.color = 'hsl(' + 360 * Math.random() + ', 75%, 60%)';
        }
    }
}

function update(canvas, ctx, mouseX, platform, bricks, ball) {
    //clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //update the platform location
    platform.update(ctx, mouseX);

    //update the ball location
    ball.update(ctx, platform, bricks);

    // update bricks
    for (var b of bricks)
        b.update(ctx);
}

function init() {
  //figure out where the canvas is
  var canvas = document.getElementById('game');

  //create a new game!
  var game = new Game(canvas);

  //make variable for use of the mouse
  var mouseX = game.player.mouseX;

    //create new platform and draw it
    game.platform.draw(game.ctx);

    //create and spawn a ball
    game.ball.spawn(game.ctx);

    //run update() every 1/60 of a second and pass along the current mouse position
    setInterval(function () {
      //update the mouse locaiton
      document.onmousemove = function (e) {
          mouseX = e.clientX;
        }
      game.player.mouseX = mouseX;
      game.drawFrame(mouseX);
    }, 17);
}

//run init() when the page fully loads
document.addEventListener("DOMContentLoaded", init, false);
