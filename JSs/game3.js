var options = [];
var choice;
var pastGuesses = [];
var guessTable;
var headingchoices;
var rows = 3;
var cols = 3;
var gameCells;

function init() {
  generalinit();
}

function start() {
  makeDatas();

  let searchbar = document.getElementById("searchbar");
  searchbar.addEventListener("input", function () {
    displaysearchresults();
  });
  let searchresults = document.getElementById("searchresults");
  searchresults.hidden = true;
  for (let i = 0; i < data.length; i++) {
    if (data[i].status == "Completed") {
      options.push(data[i]);
    }
  }

  let tryagain = true;
  while (tryagain) {
    let tries = 0;
    console.log("Trying again :(");
    tryagain = false;
    headingchoices = [[], []];
    // headings should be one of: genre, type, Score, most likely genre because theres 21 of those against 6 types and 5 scores 21+6+5 = 32

    let alreadyChosen = [];
    for (let i = 0; i < rows; i++) {
      while (true) {
        mynumber = Math.floor(Math.random() * 32);
        if (mynumber < 21) {
          if (alreadyChosen.includes(filtboxarray[5][mynumber])) {
            console.warn(
              "you already took " + filtboxarray[5][mynumber] + " bro"
            );
            continue;
          }
          if (mynumber == 4 || mynumber == 18 || mynumber == 17) {
            console.warn("cant have that one");
            continue;
          }
          let possibilities = reduceList(
            options,
            "genres",
            filtboxarray[5][mynumber]
          );
          if (possibilities.length >= cols) {
            headingchoices[0][i] = ["genres", filtboxarray[5][mynumber]];
            alreadyChosen.push(filtboxarray[5][mynumber]);
            break;
          } else {
            console.log(
              "not enough entries with genre " + filtboxarray[5][mynumber]
            );
          }
        }
      }
      console.error(headingchoices[0][i][1] + " passed");
    }

    let finalPossibilities = [];
    for (let j = 0; j < cols; j++) {
      let goOn = [];
      for (let k = 0; k < rows; k++) {
        goOn.push(false);
      }
      while (!allBoolTrue(goOn)) {
        goOn = [];
        for (let k = 0; k < rows; k++) {
          goOn.push(true);
        }
        mynumber = Math.floor(Math.random() * 21);
        if (mynumber < 21) {
          if (alreadyChosen.includes(filtboxarray[5][mynumber])) {
            console.warn(
              "you already took " + filtboxarray[5][mynumber] + " bro"
            );
            goOn[0] = false;
            continue;
          }
          if (mynumber == 4 || mynumber == 18) {
            console.warn("cant have that one");
            goOn[0] = false;
            continue;
          }
          let possibilities = [];
          for (let k = 0; k < rows; k++) {
            possibilities.push([]);
            possibilities[k] = reduceList(
              reduceList(
                options,
                headingchoices[0][k][0],
                headingchoices[0][k][1]
              ),
              "genres",
              filtboxarray[5][mynumber]
            );
            if (
              possibilities[k].length >= 1 &&
              headingchoices[0][k][1] != filtboxarray[5][mynumber]
            ) {
              headingchoices[1][j] = ["genres", filtboxarray[5][mynumber]];
              console.log(
                "sufficient (" +
                  possibilities[k].length +
                  ") entries with genres " +
                  filtboxarray[5][mynumber] +
                  " & " +
                  headingchoices[0][k][1]
              );
            } else {
              console.log(
                "not enough entries with genres " +
                  filtboxarray[5][mynumber] +
                  " & " +
                  headingchoices[0][k][1]
              );
              goOn[k] = false;
            }
          }
        }
        console.log(goOn);
        if (tries > 50) {
          tryagain = true;
          break;
        } else {
          tries++;
        }
      }
      console.error(headingchoices[1][j][1] + " Successfully passed");
      alreadyChosen.push(headingchoices[1][j][1]);
    }
  }
  console.log(headingchoices);

  guessTable = document.createElement("table");
  guessTable.style.color = "white";
  let thr = guessTable.insertRow();
  let td = thr.insertCell();
  td.innerText = "[\\]";
  for (let i = 0; i < cols; i++) {
    let td = thr.insertCell();
    td.innerText = headingchoices[1][i][1];
  }
  gameCells = [];
  for (let i = 0; i < rows; i++) {
    gameCells.push([]);
    let gameRow = guessTable.insertRow();
    let td = gameRow.insertCell();
    td.innerText = headingchoices[0][i][1];
    for (let j = 0; j < cols; j++) {
      gameCells[i][j] = gameRow.insertCell();
      //   gameCells[i][j].innerText = reduceList(
      //     reduceList(options, headingchoices[0][i][0], headingchoices[0][i][1]),
      //     headingchoices[1][j][0],
      //     headingchoices[1][j][1]
      //   )//.length;
      gameCells[i][j].innerHTML =
        '<button class="dokubutton" onclick="searchsubmission(' +
        i +
        "," +
        j +
        ')">Submit</button>';
    }
  }
  let resultContainer = document.getElementById("wordlediv1");
  resultContainer.appendChild(guessTable);
}

function displaysearchresults() {
  let searchresults = document.getElementById("searchresults");
  let searchbar = document.getElementById("searchbar");
  if (searchbar.value.length < 3) {
    searchresults.hidden = true;
  } else {
    searchresults.hidden = false;
    searchresults.innerHTML = "";
    for (let i = 0; i < options.length; i++) {
      if (
        options[i].title.toLowerCase().includes(searchbar.value.toLowerCase())
      ) {
        pr = document.createElement("p");
        pr.innerText = options[i].title;
        pr.style.cursor = "pointer";
        pr.style.margin = "2px";
        pr.style.userSelect = "none";
        pr.classList.add("searchresult");
        pr.onclick = function () {
          searchbar.value = this.innerText;
          searchresults.hidden = true;
        };
        searchresults.insertBefore(
          pr,
          searchresults.childNodes[searchresults.childNodes.length]
        );
      }
    }
    if (searchresults.innerHTML == "") {
      searchresults.hidden = true;
    }
  }
}

function searchsubmission(i, j) {
  let result = entryFromTitle(searchbar.value);
  if (result == -1) {
    window.alert(searchbar.value + " not found");
    return 0;
  }

  let corrects = reduceList(
    reduceList(options, headingchoices[0][i][0], headingchoices[0][i][1]),
    headingchoices[1][j][0],
    headingchoices[1][j][1]
  );

  gameCells[i][j].innerHTML = corrects.includes(result);
}

function trimRemainder() {
  let result = [];
  for (let i = 0; i < remainder.length; i++) {
    const e = remainder[i];
    if (
      e.MALscore >= mins[0] &&
      e.MALscore <= maxs[0] &&
      daycount(e.airstartdate) >= mins[1] &&
      daycount(e.airstartdate) <= maxs[1] &&
      e.episodes >= mins[2] &&
      e.episodes <= maxs[2]
    ) {
      let verdict = true;
      for (let j = 0; j < e.genres.length; j++) {
        if (falsegs.includes(e.genres[j])) {
          verdict = false;
        }
      }
      for (let j = 0; j < truegs.length; j++) {
        if (!e.genres.includes(truegs[j])) {
          verdict = false;
        }
      }
      if (verdict) result.push(e);
    }
  }
  remainder = result;
}
