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

    update(ctx){
      this.x = event.clientX;
      ctx.fillRect(this.x, this.y, this.size, this.boxHeight);
    }

}
function init(evt) {
  var canvas = document.getElementById('game'),
      ctx = canvas.getContext('2d');

    // autosize canvas to window size
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    //create new platform and draw it
    var platform = new Platform(canvas.width / 2, ctx.canvas.width / 5);
    platform.draw(ctx);

    setInterval(function () {
      update(platform, ctx);
    }, 30);
}

function update(platform, ctx){
      platform.update(ctx);
}

document.addEventListener("DOMContentLoaded", init, false);
//window.addEventListener('mousemove', update, false);
