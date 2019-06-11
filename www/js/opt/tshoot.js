$(document).ready(function() {
  $("#tshoot canvas").hide();

  canvas = document.getElementById("tshootCanvas");
  ctx = canvas.getContext("2d");
  ctx.imageSmoothingQuality = "hight";
});

window.addEventListener("keydown", function(e) {
  // space and arrow keys
  if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
    e.preventDefault();
  }
}, false);

var interval = 10;
var ctx;
var canvas;
var singePlayerInterval;
var stopGame = false;
var lastTime;
var currentTime;
var deltaTime;

var keys = {
  up: {
    key: "ArrowUp",
    pressed: false
  },
  down: {
    key: "ArrowDown",
    pressed: false
  },
  left: {
    key: "ArrowLeft",
    pressed: false
  },
  right: {
    key: "ArrowRight",
    pressed: false
  },
  exit: {
    key: "Escape",
    pressed: false
  }
}

function keyDownHandler(e) {
  for (let key in keys) {
    if (keys[key].key == e.key) {
      keys[key].pressed = true;
      //console.log(keys[key]);
    }
  }
}

function keyUpHandler(e) {
  for (let key in keys) {
    if (keys[key].key == e.key) {
      keys[key].pressed = false;
      //console.log(keys[key]);
    }
  }
}

function mouseClickHandler() {

}

var mouse = {
  x: 0,
  y: 0,
  update: function(evt) {
    mousePos = getMousePos(canvas, evt);
    mouse.x = mousePos.x;
    mouse.y = mousePos.y;
  }
};

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

var player = {
  x: 360,
  y: 240,
  angle: 0,
  radius: 20,
  speed: 200,
  lives: 3,
  draw: function() {
    // calculating
    player.angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);

    // movement
    if (keys.up.pressed && player.y > player.radius) {
      player.y -= player.speed * deltaTime;
    }
    if (keys.down.pressed && player.y < (canvas.height - player.radius)) {
      player.y += player.speed * deltaTime;
    }

    if (keys.left.pressed && player.x > player.radius) {
      player.x -= player.speed * deltaTime;
    }
    if (keys.right.pressed && player.x < (canvas.width - player.radius)) {
      player.x += player.speed * deltaTime;
    }

    // drawing
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.moveTo(player.x + (Math.cos(player.angle) * 10), player.y + (Math.sin(player.angle) * 10));
    ctx.lineTo(player.x + (Math.cos(player.angle) * 30), player.y + (Math.sin(player.angle) * 30))
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.closePath();
  }
};

var enemys = {
  list: [],
  add: function(level) {
    var e = new function() {
      this.x;
      this.y;
      this.level = level;
      this.rotate = 0;
      this.rotateSpeed = Math.PI / 5;
      this.speed = 125;
      this.radius = 20;

      this.draw = function() {
        var angle = Math.atan2((player.y - this.y), (player.x - this.x));
        var Dx = this.speed * Math.cos(angle);
        var Dy = this.speed * Math.sin(angle);
        this.x += Dx * deltaTime;
        this.y += Dy * deltaTime;
        this.rotate += this.rotateSpeed * deltaTime;

        genShape(this.x, this.y, this.radius, level + 2, this.rotate);
      }
    }

    var spawnSide = randomNumber(1, 4);
    console.log(spawnSide);

    if (spawnSide == 1) {
      e.x = -50;
      e.y = randomNumber(0, canvas.height);
    }
    if (spawnSide == 2) {
      e.y = -50;
      e.x = randomNumber(0, canvas.width);
    }
    if (spawnSide == 3) {
      e.x = canvas.width + 50;
      e.y = randomNumber(0, canvas.height);
    }
    if (spawnSide == 3) {
      e.y = canvas.height + 50;
      e.x = randomNumber(0, canvas.width);
    }

    enemys.list.push(e);
  }
}

function genShape(x, y, r, s, rotate = 0, color = "white") {
  sRadius = (Math.PI * 2) / s;
  ctx.beginPath();
  ctx.moveTo(x + (Math.cos(0 + rotate) * r), y + (Math.sin(0 + rotate) * r));
  for (var i = 1; i <= s; i++) {
    ctx.lineTo(x + (Math.cos(i * sRadius + rotate) * r), y + (Math.sin(i * sRadius + rotate) * r));
  }
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.closePath();
}

function randomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function singePlayerDraw(time) {
  currentTime = performance.now();
  deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  if (keys.exit.pressed) {
    stopSingleplayer();
  }
  if (stopGame) {
    stopGame == false;
    return;
  }

  //ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();
  for (e of enemys.list) {
    e.draw();
  }
  //genShape(100, 100, 20, 2, 1);
  window.requestAnimationFrame(singePlayerDraw);
}

function startSingleplayer() {
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  canvas.addEventListener("click", function(evt) {
    mouse.update(evt);
  }, false)
  canvas.addEventListener("mousemove", mouse.update, false);

  $("#tshoot .menu").hide(function() {
    $("#tshoot canvas").show(function() {
      lastTime = performance.now();
      window.requestAnimationFrame(singePlayerDraw);
    });
  });
}

function stopSingleplayer() {
  stopGame = true;

  document.removeEventListener("keydown", keyDownHandler);
  document.removeEventListener("keyup", keyUpHandler);
  canvas.removeEventListener("click", mouseClickHandler)
  canvas.removeEventListener("mousemove", mouse.update);


  $("#tshoot canvas").hide(300, function() {
    $("#tshoot .menu").show(300);
  });
}