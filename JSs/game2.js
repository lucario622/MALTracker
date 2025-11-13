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
      //   searchresults.innerHTML += "No Results";
      searchresults.hidden = true;
    }
  }
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
