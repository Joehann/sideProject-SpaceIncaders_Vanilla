const container = document.querySelector(".grid");
const display = document.querySelector("h2");
let results = 0;
let allDivs;
let alienInvaders = [];
let shooterPosition = 229;
let direction = 1;
let width = 20;

const createGridAndAliens = () => {
  let indexAttr = 0;
  //Create blocks on the grid
  for (i = 0; i < 240; i++) {
    if (indexAttr === 0) {
      const block = document.createElement("div");
      block.setAttribute("data-left", "true");
      container.appendChild(block);
      indexAttr++;
    } else if (indexAttr === 19) {
      const block = document.createElement("div");
      block.setAttribute("data-right", "true");
      container.appendChild(block);
      indexAttr = 0;
    } else {
      const block = document.createElement("div");
      container.appendChild(block);
      indexAttr++;
    }
  }

  //Add aliens
  for (i = 1; i < 53; i++) {
    if (i === 13) {
      i = 21;
      alienInvaders.push(i);
    } else if (i === 33) {
      i = 41;
      alienInvaders.push(i);
    } else {
      alienInvaders.push(i);
    }
  }
  //   console.log(alienInvaders);

  allDivs = document.querySelectorAll(".grid div");
  alienInvaders.forEach((invader) => {
    allDivs[invader].classList.add("alien");
  });

  allDivs[shooterPosition].classList.add("shooter");
};

createGridAndAliens();

//Movements of the shooter
const moveShooters = (e) => {
  allDivs[shooterPosition].classList.remove("shooter");

  if (e.keyCode === 37) {
    if (shooterPosition > 220) {
      shooterPosition -= 1;
    }
  } else if (e.keyCode === 39) {
    if (shooterPosition < 239) {
      shooterPosition += 1;
    }
  }
  allDivs[shooterPosition].classList.add("shooter");
};
document.addEventListener("keydown", moveShooters);

// Movements of the aliens
let downRight = true;
let downLeft = true;

const moveAliens = () => {
  for (let i = 0; i < alienInvaders.length; i++) {
    if (allDivs[alienInvaders[i]].getAttribute("data-right") === "true") {
      if (downRight) {
        direction = 20;
        setTimeout(() => {
          downRight = false;
        }, 50);
      } else if (downRight === false) {
        direction = -1;
      }
      downLeft = true;
    } else if (allDivs[alienInvaders[i]].getAttribute("data-left") === "true") {
      if (downLeft) {
        direction = 20;
        setTimeout(() => {
          downLeft = false;
        }, 50);
      } else if (downLeft === false) {
        direction = 1;
      }
      downRight = true;
    }
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    allDivs[alienInvaders[i]].classList.remove("alien");
  }
  for (let i = 0; i < alienInvaders.length; i++) {
    alienInvaders[i] += direction;
  }
  for (let i = 0; i < alienInvaders.length; i++) {
    allDivs[alienInvaders[i]].classList.add("alien");
  }

  if (allDivs[shooterPosition].classList.contains("alien", "shooter")) {
    display.textContent = "Game Over";
    allDivs[shooterPosition].classList.add("boom");
    clearInterval(invaderId);
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    if (alienInvaders[i] > allDivs.length - width) {
      display.textContent = "Game Over";
      clearInterval(invaderId);
    }
  }
};
invaderId = setInterval(moveAliens, 500);

// Laser

function shoot(e) {
  let laserId;
  let activeLaser = shooterPosition;

  const moveLaser = () => {
    allDivs[activeLaser].classList.remove("laser");
    activeLaser -= width;
    allDivs[activeLaser].classList.add("laser");

    if (allDivs[activeLaser].classList.contains("alien")) {
      allDivs[activeLaser].classList.remove("laser");
      allDivs[activeLaser].classList.remove("alien");
      allDivs[activeLaser].classList.add("boom");

      alienInvaders = alienInvaders.filter((el) => el !== activeLaser);

      setTimeout(() => allDivs[activeLaser].classList.remove("boom"), 250);
      clearInterval(laserId);

      results++;
      if (results === 36) {
        display.textContent = "Bravo, c'est gagné !";
        clearInterval(invaderId);
      } else {
        display.textContent = `Score : ${results}`;
      }
    }

    if (activeLaser < width) {
      clearInterval(laserId);
      setTimeout(() => {
        allDivs[activeLaser].classList.remove("laser");
      }, 100);
    }
  };

  if (e.keyCode === 32) {
    laserId = setInterval(() => {
      moveLaser();
    }, 100);
  }
}

document.addEventListener("keyup", shoot);
