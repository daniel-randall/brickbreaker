class Platform{
    constructor(locX, size, ctx){
        this.x = locX;
        this.size = size;
        this.y = ctx.canvas.height - (ctx.canvas.height / 10);
        this.boxHeight = window.innerHeight / 25;
    }

    draw(ctx){
      ctx.fillStyle = "#000000";
      ctx.fillRect(this.x, this.y, this.size, this.boxHeight);
    }

    update(ctx, mouseX){
      this.x = mouseX;
      ctx.fillRect(this.x, this.y, this.size, this.boxHeight);
    }

}

function init(evt) {
    var canvas = document.getElementById('game'),
        ctx = canvas.getContext('2d');

    var mouseX = ctx.canvas.width / 2;

    //generate a random number for spawning the platform
    var rand = Math.random() * 100;
    rand = Math.round(rand);
    rand = rand / 100

    // autosize canvas to window size
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    //create new platform and draw it
    var platform = new Platform(mouseX - (ctx.canvas.width / 5) / 2, ctx.canvas.width / 5, ctx);

    setInterval(function () {
      document.onmousemove = function(e){
        mouseX = e.clientX;
      }

      if(mouseX > canvas.width - (platform.size / 2)) {
          mouseX = canvas.width - (platform.size / 2);
      }
      else if(mouseX < platform.size / 2) {
          mouseX = platform.size / 2;
      }
      else{
          //do nothing
      }

      ctx.clearRect(0,0,canvas.width, canvas.height);
      platform.update(ctx, mouseX - (canvas.width / 5) / 2);
    }, 30);
}

function update(platform, ctx){

}

document.addEventListener("DOMContentLoaded", init, false);
