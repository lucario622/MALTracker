var binds;

function init() {
  binds = localStorage.getItem("binds");
  if (binds != null) {
    binds = JSON.parse(binds);
  }
  generalinit();
}

function start() {
  makeDatas();

  assembleGroups();

  let curName = localStorage.getItem("transfer");
  console.log(curName);
  console.log(entryFromTitle(curName));

  let curEntry = entryFromTitle(curName);
  let covervar = binds[curEntry.title];
  if (covervar == undefined) {
    if (
      curEntry.title.includes("'") ||
      curEntry.title.includes("*") ||
      curEntry.title.includes("II") ||
      curEntry.title.includes(">>") ||
      curEntry.title.includes(" - A Cruel F")
    ) {
      let temptitle = curEntry.title;
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
      console.log(curEntry.title);
    }
  }
  console.log(document.getElementById("coverimage"));
  document.getElementById("coverimage").src = "../images/covers/" + covervar;
  document.getElementById("coverimage").height = 750;
  document.getElementById("horiz").style.display = "block";
  console.log(covervar);
  console.log("AAAAAAAAAAAAAAA");
  let allboxes = document.getElementsByClassName("information");
  data.sort(compareMALScore).reverse();

  document.getElementsByClassName("f1-1")[0].innerText = curEntry.MALscore;
  let lastscored = 0;
  for (let i = 0; i < data.length; i++) {
    const e = data[i];
    if (e.MALscore == 0) {
      lastscored = i - 1;
      break;
    }
  }
  let i = 0;
  allboxes[i++].innerText = curEntry.title;
  allboxes[i++].innerText =
    curEntry.position + " of " + gfrome(curEntry).groupName;

  if (data.indexOf(curEntry) > lastscored) {
    allboxes[i++].innerText = "-";
  } else allboxes[i++].innerText = "Ranked #" + (data.indexOf(curEntry) + 1);
  console.log(curName);

  allboxes[i++].innerText = curEntry.airStatus;
  allboxes[i++].innerText = curEntry.premiered;
  allboxes[i].innerText = defaultdatetoreadable(curEntry.airstartdate);
  if (curEntry.airstartdate != curEntry.airenddate)
    allboxes[i++].innerText +=
      " to " + defaultdatetoreadable(curEntry.airenddate);
  else i++;
  allboxes[i++].innerText = curEntry.type;
  allboxes[i++].innerText = curEntry.genres.join(", ");
  allboxes[i++].innerText = curEntry.studios.join(", ");
  allboxes[i++].innerText = curEntry.licensors.join(", ");
  allboxes[i++].innerText = curEntry.demog;
  allboxes[i++].innerText = curEntry.rated;

  allboxes[i++].innerText = curEntry.status;
  allboxes[i++].innerText = curEntry.score;
  allboxes[i++].innerText = curEntry.watchedepisodes + "/" + curEntry.episodes;
  allboxes[i].innerText = defaultdatetoreadable(curEntry.startdate);
  if (curEntry.startdate != curEntry.enddate)
    allboxes[i++].innerText += " to " + defaultdatetoreadable(curEntry.enddate);
}
