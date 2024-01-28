let rs = require("readline-sync");

let runGame = () => {
  const gridSize = 5;
  let map = new Map();
  let ships = [];

  let createGrid = (gridSize) => {
    for (let i = 0; i < gridSize; i++) {
      for (let j = 1; j < gridSize + 1; j++) {
        map.set(`${String.fromCharCode(i + 65)}${j}`, false);
      }
    }
  };

  createGrid(gridSize);

  let randNum = (max) => Math.floor(Math.random() * max);
  let randLetter = () =>
    String.fromCharCode(Math.round((Math.random() + 1) * (gridSize - 1)) + 56);
  let randLetterV = (max) =>
    String.fromCharCode(Math.round(Math.random() * max) + 65);

  let createOrientation = () => {
    let oneOrZero = Math.random();
    if (oneOrZero > 0.5) {
      return "horizontal";
    } else return "vertical";
  };

  let testPlacement = (length, ships, rL, rN) => {
    for (let i = 0; i < length; i++) {
      if (ships.includes(`${rL}${rN + i + 1}`)) {
        rL = randLetter();
        rN = randNum(gridSize - length + 1);
        testPlacement();
      } else if (!ships.includes(`${rL}${rN + i + 1}`)) {
        map.set(`${rL}${rN + i + 1}`, true);
      }
    }
  };

  let testPlacement2 = (length, ships, rL2, rN2) => {
    for (let i = 0; i < length; i++) {
      if (
        ships.includes(
          `${String.fromCharCode(rL2.charCodeAt(0) + i)}${rN2 + 1}`
        )
      ) {
        rL2 = randLetterV(gridSize - length);
        rN2 = randNum(gridSize);
      } else if (
        !ships.includes(
          `${String.fromCharCode(rL2.charCodeAt(0) + i)}${rN2 + 1}`
        )
      ) {
        ships.push(`${String.fromCharCode(rL2.charCodeAt(0) + i)}${rN2 + 1}`);
        map.set(
          `${String.fromCharCode(rL2.charCodeAt(0) + i)}${rN2 + 1}`,
          true
        );
      }
    }
  };

  let createShip = (orientation, length, gridSize, ships) => {
    let rN = randNum(gridSize - length);
    let rL = randLetter();
    let rN2 = randNum(gridSize);
    let rL2 = randLetterV(gridSize - length);

    if (orientation === "horizontal") {
      testPlacement(length, ships, rL, rN);
      for (let i = 0; i < length; i++) {
        if (ships.includes(`${rL}${rN + i + 1}`) === false) {
          ships.push(`${rL}${rN + i + 1}`);
          map.set(`${rL}${rN + i + 1}`, true);
        }
      }
    } else if (orientation === "vertical") {
      testPlacement2(orientation, length, gridSize, ships);
      for (let i = 0; i < length; i++) {
        if (
          ships.includes(
            `${String.fromCharCode(rL2.charCodeAt(0) + i)}${rN2 + 1}`
          ) === false
        ) {
          ships.push(`${String.fromCharCode(rL2.charCodeAt(0) + i)}${rN2 + 1}`);
          map.set(
            `${String.fromCharCode(rL2.charCodeAt(0) + i)}${rN2 + 1}`,
            true
          );
        }
      }
    }
  };

  const fleet = [5, 5, 5, 5, 5];

  fleet.map((ship) => {
    createShip(createOrientation(), ship, gridSize, ships);
  });

  let guesses = [];
  console.log(ships)
  rs.question("Press any key to start the game. ");
  const promptLocation = () => {
    let guess = rs.question("Enter a location to strike ie 'A2': ");
    if (map.get(guess) === undefined) {
      guess = rs.question(
        "Please enter a valid area: valid areas include A1 through J10 "
      );
      return promptLocation();
    } else if (guesses.includes(guess)) {
      console.log("You already guessed here! ");
      return promptLocation();
    } else if (map.get(guess) === false) {
      console.log("You missed! ");
      guesses.push(guess);
      return promptLocation();
    } else {
      map.set(guess, false);
      guesses.push(guess);
      console.log("Hit! ");
      ships.pop(guess);
      if (ships.length === 0) {
        console.log("You win! You have sunk them all!");
        let query = rs.keyInYN("Do you want to play again?");
        if (query) {
          runGame();
        } else {
          return console.log("Hope you had fun playing!");
        }
      }
      return promptLocation();
    }
  };

  promptLocation();

};

runGame();
