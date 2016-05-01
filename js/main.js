function init() {
  var canvas = document.getElementById('game'),
      ctx = canvas.getContext('2d');
  
    // autosize canvas to window size
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    
    //create new platform and draw it
    var platform = new Platform(100, 100, 150);
}

document.addEventListener("DOMContentLoaded", init, false);

class Platform{
    constructor(locX, locY, size){
        this.x = locX;
        this.y = locY;
        this.size = size
        
        const this.BOX_HEIGHT = 15;
    }
    
    function drawPlatform(ctx){
        ctx.fillStyle = "#afafaf";
        ctx.fillRect(x, y, x+size, y+this.BOX_HEIGHT);
    }
}