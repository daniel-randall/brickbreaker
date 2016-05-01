class Platform{
    constructor(locX, size){
        this.x = locX;
        this.size = size;
        this.y = 50;
        this.boxHeight = 15;
    }

    draw(ctx){
        ctx.fillStyle = "#000000";
        ctx.fillRect(this.x, this.y, this.size, this.boxHeight);
        //document.write(this.boxHeight);
    }
}

function init() {
  var canvas = document.getElementById('game'),
      ctx = canvas.getContext('2d');

    // autosize canvas to window size
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    //create new platform and draw it
    var platform = new Platform(250, 300);
    platform.draw(ctx);
}

document.addEventListener("DOMContentLoaded", init, false);
