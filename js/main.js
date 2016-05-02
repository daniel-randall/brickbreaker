// consts for color
const PLATFORMCOLOR = "#FFFFFF";

// consts for brick stuff
const widthDivisor = 10;
const heightDivisor = 20;
const numOfRows = 5;
const velocityDivisor = -250;

class Ball {
    constructor(locX, ctx) {
        this.x = locX;
        //set initial y and size values
        this.y = ctx.canvas.height - (ctx.canvas.height / 5);
        this.rad = 25;
        this.velX = 0;
        this.velY = 0;
    }

    spawn(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.rad, 0, 2 * Math.PI);
        ctx.fillStyle = "#cd2121";
        ctx.fill();
        ctx.stroke();

        //get a random number, negative one or positive one
        var randNum = Math.random();
        if (randNum <= .5) {
            randNum = -1;
        } else {
            randNum = 1;
        }
        this.velX = ctx.canvas.width / velocityDivisor * randNum;
        this.velY = ctx.canvas.height / velocityDivisor;
    }

    update(ctx, platform) {
        //check if the ball is at the upper or lower bounds
        if (this.y >= ctx.canvas.height - this.rad || this.y <= 0 + this.rad) {
            this.velY = this.velY * -1;
        } else if (this.y >= (platform.y - platform.boxHeight) && this.x > (platform.x - this.rad) && this.x < (platform.x + platform.size + this.rad) && this.velY > 0) {
            this.velY = this.velY * -1;
        }

        if (this.x >= ctx.canvas.width - this.rad || this.x <= 0 + this.rad) {
            this.velX = this.velX * -1;
        }

        //update the location according to the velocity
        this.x += this.velX;
        this.y += this.velY;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.rad, 0, 2 * Math.PI);
        ctx.fillStyle = "#cd2121";
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
}

class Platform {
    constructor(locX, size, ctx) {
        this.x = locX;
        this.size = size;
        //set default variables
        this.y = ctx.canvas.height - (ctx.canvas.height / 10);
        this.boxHeight = window.innerHeight / 25;
    }

    draw(ctx) {
        ctx.fillStyle = PLATFORMCOLOR;
        ctx.fillRect(this.x, this.y, this.size, this.boxHeight);
    }

    update(ctx, mouseX) {
        this.x = mouseX;

        if (this.x > ctx.canvas.width - (this.size / 2)) {
            this.x = ctx.canvas.width - (this.size / 2);
        } else if (this.x < this.size / 2) {
            this.x = this.size / 2;
        }
        this.x = this.x - (ctx.canvas.width / 10) / 2;
        this.x = this.x - (ctx.canvas.width / 5) / 2;
        ctx.fillStyle = PLATFORMCOLOR;
        ctx.fillRect(this.x, this.y, this.size, this.boxHeight);
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
}

function update(canvas, ctx, mouseX, platform, bricks, ball) {
    //clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //update the platform location
    platform.update(ctx, mouseX);
    
    ball.update(ctx, platform);

    // update bricks
    for (var b of bricks)
        b.update(ctx);
}

function init() {
    // class variables
    var bricks = [];

    var canvas = document.getElementById('game'),
        ctx = canvas.getContext('2d');

    //set default mouse position
    var mouseX = ctx.canvas.width / 2;

    // autosize canvas to window size
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    // draw all the bricks
    for (y = 0; y < numOfRows; y++) {
        for (x = 0; x < widthDivisor; x++) {
            var b = new Brick(1, x * (ctx.canvas.width / widthDivisor), (ctx.canvas.height / widthDivisor) + (y * (ctx.canvas.height / heightDivisor)), ctx);
            b.draw(ctx);
            bricks.push(b);
        }
    }

    //create new platform and draw it
    var platform = new Platform(ctx.canvas.width / 2, ctx.canvas.width / 10, ctx);
    platform.draw(ctx);

    //spawn a ball
    var ball = new Ball(ctx.canvas.width / 2, ctx);
    ball.spawn(ctx);

    setInterval(function () {
        document.onmousemove = function (e) {
            mouseX = e.clientX;
        }
        update(canvas, ctx, mouseX, platform, bricks, ball)
    }, 17);
}

document.addEventListener("DOMContentLoaded", init, false);