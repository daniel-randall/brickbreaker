function init() {
  var canvas = document.getElementById('game'),
    ctx = canvas.getContext('2d')
  
  // autosize canvas to window size
  var ctx = (a canvas context);
  ctx.canvas.width  = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  ctx.fillStyle = "#000000";
  ctx.fillRect(100, 100, 500, 500);   
}

document.addEventListener("DOMContentLoaded", init, false);