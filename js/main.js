function init() {
  var canvas = document.getElementById('game'),
    ctx = canvas.getContext('2d')

  ctx.fillStyle = "#000000";
    ctx.fillRect(100, 100, 500, 500);   
}

document.addEventListener("DOMContentLoaded", init, false);