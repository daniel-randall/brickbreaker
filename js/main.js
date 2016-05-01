class Platform{
    constructor(locX, size){
        this.x = locX;
        this.size = size;
        this.y = window.innerHeight - 50;
        this.boxHeight = window.innerHeight / 25;
    }

    draw(ctx){
      ctx.fillStyle = "#000000";
      ctx.fillRect(this.x, this.y, this.size, this.boxHeight);
    }

    update(ctx, evt){
      this.x = evt.clientX;
      ctx.fillRect(this.x, this.y, this.size, this.boxHeight);
    }

}
function init(evt) {
  var canvas = document.getElementById('game'),
      ctx = canvas.getContext('2d');

    //generate a random number for spawning the platform
    var rand = Math.random() * 100;
    rand = Math.round(rand);
    rand = rand / 100

    // autosize canvas to window size
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    //create new platform and draw it
    var platform = new Platform(ctx.canvas.width * rand, ctx.canvas.width / 5);
    platform.draw(ctx);

    setInterval(function () {
      ctx.clearRect(0,0,canvas.width, canvas.height);
      platform.update(ctx, evt);
    }, 1);
}

document.addEventListener("DOMContentLoaded", init, false);
window.addEventListener('mousemove', init, false);
