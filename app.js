const gameParent = document.querySelector("#game-wrapper");
const game = gameParent.querySelector("#game");
var fps = 100;
var speedFactor = 0.001;
var minDelta = 0.5;
var autoScrollSpeed = 0.3;
var autoScrollTimer, restartTimer;
var isScrolling = false;
var prevPos = 0,
  currentPos = 0;
var currentTime, prevTime, timeDiff;

document.addEventListener("DOMContentLoaded", function () {
  times(8)(() => appendTiles());
  addRandomSafeTiles();
  game.querySelector("input.safe").addEventListener("click", setAutoScroll);
  clickTile();
  game.addEventListener("scroll", tileOverflow);
  gameScore();
});

function appendTiles() {
  var rows = document.createElement("div");
  times(4)(() => (rows.innerHTML += '<input type="button" />'));
  game.appendChild(rows);
}

function removeTiles() {
  var row = game.querySelectorAll("div")[0];
  row.remove();
}

function addRandomSafeTiles() {
  game.querySelectorAll("div").forEach((row) => {
    if (
      !row.querySelectorAll(".safe").length &&
      !row.querySelectorAll(".clicked").length
    ) {
      var randTile = Math.floor(Math.random() * 4);
      row.querySelectorAll("input")[randTile].classList.add("safe");
    }
  });
}

function clickTile() {
  var score = 0;
  var clickedTiles = 0;
  game.addEventListener("click", function () {
    if (event.target.matches("input.safe")) {
      event.target.classList.replace("safe", "clicked");
      score++;
      clickedTiles++;
      document.querySelector("#score").innerHTML = score;
      if (clickedTiles == 4) {
        times(4)(() => appendTiles());
        addRandomSafeTiles();
        // times(4)(() => removeTiles());
        clickedTiles = 0;
        autoScrollSpeed += 0.02;
      }
    } else {
      userDied();
    }
  });
}

function userDied() {
  var deathScreen = `<div id="deathScreen">
                        <h1>You died</h1>
                    </div>`;
  game.innerHTML = deathScreen;
}

function tileOverflow() {
  if (!document.querySelector("#deathScreen")) {
    var lastRow = game.querySelectorAll("input.safe")[0];
    var offsetTop = lastRow.offsetTop;
    var scrollOffset = game.scrollTop;
    if (offsetTop < scrollOffset) {
      userDied();
    }
  }
}

function gameScore() {
  var score = document.createElement("span");
  score.setAttribute("id", "score");
  score.innerHTML = "0";
  gameParent.appendChild(score);
}

function setAutoScroll() {
  if (autoScrollTimer) {
    clearInterval(autoScrollTimer);
  }
  autoScrollTimer = setInterval(function () {
    currentTime = Date.now();
    if (prevTime) {
      if (!isScrolling) {
        timeDiff = currentTime - prevTime;
        currentPos += autoScrollSpeed * timeDiff;
        if (Math.abs(currentPos - prevPos) >= minDelta) {
          isScrolling = true;
          game.scrollTo(0, currentPos);
          isScrolling = false;
          prevPos = currentPos;
          prevTime = currentTime;
        }
      }
    } else {
      prevTime = currentTime;
    }
  }, 1000 / fps);
}

const times = (x) => (f) => {
  if (x > 0) {
    f();
    times(x - 1)(f);
  }
};
