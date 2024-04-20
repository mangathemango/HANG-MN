let Dictionary = null;
const wrapper = document.getElementById("wrapper");
const subtitle = document.getElementById("subtitle");
const playbutton = document.getElementById("playbutton");
const title = document.getElementById("title");
let wordlist = null;
let lifearray = null;
let gameproceeding = null;

document.addEventListener("keypress", (event) => {
  if (gameproceeding === true) {
    if ("qwertyuiopasdfghjklzxcvbnm".split("").includes(event.key)) {
      checkletter(event.key);
    }
  }

  if (gameproceeding != true) {
    if (event.key === "Enter") {
      newgame();
    }
  }
});

const lifetext = () => {
  life = "";
  for (i = 0; i < lifearray.length; i++) {
    life += lifearray[i];
  }
  return "Life: " + life
}

const setfadetext = (element, fadein, fadeout) => {
  element.textContent = fadein;
  element.addEventListener("mouseover",function() {
    element.textContent = fadeout
  })
  element.addEventListener("mouseout",function() {
    element.textContent = fadein
  })
}

const removefadetext = (element, fadein, fadeout) => {
  element.removeEventListener("mouseover",function() {
    element.textContent = fadeout
  })
  element.removeEventListener("mouseout",function() {
    element.textContent = fadein
  })
}

const newgame = async () => {
  if (wordlist === null) {
    Dictionary = await fetch("dict.json").then((res) => res.json());
    wordlist = Object.keys(Dictionary);
  }

  lifearray = ["🧡", "❤️", "💛", "❤️", "❤️", "💚", "❤️", "❤️"];
  incorrect_guesses = [];
  gameproceeding = true;

  wrapper.innerHTML = "";
  life_number = 8;
  letter1guessed = false;
  letter2guessed = false;

  // Selects a random a 2 letter word
  let index = Math.floor(Math.random() * 107);
  answer = wordlist[index];
  answerdef = Dictionary[answer];
  letter1 = answer.split("")[0];
  letter2 = answer.split("")[1];

  guessing_tile = document.createElement("p");
  guessing_tile.textContent = "_ _";
  guessing_tile.id = "guessing_tile";
  wrapper.append(guessing_tile);

  hintbox = document.createElement("div");
  hintbox.id = "hintbox";
  wrapper.append(hintbox);

  

  wordtype = document.createElement("p");
  wordtype.id = "wordtype";
  wordtype.className = "hint"
  setfadetext(wordtype,"[Wo rd ty pe]","Unlocks when you lose 💚")
  hintbox.append(wordtype);

  worddef = document.createElement("p");
  worddef.id = "worddef";
  worddef.className = "hint"
  setfadetext(worddef,"[Wo rd de fi]","Unlocks when you lose 💛")
  hintbox.append(worddef);

  wordex = document.createElement("p");
  wordex.id = "wordex";
  wordex.className = "hint"
  setfadetext(wordex,"[Wo rd  ex am pl]","Unlocks when you lose 🧡")
  hintbox.append(wordex);

  lives = document.createElement("p");
  setfadetext(lives,lifetext(),"You die if you run out of these")
  lives.id = "lives";
  wrapper.append(lives);

  const letterbuttons = document.createElement("div");
  letterbuttons.id = "letter-buttons";
  wrapper.append(letterbuttons);
  const create_keyboard = (buttons, rownum) => {
    const row = document.createElement("div");
    row.id = "row-" + rownum;
    row.className = "row";
    letterbuttons.append(row);

    buttonlist = buttons.slice("");
    for (i = 0; i < buttonlist.length; i++) {
      const row = document.getElementById("row-" + rownum);
      button = document.createElement("button");
      button.className = "button";
      button.id = buttonlist[i];
      button.setAttribute("onclick", "checkletter('" + buttonlist[i] + "')");
      button.textContent = buttonlist[i];
      row.append(button);
    }
  };
  create_keyboard("qwertyuiop", 1);
  create_keyboard("asdfghjkl", 2);
  create_keyboard("zxcvbnm", 3);
};



const checkletter = (guessed_letter) => {
  if (incorrect_guesses.includes(guessed_letter) === false) {
    if (guessed_letter === letter1) {
      letter1guessed = true;
    } else if (guessed_letter === letter2) {
      letter2guessed = true;
    } else {
      life_number -= 1;
      lifearray.splice(-1, 1);
      incorrect_guesses.push(guessed_letter);
    }
  }
  updatescreen();
};

const updatescreen = () => {
  setfadetext(lives,lifetext(),"You die if you run out of these")

  if (letter1guessed === true) {
    firsttile = letter1;
    document.getElementById(letter1).style.backgroundColor = "lime";
  } else {
    firsttile = "_";
  }
  if (letter2guessed === true) {
    secondtile = letter2;
    document.getElementById(letter2).style.backgroundColor = "lime";
  } else {
    secondtile = "_";
  }
  guessing_tile.textContent = firsttile + " " + secondtile;

  if (life_number < 6) {
    removefadetext(wordtype,"[Wo rd ty pe]","Unlocks when you lose 💚")
    wordtype.textContent = answerdef.type;
  }
  if (life_number < 3) {
    removefadetext(worddef,"[Wo rd de fi]","Unlocks when you lose 💛")
    worddef.textContent = answerdef.definition;
  }

  if (letter1guessed === true && letter2guessed === true) {
    EndGame("WW");
  }
  if (life_number <= 0) {
    EndGame("LL");
  }

  for (i = 0; i < incorrect_guesses.length; i++) {
    incorrectbutton = document.getElementById(incorrect_guesses[i]);
    if (incorrectbutton != null) {
      incorrectbutton.style.backgroundColor = "red";
    }
  }
};

const EndGame = (outcome) => {
  gameproceeding = false;
  guessing_tile.textContent = letter1 + letter2;

  removefadetext(wordtype,"[Wo rd ty pe]","Unlocks when you lose 💚")
  removefadetext(worddef,"[Wo rd de fi]","Unlocks when you lose 💛")
  removefadetext(wordex,"[Wo rd  ex am pl]","Unlocks when you lose 🧡")
  wordtype.textContent = answerdef.type;
  worddef.textContent = answerdef.definition;
  wordex.textContent = answerdef.example;

  wrapper.removeChild(document.getElementById("letter-buttons"));
  wrapper.removeChild(document.getElementById("lives"));

  outcometext = document.createElement("p");
  outcometext.id = "outcometext";
  outcometext.textContent = "Yu " + outcome + "!!!";
  wrapper.append(outcometext);

  newgamebutton = document.createElement("button");
  newgamebutton.id = "newgame";
  newgamebutton.textContent = "MO RE DO IT!";
  newgamebutton.setAttribute("onclick", "newgame()");
  wrapper.append(newgamebutton);
};
