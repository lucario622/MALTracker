var options = [];
var choice;
var pastGuesses = [];
var guessTable;
var headingchoices;
var rows = 3;
var cols = 3;
var gameCells;

const re =
  /(malscore[:<>!][\d]{1,2}(\.\d\d?)?)|((eps|score)[:<>!][0-9]+)|((type|genre)[:!]"[A-Za-z\s]+")|((type|genre)[:!][^"][A-Za-z\-]*[^"\s])|(date[:<>!]\d{2}-\d{2}-\d{2})/g;

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
  searchbar.addEventListener("blur", (event) => {
    setTimeout(() => {
      searchresults.hidden = true;
    }, 200);
  });
  searchbar.addEventListener("focus", (event) => {
    if (searchresults.innerHTML != "") searchresults.hidden = false;
  });
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
    // maybe just keep it to genre? that was hard enough to code by itself
    // at least the others are individually simpler than genres

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
        } else if (mynumber < 27) {
          // Type (TV MOVIE OVA ONA SPECIAL TV_SPECIAL)
          if (alreadyChosen.includes(filtboxarray[0][mynumber - 21])) {
            console.warn("you already took " + filtboxarray[0][mynumber - 21]);
            continue;
          }
          let possibilities = reduceList(
            options,
            "type",
            filtboxarray[0][mynumber - 21]
          );
          if (possibilities.length >= cols) {
            headingchoices[0][i] = ["type", filtboxarray[0][mynumber - 21]];
            alreadyChosen.push(filtboxarray[0][mynumber - 21]);
            break;
          } else {
            console.log(
              "not enough entries with type " + filtboxarray[0][mynumber - 21]
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
        mynumber = Math.floor(Math.random() * 26);
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
        } else {
          let category = mynumber - 16;
          if (alreadyChosen.includes(category)) {
            console.warn("you already took " + category + " bro");
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
              "score",
              category
            );
            if (
              possibilities[k].length >= 1 &&
              headingchoices[0][k][1] != category
            ) {
              headingchoices[1][j] = ["score", category];
              console.log(
                "sufficient (" +
                  possibilities[k].length +
                  ") entries with score " +
                  category +
                  " & " +
                  headingchoices[0][k][0] +
                  " " +
                  headingchoices[0][k][1]
              );
            } else {
              console.log(
                "not enough entries with score " +
                  category +
                  " & " +
                  headingchoices[0][k][0] +
                  " " +
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
    td.innerHTML = "<div class='catcell'>" + headingchoices[1][i][1] + "<div>";
    // td.className = "catcell"
    // td.innerText = headingchoices[1][i][1];
  }
  gameCells = [];
  for (let i = 0; i < rows; i++) {
    gameCells.push([]);
    let gameRow = guessTable.insertRow();
    let td = gameRow.insertCell();
    // td.innerText = headingchoices[0][i][1];
    td.style.width = "0%";
    // td.className = "catcell"
    td.innerHTML = "<div class='catcell'>" + headingchoices[0][i][1] + "<div>";
    for (let j = 0; j < cols; j++) {
      gameCells[i][j] = gameRow.insertCell();
      gameCells[i][j].innerText = reduceList(
        reduceList(options, headingchoices[0][i][0], headingchoices[0][i][1]),
        headingchoices[1][j][0],
        headingchoices[1][j][1]
      ).length;
      // gameCells[i][j].classList.add("dokucell")
      gameCells[i][j].innerHTML =
        '<div class="dokucell"onclick="searchsubmission(' +
        i +
        "," +
        j +
        ')">' +
        reduceList(
          reduceList(options, headingchoices[0][i][0], headingchoices[0][i][1]),
          headingchoices[1][j][0],
          headingchoices[1][j][1]
        ).length;
      +"</div>";
    }
  }
  let resultContainer = document.getElementById("wordlediv1");
  resultContainer.appendChild(guessTable);
}

function displaysearchresults() {
  let searchresults = document.getElementById("searchresults");
  let searchbar = document.getElementById("searchbar");
  if (isAdvanced(searchbar.value)) {
    searchresults.hidden = false;
    searchresults.innerHTML = "";
    advancedSearchResults(searchbar.value);
  } else {
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
    }
    if (searchresults.innerHTML == "") {
      searchresults.hidden = true;
    }
  }
}

function isAdvanced(query) {
  // find out if the search is intended to be an advanced one, probably by finding certain words (type,eps,date,MALScore,genre,Score) before certain symbols ( : < > ! )
  // RegEx for (type|eps|date|malscore|genre|score)[:<>!] or smth
  return re.test(query);
}

function advancedSearchResults(query) {
  // 1. split by space
  let regQuery = query.match(re);
  // 2. discard invalid attributes
  // 3. create criteria (min-max & exclude list for eps,date,malscore,score, direct match for type, and include/exclude list for genre)

  // eps date malscore score
  let mins = [0, -Infinity, 0, 0];
  let maxs = [Infinity, Infinity, 10, 10];
  // genre type
  let includeList = [];
  // genre eps date malscore score
  let excludeLists = [[], [], [], [], []];
  let exactType = null;
  for (let i = 0; i < regQuery.length; i++) {
    const cur = regQuery[i];
    let ind = cur.search(/[:<>!]/);
    let cursymbol = cur[ind];
    let attr = cur.substring(0, ind);
    let dataValue = cur.substring(ind + 1);
    if (dataValue.indexOf('"') != -1) {
      dataValue = dataValue.substring(1, dataValue.length - 1);
    }
    switch (attr) {
      case "genre":
        if (filtboxarray[5].includes(dataValue)) {
          // valid genre
          if (cursymbol == ":") {
            // include
            if (!includeList.includes(dataValue)) {
              // make sure not to fill with duplicates
              if (excludeLists[0].includes(dataValue)) {
                // remove from other list assuming the most recent one is right
                excludeLists[0].splice(excludeLists[0].indexOf(dataValue), 1);
              }
              // add to include list
              includeList.push(dataValue);
            }
          } else {
            // exclude
            if (!excludeLists[0].includes(dataValue)) {
              // make sure not to fill with duplicates
              if (includeList.includes(dataValue)) {
                // remove from other list assuming the most recent one is right
                includeList.splice(includeList.indexOf(dataValue), 1);
              }
              // add to exclude list
              excludeLists[0].push(dataValue);
            }
          }
        }
        break;
      case "type":
        if (filtboxarray[0].includes(dataValue)) {
          // valid type
          if (cursymbol == ":") {
            exactType = dataValue;
          }
        }
        break;
      case "eps":
        dataValue = parseInt(dataValue);
        if (!dataValue.isNaN && dataValue >= 0) {
          // valid episode count
          switch (cursymbol) {
            case ":":
              // exact
              mins[0] = dataValue;
              maxs[0] = dataValue;
              break;
            case "!":
              // weird useless exclude case
              excludeLists[1].push(dataValue);
              break;
            case "<":
              // max episodes
              // only update if:
              //  It wouldn't do nothing if combined with the existing max
              //  It wouldn't create 0 possible values
              if (dataValue < maxs[0] && dataValue >= mins[0])
                maxs[0] = dataValue;
              break;
            case ">":
              // min episodes
              if (dataValue > mins[0] && dataValue <= maxs[0])
                mins[0] = dataValue;
              break;
            default:
              break;
          }
        }
        break;
      case "date":
        // due to incredible coding skill, no dates are invalid
        switch (cursymbol) {
          case ":":
            // exact
            mins[1] = daycount(dataValue);
            maxs[1] = daycount(dataValue);
            break;
          case "!":
            // weird useless exclude case
            excludeLists[1].push(daycount(dataValue));
            break;
          case "<":
            // latest date
            // only update if:
            //  It wouldn't do nothing if combined with the existing max
            //  It wouldn't create 0 possible values
            // HOWEVER, doing this with my daycount function means assign a min value
            if (daycount(dataValue) > mins[1] && daycount(dataValue) <= maxs[1])
              mins[1] = daycount(dataValue);
            break;
          case ">":
            // earliest date
            if (daycount(dataValue) < maxs[1] && daycount(dataValue) >= mins[1])
              maxs[1] = daycount(dataValue);
            break;
          default:
            break;
        }
        break;
      case "malscore":
        dataValue = parseFloat(dataValue);
        if (!dataValue.isNaN && dataValue >= 1 && dataValue <= 10) {
          // valid mal score
          switch (cursymbol) {
            case ":":
              // exact
              mins[2] = dataValue;
              maxs[2] = dataValue;
              break;
            case "!":
              // weird useless exclude case
              excludeLists[3].push(dataValue);
              break;
            case "<":
              // max score
              // only update if:
              //  It wouldn't do nothing if combined with the existing max
              //  It wouldn't create 0 possible values
              if (dataValue < maxs[2] && dataValue >= mins[2])
                maxs[2] = dataValue;
              break;
            case ">":
              // min score
              if (dataValue > mins[2] && dataValue <= maxs[2])
                mins[2] = dataValue;
              break;
            default:
              break;
          }
        }
        // TODO code in this and the score one. make sure this one allows decimals somehow
        break;
      case "score":
        dataValue = parseInt(dataValue);
        if (!dataValue.isNaN && dataValue >= 1 && dataValue <= 10) {
          // valid score
          switch (cursymbol) {
            case ":":
              // exact
              mins[3] = dataValue;
              maxs[3] = dataValue;
              break;
            case "!":
              // weird useless exclude case
              excludeLists[4].push(dataValue);
              break;
            case "<":
              // max score
              // only update if:
              //  It wouldn't do nothing if combined with the existing max
              //  It wouldn't create 0 possible values
              if (dataValue < maxs[3] && dataValue >= mins[3])
                maxs[3] = dataValue;
              break;
            case ">":
              // min score
              if (dataValue > mins[3] && dataValue <= maxs[3])
                mins[3] = dataValue;
              break;
            default:
              break;
          }
        }
        break;
      default:
        break;
    }
  }
  if (
    mins[0] == 0 &&
    mins[1] == -Infinity &&
    mins[2] == 0 &&
    mins[3] == 0 &&
    maxs[0] == Infinity &&
    maxs[1] == Infinity &&
    maxs[2] == 10 &&
    maxs[3] == 10 &&
    includeList.length == 0 &&
    excludeLists[0].length == 0 &&
    excludeLists[1].length == 0 &&
    excludeLists[2].length == 0 &&
    excludeLists[3].length == 0 &&
    excludeLists[4].length == 0 &&
    exactType == null
  ) {
    searchresults.hidden = true;
    return false;
  }
  let sresults = [];
  for (let e of options) {
    if (
      e.episodes >= mins[0] &&
      e.episodes <= maxs[0] &&
      !excludeLists[1].includes(e.episodes) &&
      daycount(e.airstartdate) >= mins[1] &&
      daycount(e.airstartdate) <= maxs[1] &&
      !excludeLists[2].includes(daycount(e.airstartdate)) &&
      e.MALscore >= mins[2] &&
      e.MALscore <= maxs[2] &&
      !excludeLists[3].includes(e.MALscore) &&
      e.score >= mins[3] &&
      e.score <= maxs[3] &&
      !excludeLists[4].includes(e.score) &&
      isSubSet(includeList, e.genres) &&
      !hasAnyOverlap(excludeLists[0], e.genres) &&
      (exactType == null || exactType == e.type)
    ) {
      sresults.push(e);
    }
  }
  for (let e of sresults) {
    pr = document.createElement("p");
    pr.innerText = e.title;
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

function isSubSet(a, S) {
  let result = true;
  for (let e of a) {
    result = result && S.includes(e);
  }
  return result;
}

function hasAnyOverlap(a, S) {
  let result = false;
  for (let e of a) {
    result = result || S.includes(e);
  }
  return result;
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

  // gameCells[i][j].innerHTML = corrects.includes(result);
  if (corrects.includes(result)) {
    console.log(gameCells[i][j].childNodes[0]);
    gameCells[i][j].childNodes[0].innerText = result.title;
  } else {
    window.alert(result + " is incorrect.");
  }
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
