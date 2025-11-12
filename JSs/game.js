var curindex = 0;
var shuffledData = [];
var sfwmode = true;
var chosenside;
var scoreArray = [];
var correctAnswers = 0;

function init() {
  generalinit();
  p.style.fontSize = "30px";
  p.style.color = "white"
  p.style.textAlign = "center"
  d.style.fontSize = "50px";
  d.style.wordWrap = "break-word";
  d.style.width = "100%"
  binds = localStorage.getItem("binds");
  if (binds != null) {
    binds = JSON.parse(binds);
  }
  display();
}

function start() {
  makeDatas();

  // List of Entries where only 2 are displayed
  middlearray = shuffleArray(data);
  shuffledData = [];
  for (let i = 0; i < middlearray.length; i++) {
    if (middlearray[i].MALscore > 0) {
      shuffledData.push(middlearray[i]);
    }
  }
}

function display() {
  console.log("Display");
  covervar = fixbind(shuffledData[curindex]);
  let c1 = document.getElementById("cover1");
  c1.src = "../images/covers/" + covervar;
  let t1 = document.getElementById("title1");
  t1.innerText = shuffledData[curindex].title;
  let s1 = document.getElementById("rating1");
  s1.innerText = shuffledData[curindex].MALscore;
  covervar = fixbind(shuffledData[curindex + 1]);
  let c2 = document.getElementById("cover2");
  c2.src = "../images/covers/" + covervar;
  let t2 = document.getElementById("title2");
  t2.innerText = shuffledData[curindex + 1].title;
  let s2 = document.getElementById("rating2");
  s2.innerText = "?.??";
  let e1 = document.getElementById("card1div");
  e1.onclick = () => {
    chosenside = "left";
    reveal();
  };
  let e2 = document.getElementById("card2div");
  e2.onclick = () => {
    chosenside = "right";
    reveal();
  };
  e2.style.backgroundColor = "";
  e1.style.backgroundColor = "";
}

function reveal() {
  console.log("Reveal");
  covervar = fixbind(shuffledData[curindex]);
  let c1 = document.getElementById("cover1");
  c1.src = "../images/covers/" + covervar;
  c1.src = "../images/covers/" + covervar;
  let t1 = document.getElementById("title1");
  t1.innerText = shuffledData[curindex].title;
  let s1 = document.getElementById("rating1");
  s1.innerText = shuffledData[curindex].MALscore;
  covervar = fixbind(shuffledData[curindex + 1]);
  let c2 = document.getElementById("cover2");
  c2.src = "../images/covers/" + covervar;
  let t2 = document.getElementById("title2");
  t2.innerText = shuffledData[curindex + 1].title;
  let s2 = document.getElementById("rating2");
  s2.innerText = shuffledData[curindex + 1].MALscore;
  let mainclick = document.getElementById("gamediv");
  let e1 = document.getElementById("card1div");
  e1.onclick = null;
  let e2 = document.getElementById("card2div");
  e2.onclick = null;
  let isCorrect = true;
  if (chosenside == "right") {
    if (shuffledData[curindex].MALscore > shuffledData[curindex + 1].MALscore) {
      e2.style.backgroundColor = "red";
      isCorrect = false;
    } else if (
      shuffledData[curindex].MALscore < shuffledData[curindex + 1].MALscore
    ) {
      e2.style.backgroundColor = "green";
    } else {
      e2.style.backgroundColor = "yellow";
    }
  } else {
    if (shuffledData[curindex].MALscore < shuffledData[curindex + 1].MALscore) {
      e1.style.backgroundColor = "red";
      isCorrect = false;
    } else if (
      shuffledData[curindex].MALscore > shuffledData[curindex + 1].MALscore
    ) {
      e1.style.backgroundColor = "green";
    } else {
      e1.style.backgroundColor = "yellow";
    }
  }
  if (isCorrect) {
    correctAnswers++;
    d.innerText += String.fromCharCode(9989);
  } else {
    d.innerText += String.fromCharCode(10060);
  }
  p.innerText = Math.round((100*correctAnswers/(curindex+1)))+"%"
  // p.innerText += " "
  setTimeout(() => {
    mainclick.onclick = nextLevel;
  }, 100);
}

function nextLevel() {
  let mainclick = document.getElementById("gamediv");
  mainclick.onclick = null;
  console.log("Next level");
  curindex++;
  if (curindex < shuffledData.length - 1) {
    display();
  }
}

function shuffleArray(array) {
  let currentIndex = array.length;
  let randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function fixbind(e) {
  if (sfwmode) {
    return "../fallback.jpg";
  }
  let covervar = binds[e.title];
  if (covervar == undefined) {
    if (
      e.title.includes("'") ||
      e.title.includes("*") ||
      e.title.includes("II") ||
      e.title.includes(">>") ||
      e.title.includes(" - A Cruel F")
    ) {
      let temptitle = e.title;
      for (let i = 0; i < temptitle.length; i++) {
        if (temptitle[i] == "'") {
          temptitle =
            temptitle.substring(0, i) +
            String.fromCharCode(8217) +
            temptitle.substring(i + 1);
        } else if (temptitle[i] == "*") {
          temptitle =
            temptitle.substring(0, i) +
            String.fromCharCode(9733) +
            temptitle.substring(i + 1);
        } else if (
          i < temptitle.length - 1 &&
          temptitle[i] == "I" &&
          temptitle[i + 1] == "I"
        ) {
          temptitle =
            temptitle.substring(0, i) +
            String.fromCharCode(8545) +
            temptitle.substring(i + 2);
        } else if (
          i < temptitle.length - 1 &&
          temptitle[i] == "<" &&
          temptitle[i + 1] == "<"
        ) {
          temptitle =
            temptitle.substring(0, i) + "&lt;" + temptitle.substring(i + 2);
        } else if (
          i < temptitle.length - 1 &&
          temptitle[i] == ">" &&
          temptitle[i + 1] == ">"
        ) {
          temptitle =
            temptitle.substring(0, i) + "&gt;&gt;" + temptitle.substring(i + 2);
        } else if (
          i < temptitle.length - 1 &&
          temptitle[i] == " " &&
          temptitle[i + 1] == "-"
        ) {
          temptitle =
            temptitle.substring(0, i) + "  -" + temptitle.substring(i + 2);
          break;
        }
      }
      covervar = binds[temptitle];
    } else {
      covervar = "../fallback.jpg";
      console.log("vv covervar == undefined");
      console.log(e.title);
    }
  }
  return covervar;
}
