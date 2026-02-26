var options = [];
var remainder = [];
var choice;
var pastGuesses = [];
var guessTable;
var mins = [0, 0, 0];
var maxs = [10, 50000, 10000];
var truegs = [];
var falsegs = [];
var remainstext;

const re =
  /(malscore[:<>!][\d]{1,2}(\.\d\d?)?)|((eps|score)[:<>!][0-9]+)|((type|genre)[:!]"[A-Za-z\s]+")|((type|genre)[:!][^"][A-Za-z\-]*[^"\s])|(date[:<>!]\d{2}-\d{2}-\d{2})/g;

function init() {
  generalinit();
}

function start() {
  makeDatas();

  let searchbar = document.getElementById("searchbar");
  remainstext = document.getElementById("remains");
  searchbar.addEventListener("input", function () {
    displaysearchresults();
  });
  let searchresults = document.getElementById("searchresults");
  searchbar.addEventListener("blur", (event) => {
    setTimeout(() => {
      searchresults.hidden = true;
    },100)
  });
  searchbar.addEventListener("focus", (event) => {
    if (searchresults.innerHTML != "") searchresults.hidden = false;
  });
  searchresults.hidden = true;
  for (let i = 0; i < data.length; i++) {
    if (data[i].MALscore > 0) {
      options.push(data[i]);
      remainder.push(data[i]);
    }
  }

  choice = options[Math.floor(Math.random() * options.length)];
  guessTable = document.createElement("table");
  guessTable.style.color = "white";
  let thr = guessTable.insertRow();
  tableheaders = ["MAL Score", "Air Date", "Episodes", "Genres", "Title"];
  for (let i = 0; i < 5; i++) {
    let td = thr.insertCell();
    td.innerText = tableheaders[i];
  }
  let resultContainer = document.getElementById("wordlediv1");
  remainstext.innerText = options.length + " possibilities remain";
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
          options[i].title.toLowerCase().includes(searchbar.value.toLowerCase()) // only criteria is title
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
  }
  if (searchresults.innerHTML == "") {
    //   searchresults.innerHTML += "No Results";
    searchresults.hidden = true;
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

function searchsubmission() {
  let result = entryFromTitle(searchbar.value);
  if (result == -1) {
    window.alert(searchbar.value + " not found");
    return 0;
  }
  if (pastGuesses.includes(result)) {
    window.alert("You already guessed that bro");
    return 0;
  }
  pastGuesses.push(result);

  let tsr = guessTable.insertRow();
  let tc1 = tsr.insertCell();
  tc1.innerText = result.MALscore;
  if (choice.MALscore > result.MALscore) {
    // guessed too low, up arrow to indicate you need to go higher
    tc1.innerText += String.fromCharCode(8679);
    if (mins[0] < result.MALscore) mins[0] = result.MALscore + 0.01;
  } else if (choice.MALscore < result.MALscore) {
    tc1.innerText += String.fromCharCode(8681);
    if (maxs[0] > result.MALscore) maxs[0] = result.MALscore - 0.01;
  } else {
    tc1.style.color = "green";
    maxs[0] = result.MALscore;
    mins[0] = result.MALscore;
  }

  let tc2 = tsr.insertCell();
  tc2.innerText = defaultdatetoreadable(result.airstartdate);
  if (daycount(choice.airstartdate) > daycount(result.airstartdate)) {
    // guessed too far in the future
    tc2.innerText += String.fromCharCode(8678);
    if (mins[1] < daycount(result.airstartdate))
      mins[1] = daycount(result.airstartdate) + 1;
  } else if (daycount(choice.airstartdate) < daycount(result.airstartdate)) {
    tc2.innerText += String.fromCharCode(8680);
    if (maxs[1] > daycount(result.airstartdate))
      maxs[1] = daycount(result.airstartdate) - 1;
  } else {
    tc2.style.color = "green";
    maxs[1] = daycount(result.airstartdate);
    mins[1] = daycount(result.airstartdate);
  }

  let tc3 = tsr.insertCell();
  tc3.innerText = result.episodes;
  if (choice.episodes > result.episodes) {
    tc3.innerText += String.fromCharCode(8679);
    if (mins[2] < result.episodes) mins[2] = result.episodes + 1;
  } else if (choice.episodes < result.episodes) {
    tc3.innerText += String.fromCharCode(8681);
    if (maxs[2] > result.episodes) maxs[2] = result.episodes - 1;
  } else {
    tc3.style.color = "green";
    mins[2] = result.episodes;
    maxs[2] = result.episodes;
  }

  let tc4 = tsr.insertCell();
  tc4.innerText = "";
  for (let i = 0; i < result.genres.length; i++) {
    let curgenre = result.genres[i];
    if (choice.genres.includes(curgenre)) {
      tc4.innerHTML += '<span style="color: green;">' + curgenre;
      if (i != result.genres.length - 1) tc4.innerHTML += ", ";
      tc4.innerHTML += "</span>";
      if (!truegs.includes(curgenre)) truegs.push(curgenre);
    } else {
      tc4.innerHTML += '<span style="color: red;">' + curgenre;
      if (i != result.genres.length - 1) tc4.innerHTML += ", ";
      tc4.innerHTML += "</span>";
      if (!falsegs.includes(curgenre)) falsegs.push(curgenre);
    }
  }

  let tc5 = tsr.insertCell();
  tc5.innerText = result.title;
  if (result == choice) {
    tc5.style.color = "green";
  }

  trimRemainder();
  remainstext.innerText = remainder.length + " possibilities remain";
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
