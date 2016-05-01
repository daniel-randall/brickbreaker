function init() {
  var canvas = document.getElementById('game'),
    ctx = canvas.getContext('2d')
  
  // autosize canvas to window size
  ctx.canvas.width  = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
}

document.addEventListener("DOMContentLoaded", init, false);